"use client";

import { useState } from "react";
import type { Finding, RiskLevel } from "@/lib/model/types";
import { AgentTypeChip, SeverityBadge } from "@/components/badges";
import { RULE_INFO } from "@/lib/ruleInfo";

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

function downloadFindingJson(finding: Finding) {
  const blob = new Blob([JSON.stringify(finding, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cyberlens-finding-${finding.agentName}-${finding.rule}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * One expandable risk finding: summary row always visible; evidence,
 * plain-language explanation, and actions inside the disclosure.
 */
export function FindingRow({ finding }: { finding: Finding }) {
  const [copied, setCopied] = useState(false);
  const info = RULE_INFO.find((rule) => rule.id === finding.rule);

  async function copyRemediation() {
    try {
      await navigator.clipboard.writeText(finding.recommendedAction);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable (permissions, non-secure context) — the
      // text is visible on screen, so failing quietly is acceptable here.
    }
  }

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
          <SeverityBadge level={finding.level} />
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

      <details className="group mt-2">
        <summary className="cursor-pointer text-xs font-medium text-ink-soft hover:text-ink">
          Details &amp; evidence{finding.evidence.length > 0 && ` (${finding.evidence.length})`}
        </summary>

        {info && (
          <div className="mt-2 rounded-lg bg-canvas px-3 py-2.5 text-sm">
            <p>
              <span className="font-semibold text-ink">Why it matters: </span>
              <span className="text-ink-soft">{info.whyItMatters}</span>
            </p>
            <p className="mt-1">
              <span className="font-semibold text-ink">How to fix it: </span>
              <span className="text-ink-soft">{info.howToFix}</span>
            </p>
          </div>
        )}

        {finding.evidence.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-ink-soft">
            {finding.evidence.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyRemediation}
            className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand-ink hover:text-brand-ink"
          >
            {copied ? "Copied ✓" : "Copy remediation"}
          </button>
          <button
            type="button"
            onClick={() => downloadFindingJson(finding)}
            className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand-ink hover:text-brand-ink"
          >
            Export finding (JSON)
          </button>
        </div>
      </details>
    </article>
  );
}

/** Spec-friendly alias — same component. */
export const RiskFindingCard = FindingRow;
