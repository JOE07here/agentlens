import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { LogoLockup } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

/** App header used on the scanner and report pages (the landing page has its own nav). */
export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-hairline bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="shrink-0">
          <LogoLockup withTagline />
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-4 text-sm font-medium text-ink-soft sm:flex">
            <Link href="/scan" className="hover:text-ink">
              Scanner
            </Link>
            <Link href="/case-study" className="hover:text-ink">
              Case study
            </Link>
            <a href={BRAND.repoUrl} className="hover:text-ink">
              GitHub
            </a>
          </nav>
          <span className="hidden items-center gap-1.5 rounded-full bg-moat-soft px-3 py-1 text-xs font-medium text-moat-ink ring-1 ring-inset ring-moat/20 lg:inline-flex">
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
              <circle cx="4" cy="4" r="4" fill="currentColor" />
            </svg>
            Runs entirely in your browser
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
