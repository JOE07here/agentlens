import type { RuleInfo } from "@/lib/ruleInfo";

/** Landing/case-study card explaining one risk rule in plain language. */
export function RiskRuleCard({ rule }: { rule: RuleInfo }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-6 shadow-sm">
      <h3 className="font-semibold text-ink">{rule.title}</h3>
      <dl className="mt-3 space-y-2.5 text-sm leading-relaxed">
        <div>
          <dt className="font-semibold text-ink">What this means</dt>
          <dd className="text-ink-soft">{rule.whatItMeans}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Why it matters</dt>
          <dd className="text-ink-soft">{rule.whyItMatters}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">How to fix it</dt>
          <dd className="text-ink-soft">{rule.howToFix}</dd>
        </div>
        <div className="rounded-lg bg-canvas px-3 py-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-brand-ink">Example</dt>
          <dd className="mt-0.5 text-ink-soft">{rule.example}</dd>
        </div>
      </dl>
    </div>
  );
}
