export function MetricCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  tone?: "neutral" | "danger" | "warn" | "brand" | "moat";
}) {
  const tones: Record<string, string> = {
    neutral: "border-hairline bg-surface text-ink",
    danger:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
    warn: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
    brand: "border-brand/25 bg-brand-soft text-brand-ink",
    moat: "border-moat/30 bg-moat-soft text-moat-ink",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs font-medium uppercase tracking-wide opacity-80">{label}</div>
    </div>
  );
}
