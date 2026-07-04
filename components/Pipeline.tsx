const STAGES = [
  { n: 1, title: "Ingest", desc: "Read exports" },
  { n: 2, title: "Normalize", desc: "One model; tag agents" },
  { n: 3, title: "Correlate", desc: "Link across systems", moat: true },
  { n: 4, title: "Analyze", desc: "Run risk rules" },
  { n: 5, title: "Score", desc: "Rank findings" },
  { n: 6, title: "Report", desc: "Render + export" },
];

export function Pipeline() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
      {STAGES.map((stage, index) => (
        <div key={stage.n} className="flex flex-1 items-center gap-2">
          <div
            className={`flex-1 rounded-lg border p-2.5 text-center ${
              stage.moat
                ? "border-moat bg-moat-soft ring-1 ring-moat/30"
                : "border-hairline bg-surface"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white ${
                  stage.moat ? "bg-moat" : "bg-brand"
                }`}
              >
                {stage.n}
              </span>
              <span className="text-xs font-bold text-ink">{stage.title}</span>
            </div>
            <div className="mt-1 text-[11px] leading-tight text-ink-soft">{stage.desc}</div>
            {stage.moat && (
              <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-moat">
                The moat
              </div>
            )}
          </div>
          {index < STAGES.length - 1 && (
            <span className="hidden text-brand sm:inline" aria-hidden="true">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
