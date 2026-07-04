/** Trigger a client-side file download from an in-memory string. Browser only. */
export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** A filesystem-safe timestamp like 2026-06-22-1530 for export filenames. */
export function fileStamp(iso: string): string {
  return iso.replace(/[:T]/g, "-").slice(0, 16).replace(/-(\d{2})-(\d{2})$/, "-$1$2");
}
