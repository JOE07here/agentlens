/**
 * The scan pipeline (docs/Architecture_v0.2 §02):
 *   ingest → normalize → correlate → analyze (rules) → score → result
 *
 * Runs entirely in the browser. Resilient by design: a file that fails to parse
 * becomes a warning, and the scan continues with whatever did parse.
 */
import type { CorrelatedAgent, Identity, ScanResult, ScanStats } from "@/lib/model/types";
import { parseMidpoint } from "@/lib/adapters/midpoint";
import { parseKeycloak } from "@/lib/adapters/keycloak";
import { normalize } from "@/lib/normalize";
import { correlate } from "@/lib/correlate";
import { runRules } from "@/lib/rules";
import { score } from "@/lib/score";

export interface ScanInput {
  midpointXml?: string;
  keycloakJson?: string;
  /** Override "now" for deterministic tests. */
  now?: Date;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function computeStats(identities: Identity[], agents: CorrelatedAgent[]): ScanStats {
  const isSource = (a: CorrelatedAgent, s: "midpoint" | "keycloak") =>
    a.sources.length === 1 && a.sources[0] === s;
  return {
    totalIdentities: identities.length,
    humanCount: agents.filter((a) => a.type === "human").length,
    nonHumanCount: agents.filter((a) => a.type === "non-human").length,
    unknownCount: agents.filter((a) => a.type === "unknown").length,
    totalAgents: agents.length,
    correlatedCount: agents.filter((a) => a.sources.length > 1).length,
    midpointOnly: agents.filter((a) => isSource(a, "midpoint")).length,
    keycloakOnly: agents.filter((a) => isSource(a, "keycloak")).length,
  };
}

export function runScan(input: ScanInput): ScanResult {
  const now = input.now ?? new Date();
  const warnings: string[] = [];

  // 1) Ingest
  let midpointIdentities: Identity[] = [];
  let keycloakIdentities: Identity[] = [];

  if (input.midpointXml?.trim()) {
    try {
      midpointIdentities = parseMidpoint(input.midpointXml);
    } catch (error) {
      warnings.push(`MidPoint export could not be parsed: ${errorMessage(error)}`);
    }
  }
  if (input.keycloakJson?.trim()) {
    try {
      keycloakIdentities = parseKeycloak(input.keycloakJson);
    } catch (error) {
      warnings.push(`Keycloak export could not be parsed: ${errorMessage(error)}`);
    }
  }

  // 2) Normalize + classify
  const identities = normalize(midpointIdentities, keycloakIdentities);
  if (identities.length === 0) {
    throw new Error(
      warnings.length > 0
        ? warnings.join(" ")
        : "No identities were found in the provided files.",
    );
  }

  // 3) Correlate (the moat)
  const { agents, warnings: correlationWarnings } = correlate(identities);
  warnings.push(...correlationWarnings);

  // 4) Analyze → 5) Score & rank
  const findings = runRules(agents, now);
  const { findings: ranked, summary } = score(findings, agents);

  return {
    scannedAt: now.toISOString(),
    identities,
    agents,
    findings: ranked,
    summary,
    stats: computeStats(identities, agents),
    warnings,
  };
}
