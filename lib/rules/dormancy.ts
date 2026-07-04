/**
 * FR-06 Dormancy: an enabled agent that has not been active beyond the
 * configured threshold. We only flag when we actually have a last-activity
 * date — "no activity data" is not the same as "dormant".
 */
import type { CorrelatedAgent, Finding } from "@/lib/model/types";
import { rulesConfig } from "@/lib/config";
import { daysSince, formatDate } from "@/lib/util/date";

const cfg = rulesConfig.dormancy;

export function dormancy(agents: CorrelatedAgent[], now: Date): Finding[] {
  if (!cfg.enabled) return [];
  const findings: Finding[] = [];

  for (const agent of agents) {
    if (!agent.enabled) continue;
    const idleDays = daysSince(now, agent.lastActivityAt);
    if (idleDays === undefined || idleDays <= cfg.dormantAfterDays) continue;

    findings.push({
      id: `dormancy:${agent.id}`,
      rule: "dormancy",
      title: "Dormant but enabled",
      agentId: agent.id,
      agentName: agent.name,
      agentType: agent.type,
      level: cfg.level,
      score: cfg.score,
      reason: `Agent "${agent.name}" last active ${idleDays} days ago (${formatDate(agent.lastActivityAt)}) but is still enabled — an unused standing entry point.`,
      recommendedAction:
        "Disable or deprovision this agent; it has been inactive well beyond the threshold.",
      evidence: [
        `Last activity: ${formatDate(agent.lastActivityAt)}`,
        `Inactive for ${idleDays} days`,
        `Threshold: ${cfg.dormantAfterDays} days`,
      ],
    });
  }

  return findings;
}
