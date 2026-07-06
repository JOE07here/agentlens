const JOURNEY = [
  { title: "Export MidPoint users", detail: "XML user export from your IGA" },
  { title: "Export Keycloak realm", detail: "JSON realm export from your IdP" },
  { title: "Load both files", detail: "Drag & drop — nothing is uploaded" },
  { title: "Run the local scan", detail: "Point-in-time analysis in your browser" },
  { title: "Review high-risk agents", detail: "Worst-first, with evidence" },
  { title: "Export the report", detail: "HTML, JSON, or CSV" },
  { title: "Feed your access review", detail: "Remediation list for review or audit prep" },
];

/** "How CyberLens helps an IAM review" — the end-to-end reviewer journey. */
export function UserJourneySection() {
  return (
    <ol className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {JOURNEY.map((step, index) => (
        <li
          key={step.title}
          className="flex items-start gap-3 rounded-xl border border-hairline bg-surface p-4"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
            {index + 1}
          </span>
          <span>
            <span className="block text-sm font-semibold text-ink">{step.title}</span>
            <span className="block text-xs leading-relaxed text-ink-soft">{step.detail}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
