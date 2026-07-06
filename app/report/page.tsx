"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { SummaryCards } from "@/components/SummaryCards";
import { FindingRow } from "@/components/FindingRow";
import { AgentPanel } from "@/components/AgentPanel";
import { EmptyState } from "@/components/EmptyState";
import { useScan } from "@/app/providers";
import { downloadCsv, downloadJson } from "@/lib/report/exportData";
import { downloadHtmlReport } from "@/lib/report/exportHtml";
import { formatDate } from "@/lib/util/date";
import type { RiskLevel } from "@/lib/model/types";

const LEVELS: RiskLevel[] = ["high", "medium", "low"];

const RULE_LABEL: Record<string, string> = {
  "over-privilege": "Over-privilege",
  dormancy: "Dormancy",
  "sod-conflict": "Separation of duties",
  "standing-credential": "Standing credential",
};

function ExportButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-sm font-medium text-ink shadow-sm transition-colors hover:border-brand-ink hover:text-brand-ink"
    >
      {children}
    </button>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-brand bg-brand text-white"
          : "border-hairline bg-surface text-ink-soft hover:border-brand-ink hover:text-brand-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function ReportPage() {
  const { scan } = useScan();
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<RiskLevel | "all">("all");
  const [ruleFilter, setRuleFilter] = useState<string | "all">("all");

  const findings = useMemo(() => scan?.findings ?? [], [scan]);

  const ruleCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const finding of findings) {
      counts.set(finding.rule, (counts.get(finding.rule) ?? 0) + 1);
    }
    return counts;
  }, [findings]);

  const topAgents = useMemo(() => {
    const byAgent = new Map<string, { score: number; count: number }>();
    for (const finding of findings) {
      const entry = byAgent.get(finding.agentName) ?? { score: 0, count: 0 };
      entry.score = Math.max(entry.score, finding.score);
      entry.count += 1;
      byAgent.set(finding.agentName, entry);
    }
    return [...byAgent.entries()]
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 3);
  }, [findings]);

  const visibleFindings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return findings.filter(
      (finding) =>
        (levelFilter === "all" || finding.level === levelFilter) &&
        (ruleFilter === "all" || finding.rule === ruleFilter) &&
        (q === "" || finding.agentName.toLowerCase().includes(q)),
    );
  }, [findings, query, levelFilter, ruleFilter]);

  if (!scan) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-5xl px-5 py-20">
          <EmptyState
            title="No scan loaded"
            body="Scan results live in memory only — nothing is persisted, so a refresh clears them. Run a scan to see the report."
            action={
              <Link
                href="/scan"
                className="inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand/90"
              >
                Start a scan
              </Link>
            }
          />
        </main>
      </>
    );
  }

  const correlated = scan.agents.filter((a) => a.sources.length > 1);
  const singles = scan.agents.filter((a) => a.sources.length === 1);
  const filtersActive = query.trim() !== "" || levelFilter !== "all" || ruleFilter !== "all";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Scan results</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Scanned {formatDate(scan.scannedAt)} · {scan.stats.totalAgents} agents ·{" "}
              {scan.summary.total} findings
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ExportButton onClick={() => downloadHtmlReport(scan)}>Export HTML</ExportButton>
            <ExportButton onClick={() => downloadJson(scan)}>JSON</ExportButton>
            <ExportButton onClick={() => downloadCsv(scan)}>CSV</ExportButton>
            <Link
              href="/scan"
              className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand/90"
            >
              New scan
            </Link>
          </div>
        </div>

        {scan.warnings.length > 0 && (
          <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            <p className="font-semibold">Warnings</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              {scan.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <SummaryCards summary={scan.summary} stats={scan.stats} />
        </div>

        {topAgents.length > 0 && (
          <section className="mt-6 grid gap-3 sm:grid-cols-2">
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
                        onClick={() => setQuery(name)}
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
          </section>
        )}

        <section className="mt-10">
          <h2 className="border-l-4 border-brand pl-3 text-lg font-semibold text-ink">
            Findings — worst first
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by agent name…"
              aria-label="Search findings by agent name"
              className="w-56 rounded-lg border border-hairline bg-surface px-3 py-1.5 text-sm text-ink placeholder:text-ink-soft focus:border-brand-ink focus:outline-none"
            />
            <span className="mx-1 hidden h-5 w-px bg-hairline sm:block" aria-hidden="true" />
            <FilterChip active={levelFilter === "all"} onClick={() => setLevelFilter("all")}>
              All severities
            </FilterChip>
            {LEVELS.map((level) => (
              <FilterChip
                key={level}
                active={levelFilter === level}
                onClick={() => setLevelFilter(level)}
              >
                {level}
              </FilterChip>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-hairline sm:block" aria-hidden="true" />
            <FilterChip active={ruleFilter === "all"} onClick={() => setRuleFilter("all")}>
              All types
            </FilterChip>
            {Object.entries(RULE_LABEL).map(([rule, label]) => (
              <FilterChip key={rule} active={ruleFilter === rule} onClick={() => setRuleFilter(rule)}>
                {label}
              </FilterChip>
            ))}
          </div>

          {filtersActive && (
            <p className="mt-2 text-xs text-ink-soft">
              Showing {visibleFindings.length} of {findings.length} findings ·{" "}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setLevelFilter("all");
                  setRuleFilter("all");
                }}
                className="text-brand-ink underline underline-offset-2 hover:text-ink"
              >
                clear filters
              </button>
            </p>
          )}

          <div className="mt-4 space-y-3">
            {findings.length === 0 ? (
              <EmptyState
                title="No risks found"
                body="Every agent passed all four rules — over-privilege, dormancy, separation of duties, and standing credentials."
              />
            ) : visibleFindings.length === 0 ? (
              <EmptyState
                title="No findings match the current filters"
                body="Try a different agent name, severity, or risk type — or clear the filters."
              />
            ) : (
              visibleFindings.map((finding) => <FindingRow key={finding.id} finding={finding} />)
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="border-l-4 border-moat pl-3 text-lg font-semibold text-ink">
            Cross-stack agents{" "}
            <span className="font-normal text-ink-soft">({correlated.length})</span>
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Seen in both MidPoint and Keycloak, shown as one logical agent — governance roles, auth
            client, and secret together. This is the view no single system gives you.
          </p>
          <div className="mt-4 space-y-3">
            {correlated.length > 0 ? (
              correlated.map((agent) => <AgentPanel key={agent.id} agent={agent} />)
            ) : (
              <EmptyState
                title="No cross-stack agents"
                body="No agent was present in both MidPoint and Keycloak in these exports."
              />
            )}
          </div>
        </section>

        {singles.length > 0 && (
          <section className="mt-10">
            <h2 className="border-l-4 border-slate-400 pl-3 text-lg font-semibold text-ink dark:border-slate-500">
              Single-source agents{" "}
              <span className="font-normal text-ink-soft">({singles.length})</span>
            </h2>
            <div className="mt-4 space-y-3">
              {singles.map((agent) => (
                <AgentPanel key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
