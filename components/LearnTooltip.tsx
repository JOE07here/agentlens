import { GLOSSARY, type GlossaryTerm } from "@/lib/glossary";

/**
 * Learn-mode tooltip: wraps a technical term with a dotted underline; the
 * plain-language definition appears on hover and on keyboard focus. CSS-only,
 * so it works in server components and costs no JS.
 */
export function LearnTooltip({
  term,
  children,
}: {
  term: GlossaryTerm;
  children: React.ReactNode;
}) {
  const definition = GLOSSARY[term];
  return (
    <span className="group relative inline-block">
      <button
        type="button"
        className="cursor-help rounded-sm underline decoration-ink-soft/60 decoration-dotted underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
        aria-label={`${String(term)} — ${definition}`}
      >
        {children}
      </button>
      <span
        role="tooltip"
        className="invisible absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg border border-hairline bg-surface p-3 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-ink opacity-0 shadow-lg transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        {definition}
      </span>
    </span>
  );
}
