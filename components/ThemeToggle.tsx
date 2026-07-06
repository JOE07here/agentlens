"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const KEY = "theme";
const ORDER: Theme[] = ["light", "dark", "system"];

function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 20.5h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const ICON: Record<Theme, () => React.ReactNode> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
};

const LABEL: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

/**
 * Cycles Light → Dark → System. Preference persists in localStorage under
 * "theme"; the pre-paint script in app/layout.tsx reads the same key so the
 * correct palette is applied before first paint (no flash, no hydration
 * mismatch — until mounted we render a neutral placeholder).
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // One-time mount sync from localStorage. It must run after hydration so the
  // server HTML and first client render agree (both show the placeholder).
  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(stored === "light" || stored === "dark" || stored === "system" ? stored : "system");
  }, []);

  useEffect(() => {
    if (!theme) return;
    applyTheme(theme);
    localStorage.setItem(KEY, theme);
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  if (!theme) {
    return (
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-surface text-ink-soft"
      >
        <MonitorIcon />
      </button>
    );
  }

  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  const Icon = ICON[theme];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={`Theme: ${LABEL[theme]} — switch to ${LABEL[next]}`}
      aria-label={`Theme: ${LABEL[theme]}. Switch to ${LABEL[next]}.`}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-surface text-ink-soft transition-colors hover:border-brand-ink hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
    >
      <Icon />
    </button>
  );
}
