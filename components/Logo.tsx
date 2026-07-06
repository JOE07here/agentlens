import { BRAND } from "@/lib/brand";

/**
 * CyberLens mark: a laptop wearing perfectly ordinary eyeglasses.
 * Deliberately plain — the "specs" are normal specs.
 */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-lg bg-brand text-white ${className}`}
      aria-hidden="true"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        {/* laptop screen */}
        <rect x="4.5" y="3.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        {/* laptop base */}
        <path d="M2.5 18.5h19l-2-3h-15l-2 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        {/* normal specs */}
        <circle cx="9.4" cy="9" r="2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="14.6" cy="9" r="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M11.4 9h1.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function LogoLockup({ withTagline = false }: { withTagline?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className={withTagline ? "h-9 w-9" : "h-8 w-8"} />
      <span>
        <span className="block font-semibold leading-tight tracking-tight text-ink">
          {BRAND.name}
        </span>
        {withTagline && (
          <span className="block text-xs text-ink-soft">{BRAND.tagline}</span>
        )}
      </span>
    </span>
  );
}
