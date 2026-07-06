import type { IdentityType, MatchConfidence, RiskLevel, Source } from "@/lib/model/types";

const RISK_STYLES: Record<RiskLevel, string> = {
  high: "bg-red-100 text-red-800 ring-red-300 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/40",
  medium:
    "bg-amber-100 text-amber-900 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/40",
  low: "bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/40",
};

/** Also exported as SeverityBadge — same component, clearer name at call sites. */
export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ring-inset ${RISK_STYLES[level]}`}
    >
      {level}
    </span>
  );
}

export const SeverityBadge = RiskBadge;

const TYPE_STYLES: Record<IdentityType, string> = {
  "non-human": "bg-brand-soft text-brand-ink ring-brand/20",
  human:
    "bg-slate-100 text-slate-700 ring-slate-300 dark:bg-slate-500/20 dark:text-slate-300 dark:ring-slate-500/40",
  unknown:
    "bg-slate-100 text-slate-500 ring-slate-300 dark:bg-slate-500/20 dark:text-slate-400 dark:ring-slate-500/40",
};

const TYPE_LABEL: Record<IdentityType, string> = {
  "non-human": "Non-human",
  human: "Human",
  unknown: "Unknown",
};

export function AgentTypeChip({ type }: { type: IdentityType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TYPE_STYLES[type]}`}
    >
      {TYPE_LABEL[type]}
    </span>
  );
}

const SOURCE_LABEL: Record<Source, string> = {
  midpoint: "MidPoint",
  keycloak: "Keycloak",
};

export function SourcePills({ sources }: { sources: Source[] }) {
  return (
    <span className="inline-flex gap-1">
      {sources.map((source) => (
        <span
          key={source}
          className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium text-ink-soft ring-1 ring-inset ring-hairline"
        >
          {SOURCE_LABEL[source]}
        </span>
      ))}
    </span>
  );
}

export function MatchBadge({ confidence }: { confidence?: MatchConfidence }) {
  if (!confidence) {
    return <span className="text-xs font-medium text-ink-soft">single source</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-moat-soft px-2 py-0.5 text-xs font-semibold text-moat-ink ring-1 ring-inset ring-moat/20">
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <circle cx="5" cy="5" r="4" fill="currentColor" />
      </svg>
      correlated · {confidence}
    </span>
  );
}
