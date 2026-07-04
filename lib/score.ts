/**
 * Score & rank. Rules emit a base level/score; the scorer applies cross-cutting
 * modifiers (non-human, and the moat signal: present in both systems), re-derives
 * the level from configured thresholds, then ranks worst-first and summarizes.
 */
import type {
  CorrelatedAgent,
  Finding,
  RiskLevel,
  RiskSummary,
} from "@/lib/model/types";
import { rulesConfig } from "@/lib/config";

const scoring = rulesConfig.scoring;

export interface ScoreResult {
  findings: Finding[];
  summary: RiskSummary;
}

function levelFromScore(score: number): RiskLevel {
  if (score >= scoring.thresholds.high) return "high";
  if (score >= scoring.thresholds.medium) return "medium";
  return "low";
}

const levelRank: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };

export function score(findings: Finding[], agents: CorrelatedAgent[]): ScoreResult {
  const agentById = new Map(agents.map((a) => [a.id, a] as const));

  const scored = findings.map((finding) => {
    const agent = agentById.get(finding.agentId);
    let value = finding.score;
    if (agent) {
      if (agent.type === "non-human") value += scoring.modifiers.nonHuman;
      if (agent.sources.length > 1) value += scoring.modifiers.correlatedBothSystems;
    }
    value = Math.max(0, Math.min(100, value));
    return { ...finding, score: value, level: levelFromScore(value) };
  });

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      levelRank[a.level] - levelRank[b.level] ||
      a.agentName.localeCompare(b.agentName),
  );

  const summary: RiskSummary = {
    total: scored.length,
    high: scored.filter((f) => f.level === "high").length,
    medium: scored.filter((f) => f.level === "medium").length,
    low: scored.filter((f) => f.level === "low").length,
  };

  return { findings: scored, summary };
}
