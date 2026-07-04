/**
 * Correlate — THE moat (docs/Architecture_v0.2 §03③).
 *
 * Links the same logical agent across MidPoint and Keycloak so one real agent
 * shows up once, with its full picture: governance roles AND auth client AND
 * its secret. Strategies (config/correlation.json), first match wins:
 *   1. mapping   — explicit midpoint↔keycloak pairs for awkward names
 *   2. exactName — identical/normalized names across the two systems
 *   3. owner     — same owner on two non-human identities (fallback)
 *
 * Edge cases are surfaced, not hidden: no match → single-source agent;
 * many-to-one or ambiguous names → still linked, but flagged low-confidence
 * with a warning so a reviewer can check.
 */
import type {
  Access,
  CorrelatedAgent,
  Credential,
  Identity,
  IdentityType,
  MatchConfidence,
} from "@/lib/model/types";
import { correlationConfig } from "@/lib/config";

export interface CorrelationResult {
  agents: CorrelatedAgent[];
  warnings: string[];
}

const cfg = correlationConfig;

/** Reduce a name to a comparison key (lowercased, prefix-stripped, alnum-only). */
function normalizeKey(name: string): string {
  let key = cfg.normalize.lowercase ? name.toLowerCase() : name;
  for (const prefix of cfg.normalize.stripPrefixes) {
    const p = cfg.normalize.lowercase ? prefix.toLowerCase() : prefix;
    if (key.startsWith(p)) key = key.slice(p.length);
  }
  if (cfg.normalize.stripNonAlphanumeric) key = key.replace(/[^a-z0-9]/gi, "");
  return key;
}

