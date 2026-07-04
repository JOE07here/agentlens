/**
 * Standalone HTML report. Self-contained (inline CSS, no external fonts or
 * scripts) so it stays portable and offline — open it anywhere, or print to PDF.
 */
import type {
  CorrelatedAgent,
  Credential,
  Finding,
  RiskLevel,
  ScanResult,
} from "@/lib/model/types";
import { downloadFile, fileStamp } from "@/lib/report/download";
import { formatDate } from "@/lib/util/date";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const LEVEL_COLOR: Record<RiskLevel, string> = {
  high: "#9A2B16",
  medium: "#7A3A06",
  low: "#0B5C53",
};
const LEVEL_BG: Record<RiskLevel, string> = {
  high: "#FCE8E6",
  medium: "#FDF3E3",
  low: "#E2F4F1",
};

function badge(level: RiskLevel): string {
  return `<span style="display:inline-block;font:700 11px/1 sans-serif;letter-spacing:.04em;text-transform:uppercase;color:${LEVEL_COLOR[level]};background:${LEVEL_BG[level]};border:1px solid ${LEVEL_COLOR[level]}33;padding:3px 8px;border-radius:6px">${level}</span>`;
}

function credLine(c: Credential): string {
  const expiry = c.expiresAt === null ? "never expires" : c.expiresAt ? `expires ${formatDate(c.expiresAt)}` : "expiry unknown";
  return `${esc(c.type)} (${esc(c.source)}) — created ${formatDate(c.createdAt)}, ${expiry}`;
}

function agentCard(agent: CorrelatedAgent): string {
  const roles = agent.access.map((a) => `${esc(a.name)} <span style="color:#7A8194">· ${esc(a.source)}</span>`).join(", ") || "—";
  const creds = agent.credentials.map((c) => `<li>${credLine(c)}</li>`).join("") || "<li>—</li>";
  const sources = agent.sources.map((s) => esc(s)).join(" + ");
  const match = agent.matchConfidence
    ? `<span style="color:#0E7A6E;font-weight:600">correlated · ${esc(agent.matchConfidence)}</span>`
    : `<span style="color:#7A8194">single source</span>`;
  return `
  <div style="border:1px solid #DCE0E7;border-radius:10px;padding:14px 16px;margin:0 0 10px;background:#fff">
    <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:baseline">
      <strong style="font-size:15px">${esc(agent.name)}</strong>
      <span style="font-size:12px;color:#4C5462">${esc(agent.type)} · ${sources} · ${match}</span>
    </div>
    <div style="font-size:13px;color:#4C5462;margin-top:8px"><b>Roles:</b> ${roles}</div>
    <div style="font-size:13px;color:#4C5462;margin-top:4px"><b>Credentials:</b><ul style="margin:4px 0 0;padding-left:18px">${creds}</ul></div>
    ${agent.matchReason ? `<div style="font-size:12px;color:#7A8194;margin-top:6px">${esc(agent.matchReason)}</div>` : ""}
  </div>`;
}

function findingCard(f: Finding): string {
  const evidence = f.evidence.map((e) => `<li>${esc(e)}</li>`).join("");
  return `
  <div style="border:1px solid #DCE0E7;border-left:4px solid ${LEVEL_COLOR[f.level]};border-radius:8px;padding:12px 16px;margin:0 0 10px;background:#fff">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap">
      <strong>${esc(f.title)} — ${esc(f.agentName)}</strong>
      ${badge(f.level)}
    </div>
    <p style="margin:8px 0 6px;font-size:14px">${esc(f.reason)}</p>
    <p style="margin:0 0 6px;font-size:13px;color:#0B5C53"><b>Recommended:</b> ${esc(f.recommendedAction)}</p>
    ${evidence ? `<ul style="margin:0;padding-left:18px;font-size:12.5px;color:#4C5462">${evidence}</ul>` : ""}
  </div>`;
}

function statBox(label: string, value: number | string): string {
  return `<div style="flex:1;min-width:120px;border:1px solid #DCE0E7;border-radius:10px;padding:12px 14px;background:#fff"><div style="font-size:24px;font-weight:700">${value}</div><div style="font-size:12px;color:#4C5462;text-transform:uppercase;letter-spacing:.04em">${esc(label)}</div></div>`;
}

export function buildHtmlReport(scan: ScanResult): string {
  const { summary, stats } = scan;
  const correlated = scan.agents.filter((a) => a.sources.length > 1);
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AgentLens Report — ${esc(formatDate(scan.scannedAt))}</title></head>
<body style="margin:0;background:#F5F6F8;color:#161A22;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.55">
<div style="max-width:900px;margin:0 auto;padding:28px 20px 64px">
  <h1 style="font-size:26px;margin:0 0 4px">AgentLens — Risk Report</h1>
  <p style="color:#4C5462;margin:0 0 20px">Scanned ${esc(scan.scannedAt)} · ${stats.totalAgents} agents · ${summary.total} findings</p>

  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">
    ${statBox("High", summary.high)}${statBox("Medium", summary.medium)}${statBox("Low", summary.low)}
    ${statBox("Non-human", stats.nonHumanCount)}${statBox("Correlated", stats.correlatedCount)}
  </div>

  <h2 style="font-size:18px;margin:28px 0 12px;border-left:4px solid #2C3A8C;padding-left:12px">Findings (worst first)</h2>
  ${scan.findings.map(findingCard).join("") || "<p>No findings.</p>"}

  <h2 style="font-size:18px;margin:28px 0 12px;border-left:4px solid #0E7A6E;padding-left:12px">Cross-stack agents (${correlated.length})</h2>
  <p style="color:#4C5462;margin:0 0 12px;font-size:14px">Agents seen in both MidPoint and Keycloak, shown as one logical identity.</p>
  ${correlated.map(agentCard).join("") || "<p>No agents were present in both systems.</p>"}

  <h2 style="font-size:18px;margin:28px 0 12px;border-left:4px solid #4C5462;padding-left:12px">All agents (${scan.agents.length})</h2>
  ${scan.agents.map(agentCard).join("")}

  ${scan.warnings.length ? `<h2 style="font-size:18px;margin:28px 0 12px;border-left:4px solid #B45309;padding-left:12px">Warnings</h2><ul>${scan.warnings.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>` : ""}

  <p style="margin-top:32px;color:#7A8194;font-size:12px">Generated by AgentLens — all analysis ran locally in the browser. Nothing left the device.</p>
</div></body></html>`;
}

export function downloadHtmlReport(scan: ScanResult): void {
  downloadFile(
    `agentlens-report-${fileStamp(scan.scannedAt)}.html`,
    buildHtmlReport(scan),
    "text/html",
  );
}
