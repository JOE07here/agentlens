"use client";

import { useState } from "react";

interface PipelineStage {
  id: string;
  name: string;
  what: string;
  exampleIn: string;
  exampleOut: string;
  why: string;
  moat?: boolean;
}

const STAGES: PipelineStage[] = [
  {
    id: "ingest",
    name: "Ingest",
    what: "Parse the two export files: MidPoint XML and Keycloak realm JSON. Malformed sections become warnings, not crashes.",
    exampleIn: "midpoint-export.xml · keycloak-realm.json",
    exampleOut: "Raw identity records from each system",
    why: "Exports are the least invasive way in — read-only files you already know how to produce, no connector risk.",
  },
  {
    id: "normalize",
    name: "Normalize",
    what: "Fold both formats into one canonical identity model, and classify each identity as human or non-human using name patterns and service-account flags.",
    exampleIn: "A MidPoint <user> and a Keycloak client object",
    exampleOut: "Canonical identities with type: non-human",
    why: "Risk rules only have to be written once — against one model — no matter how many identity sources feed in.",
  },
  {
    id: "correlate",
    name: "Correlate",
    what: "Link identities that represent the same real agent across systems, using the name and owner as correlation handles.",
    exampleIn: "MidPoint identity svc-payment-bot + Keycloak OAuth client svc-payment-bot",
    exampleOut: "One correlated agent with governance roles AND authentication credentials",
    why: "This exposes combined risk that neither MidPoint nor Keycloak shows clearly alone — the core of the tool.",
    moat: true,
  },
  {
    id: "analyze",
    name: "Analyze",
    what: "Run the four risk rules over every agent: over-privilege, dormancy, separation-of-duties conflicts, standing credentials.",
    exampleIn: "Correlated agent with admin role + never-expiring secret",
    exampleOut: "Findings with plain-language reasons and evidence",
    why: "Machines rarely get access reviews — codified rules give non-human identities the scrutiny humans get.",
  },
  {
    id: "score",
    name: "Score",
    what: "Assign each finding a 0–100 score and a severity, then sort worst-first.",
    exampleIn: "8 findings across 6 agents",
    exampleOut: "Ranked list: svc-payment-bot (100) at the top",
    why: "Reviewers have limited time — ranking decides what gets fixed first.",
  },
  {
    id: "report",
    name: "Report",
    what: "Render the dashboard: summary metrics, filters, evidence, remediation advice — and export it all as HTML, JSON, or CSV.",
    exampleIn: "Scored findings + correlated agents",
    exampleOut: "Interactive report + portable export files",
    why: "An access review or audit prep needs an artifact you can share — generated locally, nothing uploaded.",
  },
];

/** Interactive pipeline: click a stage to see what it does, with example input/output. */
export function PipelineVisualizer() {
  const [selectedId, setSelectedId] = useState("correlate");
  const selected = STAGES.find((stage) => stage.id === selectedId) ?? STAGES[0];

  return (
    <div>
      <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
        <div className="rounded-lg border border-dashed border-hairline bg-canvas px-3 py-2 text-center text-xs font-medium text-ink-soft lg:w-40 lg:shrink-0">
          MidPoint XML
          <br />+ Keycloak JSON
        </div>
        <span className="hidden text-brand-ink lg:inline" aria-hidden="true">
          →
        </span>
        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {STAGES.map((stage) => {
            const active = stage.id === selected.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedId(stage.id)}
                aria-pressed={active}
                className={`rounded-lg border p-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink ${
                  active
                    ? stage.moat
                      ? "border-moat bg-moat text-white"
                      : "border-brand bg-brand text-white"
                    : stage.moat
                      ? "border-moat/40 bg-moat-soft text-moat-ink hover:border-moat"
                      : "border-hairline bg-surface text-ink hover:border-brand-ink"
                }`}
              >
                {stage.name}
                {stage.moat && (
                  <span className="block text-[9px] font-bold uppercase tracking-wider opacity-80">
                    the moat
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-hairline bg-surface p-5">
        <h3 className="font-semibold text-ink">
          {selected.name}
          {selected.moat && (
            <span className="ml-2 rounded-full bg-moat-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-moat-ink ring-1 ring-inset ring-moat/20">
              core step
            </span>
          )}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{selected.what}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-canvas p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
              Example input
            </p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-ink">{selected.exampleIn}</p>
          </div>
          <div className="rounded-lg border border-hairline bg-canvas p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
              Example output
            </p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-ink">{selected.exampleOut}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed">
          <span className="font-semibold text-moat-ink">Why it matters: </span>
          <span className="text-ink-soft">{selected.why}</span>
        </p>
      </div>
    </div>
  );
}
