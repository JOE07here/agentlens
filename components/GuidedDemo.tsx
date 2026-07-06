"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";

interface DemoStep {
  title: string;
  body: string;
  visual: React.ReactNode;
}

function CodeCard({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div className="rounded-lg border border-hairline bg-canvas p-3 text-left">
      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">{label}</p>
      <pre className="mt-1 overflow-x-auto font-mono text-xs leading-relaxed text-ink">
        {lines.join("\n")}
      </pre>
    </div>
  );
}

function Tag({ tone, children }: { tone: "brand" | "moat" | "danger"; children: React.ReactNode }) {
  const tones = {
    brand: "bg-brand-soft text-brand-ink ring-brand/20",
    moat: "bg-moat-soft text-moat-ink ring-moat/20",
    danger:
      "bg-red-100 text-red-800 ring-red-300 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/40",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

const STEPS: DemoStep[] = [
  {
    title: "MidPoint export — the governance view",
    body: "MidPoint is your IGA system: it knows users, roles, assignments, and who owns what. Its XML export is one of the two inputs.",
    visual: (
      <CodeCard
        label="midpoint-export.xml"
        lines={[
          "<user>",
          "  <name>svc-payment-bot</name>",
          "  <assignment>admin</assignment>",
          "  <ownerRef>finance-team</ownerRef>",
          "</user>",
        ]}
      />
    ),
  },
  {
    title: "Keycloak export — the authentication view",
    body: "Keycloak is your IdP: it knows OAuth clients, service accounts, client secrets, and realm roles. Its JSON realm export is the second input.",
    visual: (
      <CodeCard
        label="keycloak-realm.json"
        lines={[
          "{",
          '  "clientId": "svc-payment-bot",',
          '  "serviceAccountsEnabled": true,',
          '  "secret": "…never expires…"',
          "}",
        ]}
      />
    ),
  },
  {
    title: "Normalize — one common model",
    body: "Different formats, one internal identity model. CyberLens folds both exports into the same canonical shape and classifies each identity as human or non-human.",
    visual: (
      <div className="flex items-center justify-center gap-3 text-sm">
        <Tag tone="brand">XML</Tag>
        <span aria-hidden="true">+</span>
        <Tag tone="brand">JSON</Tag>
        <span aria-hidden="true">→</span>
        <Tag tone="moat">canonical identity</Tag>
      </div>
    ),
  },
  {
    title: "Correlate — find the same agent twice",
    body: "The core step: CyberLens links a MidPoint identity to its Keycloak OAuth client, so one real agent appears once — governance roles and credentials together.",
    visual: (
      <div className="flex flex-col items-center gap-1.5 text-sm">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-ink">svc-payment-bot</span>
          <Tag tone="brand">MidPoint</Tag>
        </div>
        <span className="text-moat-ink" aria-hidden="true">
          ⇅ matched
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-ink">svc-payment-bot</span>
          <Tag tone="moat">Keycloak</Tag>
        </div>
      </div>
    ),
  },
  {
    title: "Analyze — run the risk rules",
    body: "Four rules run over every correlated agent: over-privilege, dormancy, separation-of-duties conflicts, and standing credentials.",
    visual: (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Tag tone="danger">Over-privilege</Tag>
        <Tag tone="danger">Dormancy</Tag>
        <Tag tone="danger">SoD conflict</Tag>
        <Tag tone="danger">Standing credential</Tag>
      </div>
    ),
  },
  {
    title: "Score — worst first",
    body: "Every finding gets a 0–100 score and a severity, so the riskiest identities surface at the top of the report instead of hiding in a flat list.",
    visual: (
      <div className="space-y-1.5">
        {[
          { name: "svc-payment-bot", score: 100 },
          { name: "legacy-integration", score: 95 },
          { name: "svc-data-sync", score: 90 },
        ].map((row) => (
          <div key={row.name} className="flex items-center gap-2 text-xs">
            <span className="w-32 shrink-0 truncate font-mono text-ink">{row.name}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
              <span
                className="block h-full rounded-full bg-brand"
                style={{ width: `${row.score}%` }}
              />
            </span>
            <span className="w-7 text-right tabular-nums text-ink-soft">{row.score}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Report — evidence, advice, export",
    body: "Each finding comes with evidence and a recommended remediation. Review it in the browser, then export the whole report as HTML, JSON, or CSV.",
    visual: (
      <div className="flex items-center justify-center gap-2">
        <Tag tone="brand">Evidence</Tag>
        <Tag tone="moat">Remediation</Tag>
        <Tag tone="brand">HTML / JSON / CSV</Tag>
      </div>
    ),
  },
];

/** "Start guided demo" button + the 7-step walkthrough dialog it opens. */
export function GuidedDemo({ buttonClassName }: { buttonClassName?: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") setStep((s) => Math.min(s + 1, STEPS.length - 1));
      if (event.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
        className={
          buttonClassName ??
          "rounded-lg border border-hairline bg-surface px-6 py-3 font-semibold text-ink transition-colors hover:border-ink-soft"
        }
      >
        Start guided demo
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`How ${BRAND.name} works — step ${step + 1} of ${STEPS.length}`}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-hairline bg-surface p-6 shadow-xl focus:outline-none"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink">
                How {BRAND.name} works · step {step + 1} of {STEPS.length}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close guided demo"
                className="rounded-md px-2 text-lg leading-none text-ink-soft hover:text-ink"
              >
                ×
              </button>
            </div>

            <h2 className="mt-2 text-lg font-bold text-ink">{current.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{current.body}</p>
            <div className="mt-4 rounded-xl border border-hairline bg-surface p-4">
              {current.visual}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-1.5" aria-hidden="true">
                {STEPS.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 w-4 rounded-full ${
                      index === step ? "bg-brand" : "bg-hairline"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(s - 1, 0))}
                  disabled={step === 0}
                  className="rounded-lg border border-hairline bg-surface px-3.5 py-1.5 text-sm font-medium text-ink disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => (isLast ? setOpen(false) : setStep((s) => s + 1))}
                  className="rounded-lg bg-brand px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-brand/90"
                >
                  {isLast ? "Done — try it" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
