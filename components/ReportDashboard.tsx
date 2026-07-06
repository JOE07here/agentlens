"use client";

import { useMemo } from "react";
import type { ScanResult } from "@/lib/model/types";
import { SummaryCards } from "@/components/SummaryCards";
import { MetricCard } from "@/components/MetricCard";

const RULE_LABEL: Record<string, string> = {
  "over-privilege": "Over-privilege",
  dormancy: "Dormancy",
  "sod-conflict": "Separation of duties",
  "standing-credential": "Standing credential",
};

/**
 * The metrics block at the top of the report: severity summary, risk-type
 * metrics, top risky agents, and the findings-by-type breakdown.
 */
export function ReportDashboard({
  scan,
  onSelectAgent,
}: {
  scan: ScanResult;
  onSelectAgent: (name: string) => void;
}) {
  const { findings } = scan;

  const { ruleCounts, dormantAgents, topAgents } = useMemo(() => {
    const counts = new Map<string, number>();
    const dormant = new Set<string>();
    const byAgent = new Map<string, { score: number; count: number }>();
    for (const finding of findings) {
      counts.set(finding.rule, (counts.get(finding.rule) ?? 0) + 1);
      if (finding.rule === "dormancy") dormant.add(finding.agentId);
      const entry = byAgent.get(finding.agentName) ?? { score: 0, count: 0 };
      entry.score = Math.max(entry.score, finding.score);
      entry.count += 1;
      byAgent.set(finding.agentName, entry);
    }
    return {
      ruleCounts: counts,
      dormantAgents: dormant.size,
      topAgents: [...byAgent.entries()].sort((a, b) => b[1].score - a[1].score).slice(0, 3),
    };
  }, [findings]);

  return (
    <>
      <SummaryCards summary={scan.summary} stats={scan.stats} />

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MetricCard label="Dormant agents" value={dormantAgents} tone="warn" />
        <MetricCard
          label="Standing credentials"
          value={ruleCounts.get("standing-credential") ?? 0}
          tone="warn"
        />
        <MetricCard label="SoD conflicts" value={ruleCounts.get("sod-conflict") ?? 0} tone="danger" />
      </div>

      {topAgents.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-hairline bg-surface p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Top risky agents
            </h2>
            <ol className="mt-2 space-y-1.5">
              {topAgents.map(([name, info], index) => (
                <li key={name} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink-soft">{index + 1}.</span>
                    <button
                      type="button"
                      onClick={() => onSelectAgent(name)}
                      className="font-mono text-brand-ink underline-offset-2 hover:underline"
                      title="Filter findings to this agent"
                    >
                      {name}
                    </button>
                  </span>
                  <span className="text-xs tabular-nums text-ink-soft">
                    score {info.score} · {info.count} finding{info.count === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-hairline bg-surface p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Findings by risk type
            </h2>
            <ul className="mt-2 space-y-1.5">
              {Object.entries(RULE_LABEL).map(([rule, label]) => {
                const count = ruleCounts.get(rule) ?? 0;
                const share = findings.length > 0 ? (count / findings.length) * 100 : 0;
                return (
                  <li key={rule} className="flex items-center gap-2 text-sm">
                    <span className="w-40 shrink-0 text-ink">{label}</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
                      <span
                        className="block h-full rounded-full bg-brand"
                        style={{ width: `${share}%` }}
                      />
                    </span>
                    <span className="w-6 text-right text-xs tabular-nums text-ink-soft">
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
