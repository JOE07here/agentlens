import type { RiskSummary, ScanStats } from "@/lib/model/types";

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "high" | "medium" | "low" | "neutral" | "moat";
}) {
  const tones: Record<string, string> = {
    high: "border-red-200 bg-red-50 text-red-800",
    medium: "border-amber-200 bg-amber-50 text-amber-900",
    low: "border-emerald-200 bg-emerald-50 text-emerald-800",
    moat: "border-moat/30 bg-moat-soft text-moat",
    neutral: "border-hairline bg-surface text-ink",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs font-medium uppercase tracking-wide opacity-80">{label}</div>
    </div>
  );
}

export function SummaryCards({
  summary,
  stats,
}: {
  summary: RiskSummary;
  stats: ScanStats;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard label="High" value={summary.high} tone="high" />
      <StatCard label="Medium" value={summary.medium} tone="medium" />
      <StatCard label="Low" value={summary.low} tone="low" />
      <StatCard label="Agents" value={stats.totalAgents} />
      <StatCard label="Non-human" value={stats.nonHumanCount} />
      <StatCard label="Cross-stack" value={stats.correlatedCount} tone="moat" />
    </div>
  );
}
