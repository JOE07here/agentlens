import type { Finding, RiskLevel } from "@/lib/model/types";
import { AgentTypeChip, RiskBadge } from "@/components/badges";

const BORDER: Record<RiskLevel, string> = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-emerald-500",
};

const RULE_LABEL: Record<string, string> = {
  "over-privilege": "Over-privilege",
  dormancy: "Dormancy",
  "sod-conflict": "Separation of duties",
  "standing-credential": "Standing credential",
};

export function FindingRow({ finding }: { finding: Finding }) {
  return (
    <article
      className={`rounded-xl border border-hairline border-l-4 bg-surface p-4 shadow-sm ${BORDER[finding.level]}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-ink">{finding.title}</h3>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-500/20 dark:text-slate-300">
            {RULE_LABEL[finding.rule] ?? finding.rule}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs tabular-nums text-ink-soft">score {finding.score}</span>
          <RiskBadge level={finding.level} />
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <span className="font-mono text-sm text-brand-ink">{finding.agentName}</span>
        <AgentTypeChip type={finding.agentType} />
      </div>

      <p className="mt-2 text-sm text-ink">{finding.reason}</p>

      <p className="mt-2 text-sm text-moat-ink">
        <span className="font-semibold">Recommended:</span> {finding.recommendedAction}
      </p>

      {finding.evidence.length > 0 && (
        <details className="mt-2 group">
          <summary className="cursor-pointer text-xs font-medium text-ink-soft hover:text-ink">
            Evidence ({finding.evidence.length})
          </summary>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs text-ink-soft">
            {finding.evidence.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}
