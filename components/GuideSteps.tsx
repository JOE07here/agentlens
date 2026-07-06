const STEPS = [
  { title: "Load sample data", body: "One click — bundled MidPoint + Keycloak exports." },
  { title: "Run scan", body: "The whole pipeline runs locally in your tab." },
  { title: "Review top risks", body: "Findings ranked worst-first, with evidence." },
  { title: "Expand a finding", body: "Evidence, why it matters, and how to fix it." },
  { title: "Copy remediation", body: "One click to paste the fix into a ticket." },
  { title: "Export report", body: "HTML, JSON, or CSV — generated in the browser." },
];

/** "Try it in 60 seconds" strip shown on the scanner page. */
export function GuideSteps() {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
        Try it in 60 seconds
      </h2>
      <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex items-start gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-ink">
              {i + 1}
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">{step.title}</span>
              <span className="block text-xs leading-relaxed text-ink-soft">{step.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
