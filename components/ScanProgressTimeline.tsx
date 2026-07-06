"use client";

import { useEffect, useState } from "react";

export const SCAN_STAGES = [
  "Reading MidPoint export",
  "Reading Keycloak realm",
  "Normalizing identities",
  "Correlating agents",
  "Running risk rules",
  "Building report",
] as const;

/**
 * Staged progress shown after "Run scan". The analysis itself is synchronous
 * and already finished when this renders — the timeline replays the pipeline
 * stages briefly so the user sees WHAT happened, then `onDone` fires.
 */
export function ScanProgressTimeline({
  onDone,
  stageMs = 220,
}: {
  onDone: () => void;
  stageMs?: number;
}) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (completed >= SCAN_STAGES.length) {
      const t = setTimeout(onDone, 250);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCompleted((c) => c + 1), stageMs);
    return () => clearTimeout(t);
  }, [completed, onDone, stageMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-hairline bg-surface p-5"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Scanning…</h2>
      <ol className="mt-3 space-y-2">
        {SCAN_STAGES.map((stage, index) => {
          const done = index < completed;
          const active = index === completed;
          return (
            <li key={stage} className="flex items-center gap-2.5 text-sm">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  done
                    ? "bg-moat text-white"
                    : active
                      ? "bg-brand text-white"
                      : "border border-hairline bg-canvas"
                }`}
                aria-hidden="true"
              >
                {done ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6.5l2.5 2.5L10 3.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : active ? (
                  <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.35" />
                    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : null}
              </span>
              <span className={done || active ? "text-ink" : "text-ink-soft"}>{stage}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
