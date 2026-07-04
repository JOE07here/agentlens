/**
 * FR-05 Over-privilege: an agent holding admin-level roles. Machine identities
 * are held to least privilege (high); humans with standing admin are flagged
 * lower (medium) for review.
 */
import type { CorrelatedAgent, Finding } from "@/lib/model/types";
import { rulesConfig } from "@/lib/config";

const cfg = rulesConfig.overPrivilege;
const patterns = cfg.privilegedRolePatterns.map((p) => new RegExp(p, "i"));

export function overPrivilege(agents: CorrelatedAgent[]): Finding[] {
  if (!cfg.enabled) return [];
  const findings: Finding[] = [];

  for (const agent of agents) {
    const privileged = agent.access.filter(
      (a) => a.privileged || patterns.some((re) => re.test(a.name)),
    );
    if (privileged.length === 0) continue;

    const severity = agent.type === "human" ? cfg.human : cfg.nonHuman;
    const roleList = privileged.map((a) => a.name).join(", ");
    const closer =
      agent.type === "non-human"
        ? "Machine identities should follow least privilege."
        : "Confirm this human still requires standing administrative access.";

    findings.push({
      id: `over-privilege:${agent.id}`,
      rule: "over-privilege",
      title: "Over-privileged agent",
      agentId: agent.id,
      agentName: agent.name,
      agentType: agent.type,
      level: severity.level,
      score: severity.score,
      reason: `${labelType(agent.type)} "${agent.name}" holds admin-level role(s): ${roleList}. ${closer}`,
      recommendedAction:
        "Remove the admin-level role(s) and grant only the specific entitlements this agent needs (least privilege).",
      evidence: privileged.map((a) => `${a.name} (${a.kind}, ${a.source})`),
    });
  }

  return findings;
}

function labelType(type: CorrelatedAgent["type"]): string {
  if (type === "non-human") return "Non-human agent";
  if (type === "human") return "Human user";
  return "Agent";
}