function laterIso(a?: string, b?: string): string | undefined {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

function resolveType(identities: Identity[]): IdentityType {
  if (identities.some((i) => i.type === "non-human")) return "non-human";
  if (identities.some((i) => i.type === "human")) return "human";
  return "unknown";
}

function mergeAccess(identities: Identity[]): Access[] {
  const seen = new Set<string>();
  const access: Access[] = [];
  for (const identity of identities) {
    for (const entry of identity.access) {
      const dedupeKey = `${entry.source}:${entry.kind}:${entry.name.toLowerCase()}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      access.push(entry);
    }
  }
  return access;
}

function mergeCredentials(identities: Identity[]): Credential[] {
  return identities.flatMap((i) => i.credentials);
}

function buildAgent(
  id: string,
  identities: Identity[],
  matchReason: string | undefined,
  matchConfidence: MatchConfidence | undefined,
): CorrelatedAgent {
  const midpoint = identities.find((i) => i.source === "midpoint");
  const keycloak = identities.find((i) => i.source === "keycloak");
  const primary = midpoint ?? keycloak ?? identities[0];
  const sources = Array.from(new Set(identities.map((i) => i.source)));
  return {
    id,
    name: primary.name,
    displayName: identities.find((i) => i.displayName)?.displayName,
    type: resolveType(identities),
    sources,
    midpoint,
    keycloak,
    identities,
    access: mergeAccess(identities),
    credentials: mergeCredentials(identities),
    enabled: identities.some((i) => i.enabled),
    owner: identities.find((i) => i.owner)?.owner,
    lastActivityAt: identities.reduce<string | undefined>(
      (acc, i) => laterIso(acc, i.lastActivityAt),
      undefined,
    ),
    matchReason,
    matchConfidence,
  };
}

export function correlate(identities: Identity[]): CorrelationResult {
  const warnings: string[] = [];
  const byId = new Map(identities.map((i) => [i.id, i] as const));
  const consumed = new Set<string>();
  const agents: CorrelatedAgent[] = [];

  // Stamp a correlation key on every identity for the report/debugging.
  for (const identity of identities) identity.correlationKey = normalizeKey(identity.name);

  // 1) Explicit mappings win.
  if (cfg.strategies.includes("mapping")) {
    for (const mapping of cfg.mappings) {
      const mp = identities.find(
        (i) => i.source === "midpoint" && i.name === mapping.midpoint && !consumed.has(i.id),
      );
      const kc = identities.find(
        (i) => i.source === "keycloak" && i.name === mapping.keycloak && !consumed.has(i.id),
      );
      if (mp && kc) {
        consumed.add(mp.id).add(kc.id);
        agents.push(buildAgent(`agent:map:${mapping.midpoint}`, [mp, kc], mapping.reason, "high"));
      }
    }
  }

  // 2) Group the rest by normalized key.
  const groups = new Map<string, Identity[]>();
  for (const identity of identities) {
    if (consumed.has(identity.id)) continue;
    const key = identity.correlationKey ?? normalizeKey(identity.name);
    const group = groups.get(key) ?? [];
    group.push(identity);
    groups.set(key, group);
  }

  for (const [key, group] of groups) {
    const midpoints = group.filter((i) => i.source === "midpoint");
    const keycloaks = group.filter((i) => i.source === "keycloak");

    if (midpoints.length > 0 && keycloaks.length > 0) {
      // Cross-stack link.
      const ambiguous = midpoints.length > 1 || keycloaks.length > 1;
      let confidence: MatchConfidence;
      let reason: string;
      if (ambiguous) {
        confidence = "low";
        reason = `Ambiguous many-to-one match on "${key}" (${midpoints.length} MidPoint × ${keycloaks.length} Keycloak) — review before trusting.`;
        warnings.push(
          `Correlation: ambiguous match for "${group[0].name}" — ${midpoints.length} MidPoint and ${keycloaks.length} Keycloak identities share the key "${key}".`,
        );
      } else if (midpoints[0].name.toLowerCase() === keycloaks[0].name.toLowerCase()) {
        confidence = "exact";
        reason = `Linked by identical name "${midpoints[0].name}" across MidPoint and Keycloak.`;
      } else {
        confidence = "high";
        reason = `Linked by normalized name "${key}" (${midpoints[0].name} ↔ ${keycloaks[0].name}).`;
      }
      agents.push(buildAgent(`agent:${key}`, group, reason, confidence));
    } else {
      // Single-source: never merge two identities from the same system.
      const source = midpoints.length > 0 ? "MidPoint" : "Keycloak";
      for (const identity of group) {
        agents.push(
          buildAgent(`agent:${identity.id}`, [identity], `Only present in ${source}.`, undefined),
        );
      }
    }
  }

  // 3) Owner fallback: link an unmatched non-human MidPoint identity to an
  // unmatched non-human Keycloak agent that shares a non-empty owner.
  if (cfg.strategies.includes("owner")) {
    linkByOwner(agents, byId, warnings);
  }

  return { agents, warnings };
}

/** Best-effort owner-based linking of two single-source non-human agents. */
function linkByOwner(
  agents: CorrelatedAgent[],
  _byId: Map<string, Identity>,
  warnings: string[],
): void {
  const singleMidpoint = agents.filter(
    (a) => a.sources.length === 1 && a.sources[0] === "midpoint" && a.owner,
  );
  const singleKeycloak = agents.filter(
    (a) => a.sources.length === 1 && a.sources[0] === "keycloak" && a.owner,
  );
  for (const mp of singleMidpoint) {
    if (cfg.ownerMatchRequiresNonHuman && mp.type !== "non-human") continue;
    const matches = singleKeycloak.filter((kc) => kc.owner === mp.owner);
    if (matches.length !== 1) continue;
    const kc = matches[0];
    const merged = buildAgent(
      mp.id,
      [...mp.identities, ...kc.identities],
      `Linked by shared owner "${mp.owner}".`,
      "medium",
    );
    const mpIndex = agents.indexOf(mp);
    if (mpIndex >= 0) agents[mpIndex] = merged;
    const kcIndex = agents.indexOf(kc);
    if (kcIndex >= 0) agents.splice(kcIndex, 1);
    warnings.push(
      `Correlation: linked "${mp.name}" and "${kc.name}" by shared owner "${mp.owner}" (medium confidence).`,
    );
  }
}
