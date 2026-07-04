/**
 * FR-07 Separation-of-duties: an agent holding two roles that the policy
 * (config/sodConflicts.json) says must not be combined. Role matching is
 * case-insensitive and runs across the *correlated* access set, so a conflict
 * split across MidPoint and Keycloak is still caught.
 */
import type { CorrelatedAgent, Finding } from "@/lib/model/types";
import { rulesConfig, sodConflictsConfig } from "@/lib/config";

const cfg = rulesConfig.sodConflict;

export function sodConflict(agents: CorrelatedAgent[]): Finding[] {
  if (!cfg.enabled) return [];
  const findings: Finding[] = [];

  for (const agent of agents) {
    const roles = new Set(agent.access.map((a) => a.name.toLowerCase()));
    const hits = sodConflictsConfig.conflicts.filter(
      (c) => roles.has(c.a.toLowerCase()) && roles.has(c.b.toLowerCase()),
    );
    if (hits.length === 0) continue;

    const pairs = hits.map((h) => `${h.a} + ${h.b}`).join("; ");
    findings.push({
      id: `sod-conflict:${agent.id}`,
      rule: "sod-conflict",
      title: "Separation-of-duties conflict",
      agentId: agent.id,
      agentName: agent.name,
      agentType: agent.type,
      level: cfg.level,
      score: cfg.score,
      reason: `Agent "${agent.name}" holds conflicting duties (${pairs}). ${hits[0].reason}`,
      recommendedAction:
        "Split the conflicting duties across separate identities, or add a compensating approval control.",
      evidence: hits.map((h) => `${h.a} + ${h.b} — ${h.reason}`),
    });
  }

  return findings;
}
