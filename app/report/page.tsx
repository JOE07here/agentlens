"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { SummaryCards } from "@/components/SummaryCards";
import { FindingRow } from "@/components/FindingRow";
import { AgentPanel } from "@/components/AgentPanel";
import { useScan } from "../providers";
import { downloadCsv, downloadJson } from "@/lib/report/exportData";
import { downloadHtmlReport } from "@/lib/report/exportHtml";
import { formatDate } from "@/lib/util/date";

function ExportButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-sm font-medium text-ink shadow-sm transition-colors hover:border-brand hover:text-brand"
    >
      {children}
    </button>
  );
}

export default function ReportPage() {
  const { scan } = useScan();

  if (!scan) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-5xl px-5 py-20 text-center">
          <h1 className="text-2xl font-bold text-ink">No scan loaded</h1>
          <p className="mt-2 text-ink-soft">
            Scan results live in memory only, so a refresh clears them.
          </p>
          <Link
            href="/scan"
            className="mt-6 inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand/90"
          >
            Start a scan
          </Link>
        </main>
      </>
    );
  }

  const correlated = scan.agents.filter((a) => a.sources.length > 1);
  const singles = scan.agents.filter((a) => a.sources.length === 1);

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
          <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
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

        <section className="mt-10">
          <h2 className="border-l-4 border-brand pl-3 text-lg font-semibold text-ink">
            Findings — worst first
          </h2>
          <div className="mt-4 space-y-3">
            {scan.findings.length > 0 ? (
              scan.findings.map((finding) => <FindingRow key={finding.id} finding={finding} />)
            ) : (
              <p className="rounded-lg border border-hairline bg-surface px-4 py-6 text-center text-ink-soft">
                No risks found. Every agent passed all four rules.
              </p>
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
              <p className="rounded-lg border border-hairline bg-surface px-4 py-6 text-center text-ink-soft">
                No agents were present in both systems.
              </p>
            )}
          </div>
        </section>

        {singles.length > 0 && (
          <section className="mt-10">
            <h2 className="border-l-4 border-slate-400 pl-3 text-lg font-semibold text-ink">
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
