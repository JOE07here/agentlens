import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-hairline bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white"
            aria-hidden="true"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
              <circle cx="11" cy="11" r="2.5" fill="currentColor" />
              <line
                x1="15.8"
                y1="15.8"
                x2="20"
                y2="20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span>
            <span className="block font-semibold leading-tight tracking-tight text-ink">
              AgentLens
            </span>
            <span className="block text-xs text-ink-soft">Agent identity risk scanner</span>
          </span>
        </Link>
        <span className="hidden items-center gap-1.5 rounded-full bg-moat-soft px-3 py-1 text-xs font-medium text-moat ring-1 ring-inset ring-moat/20 sm:inline-flex">
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
            <circle cx="4" cy="4" r="4" fill="currentColor" />
          </svg>
          Runs entirely in your browser
        </span>
      </div>
    </header>
  );
}
