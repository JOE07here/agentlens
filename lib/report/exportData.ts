/** JSON and CSV exports of a scan. Pure builders (used by tests) + downloaders. */
import type { Finding, ScanResult } from "@/lib/model/types";
import { downloadFile, fileStamp } from "@/lib/report/download";

export function toJson(scan: ScanResult): string {
  return JSON.stringify(scan, null, 2);
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function findingsToCsv(findings: Finding[]): string {
  const header = [
    "level",
    "score",
    "rule",
    "agent",
    "agentType",
    "reason",
    "recommendedAction",
    "evidence",
  ];
  const rows = findings.map((f) =>
    [
      f.level,
      String(f.score),
      f.rule,
      f.agentName,
      f.agentType,
      f.reason,
      f.recommendedAction,
      f.evidence.join(" | "),
    ]
      .map(csvCell)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export function downloadJson(scan: ScanResult): void {
  downloadFile(
    `agentlens-scan-${fileStamp(scan.scannedAt)}.json`,
    toJson(scan),
    "application/json",
  );
}

export function downloadCsv(scan: ScanResult): void {
  downloadFile(
    `agentlens-findings-${fileStamp(scan.scannedAt)}.csv`,
    findingsToCsv(scan.findings),
    "text/csv",
  );
}
