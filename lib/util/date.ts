/** Whole days between `iso` and `now` (0 if `now` is earlier or the date is bad). */
export function daysSince(now: Date, iso: string | undefined): number | undefined {
  if (!iso) return undefined;
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return undefined;
  return Math.max(0, Math.floor((now.getTime() - then) / 86_400_000));
}

/** Deterministic, locale-free YYYY-MM-DD (for evidence text and exports). */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "unknown";
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return "unknown";
  return new Date(ms).toISOString().slice(0, 10);
}
