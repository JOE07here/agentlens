"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { FindingRow } from "@/components/FindingRow";
import { AgentPanel } from "@/components/AgentPanel";
import { EmptyState } from "@/components/EmptyState";
import { ReportDashboard } from "@/components/ReportDashboard";
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

type SourceFilter = "all" | "midpoint" | "keycloak" | "correlated";

const SOURCE_LABEL: Record<Exclude<SourceFilter, "all">, string> = {
  midpoint: "MidPoint",
  keycloak: "Keycloak",
  correlated: "Correlated",
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
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

  const findings = useMemo(() => scan?.findings ?? [], [scan]);

  // agentId -> sources, for the MidPoint / Keycloak / Correlated filter.
  const agentSources = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const agent of scan?.agents ?? []) map.set(agent.id, agent.sources);
    return map;
  }, [scan]);

  const visibleFindings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return findings.filter((finding) => {
      if (levelFilter !== "all" && finding.level !== levelFilter) return false;
      if (ruleFilter !== "all" && finding.rule !== ruleFilter) return false;
      if (q !== "" && !finding.agentName.toLowerCase().includes(q)) return false;
      if (sourceFilter !== "all") {
        const sources = agentSources.get(finding.agentId) ?? [];
        if (sourceFilter === "correlated") {
          if (sources.length < 2) return false;
        } else if (!sources.includes(sourceFilter)) {
          return false;
        }
      }
      return true;
    });
  }, [findings, query, levelFilter, ruleFilter, sourceFilter, agentSources]);

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
  const filtersActive =
    query.trim() !== "" || levelFilter !== "all" || ruleFilter !== "all" || sourceFilter !== "all";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Scan results</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Point-in-time scan · {formatDate(scan.scannedAt)} · {scan.stats.totalAgents} agents ·{" "}
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
          <ReportDashboard scan={scan} onSelectAgent={setQuery} />
        </div>

        <section className="mt-10">
          <h2 className="border-l-4 border-brand pl-3 text-lg font-semibold text-ink">
            Findings — worst first
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by identity name…"
              aria-label="Search findings by identity name"
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
            <span className="mx-1 hidden h-5 w-px bg-hairline sm:block" aria-hidden="true" />
            <FilterChip active={sourceFilter === "all"} onClick={() => setSourceFilter("all")}>
              All sources
            </FilterChip>
            {(Object.keys(SOURCE_LABEL) as Array<Exclude<SourceFilter, "all">>).map((source) => (
              <FilterChip
                key={source}
                active={sourceFilter === source}
                onClick={() => setSourceFilter(source)}
              >
                {SOURCE_LABEL[source]}
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
                  setSourceFilter("all");
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
                body="Try a different identity name, severity, risk type, or source — or clear the filters."
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
