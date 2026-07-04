/**
 * FR-08 Standing credential: a long-lived machine secret — one that never
 * expires, or is older than the max age. Human passwords are out of scope
 * (governed by rotation policy, a different control); only secret/apiKey/
 * token/certificate types are considered.
 */
import type { Credential, CorrelatedAgent, Finding } from "@/lib/model/types";
import { rulesConfig } from "@/lib/config";
import { daysSince, formatDate } from "@/lib/util/date";

const cfg = rulesConfig.standingCredential;
const inScope = new Set(cfg.credentialTypes);

export function standingCredential(agents: CorrelatedAgent[], now: Date): Finding[] {
  if (!cfg.enabled) return [];
  const findings: Finding[] = [];

  for (const agent of agents) {
    const offenders = agent.credentials.filter((c) => isStanding(c, now));
    if (offenders.length === 0) continue;

    findings.push({
      id: `standing-credential:${agent.id}`,
      rule: "standing-credential",
      title: "Standing credential",
      agentId: agent.id,
      agentName: agent.name,
      agentType: agent.type,
      level: cfg.level,
      score: cfg.score,
      reason: `Agent "${agent.name}" has a long-lived ${offenders[0].type} that ${describe(offenders[0], now)} — a credential a leaked copy of which stays valid indefinitely.`,
      recommendedAction:
        "Rotate the secret and set an expiry; prefer short-lived tokens over standing secrets where possible.",
      evidence: offenders.map(
        (c) => `${c.type} (${c.source}) created ${formatDate(c.createdAt)}, ${describe(c, now)}`,
      ),
    });
  }

  return findings;
}

function isStanding(c: Credential, now: Date): boolean {
  if (!inScope.has(c.type)) return false;
  const neverExpires = c.expiresAt === null;
  const age = daysSince(now, c.createdAt);
  const tooOld = age !== undefined && age > cfg.maxCredentialAgeDays;
  return (cfg.flagNeverExpires && neverExpires) || tooOld;
}

function describe(c: Credential, now: Date): string {
  if (c.expiresAt === null) return "never expires";
  const age = daysSince(now, c.createdAt);
  return age !== undefined ? `is ${age} days old` : "has an unknown age";
}
