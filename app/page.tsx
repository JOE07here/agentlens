import Link from "next/link";
import { BRAND } from "@/lib/brand";

const RISK_RULES = [
  {
    title: "Over-privilege",
    body: "Flags agents holding admin-level roles. Machines don't get the benefit of the doubt — non-human identities are held to strict least privilege.",
  },
  {
    title: "Dormancy",
    body: "Finds enabled agents that haven't been active beyond the threshold — forgotten service accounts are a standing invitation.",
  },
  {
    title: "Separation of duties",
    body: "Detects toxic combinations on a single agent, like the ability to both initiate and approve payments.",
  },
  {
    title: "Standing credentials",
    body: "Surfaces long-lived secrets that never expire or are past their maximum age — the classic breach entry point.",
  },
];

const PIPELINE_STEPS = [
  { name: "Ingest", body: "Parse the MidPoint XML and Keycloak JSON exports" },
  { name: "Normalize", body: "Fold both into one canonical identity model" },
  { name: "Correlate", body: "Link the same agent across both systems" },
  { name: "Analyze", body: "Run the four risk rules against every agent" },
  { name: "Score", body: "Rank findings worst-first by severity" },
  { name: "Report", body: "Review in the browser, export HTML / JSON / CSV" },
];

function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-lg bg-brand text-white ${className}`}
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
  );
}

export default function Landing() {
  return (
    <>
      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-hairline bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-semibold tracking-tight text-ink">{BRAND.name}</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex">
            <a href="#product" className="hover:text-ink">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-ink">
              How it works
            </a>
            <a href="#security" className="hover:text-ink">
              Security
            </a>
            <a href={BRAND.repoUrl} className="hover:text-ink">
              GitHub
            </a>
          </nav>
          <Link
            href="/scan"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
          >
            Launch scanner
          </Link>
        </div>
      </header>

      <main>
        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="border-b border-hairline bg-gradient-to-b from-brand-soft/60 to-canvas">
          <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:py-28">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand ring-1 ring-inset ring-brand/20">
              Non-human identity security
            </p>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Your AI agents have identities.
              <br />
              Who&rsquo;s watching them?
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">
              {BRAND.name} correlates service accounts and AI-agent identities across{" "}
              <strong className="font-semibold text-ink">MidPoint</strong> and{" "}
              <strong className="font-semibold text-ink">Keycloak</strong>, then ranks the risks
              neither system can see on its own.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/scan"
                className="rounded-lg bg-brand px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
              >
                Launch the scanner
              </Link>
              <a
                href={BRAND.repoUrl}
                className="rounded-lg border border-hairline bg-surface px-6 py-3 font-semibold text-ink transition-colors hover:border-ink-soft"
              >
                View source on GitHub
              </a>
            </div>
            <p className="mt-5 text-sm text-ink-soft">
              No account, no install — try it instantly with bundled sample data.
            </p>
          </div>
        </section>

        {/* ── Trust strip ─────────────────────────────────────── */}
        <section className="border-b border-hairline bg-surface">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 text-center sm:grid-cols-3">
            <div>
              <p className="text-2xl font-bold text-brand">0 bytes</p>
              <p className="mt-1 text-sm text-ink-soft">
                leave your device — everything runs in the browser
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand">2 systems</p>
              <p className="mt-1 text-sm text-ink-soft">
                correlated into one picture per agent — IGA and IdP together
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand">4 risk rules</p>
              <p className="mt-1 text-sm text-ink-soft">
                built on least-privilege and separation-of-duties principles
              </p>
            </div>
          </div>
        </section>

        {/* ── Problem / product ───────────────────────────────── */}
        <section id="product" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink">
              Service accounts outnumber people — and nobody reviews them
            </h2>
            <p className="mt-4 text-ink-soft">
              Human accounts get joiner-mover-leaver processes and access reviews. Agents, bots and
              service accounts quietly accumulate privileges, keep never-expiring secrets, and stay
              enabled long after their job ended. {BRAND.name} puts them under the same scrutiny.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {RISK_RULES.map((rule) => (
              <div
                key={rule.title}
                className="rounded-2xl border border-hairline bg-surface p-6 shadow-sm"
              >
                <h3 className="font-semibold text-ink">{rule.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{rule.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Correlation (the differentiator) ────────────────── */}
        <section className="border-y border-hairline bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-moat">
                Cross-stack correlation
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">
                One agent. One picture.
              </h2>
              <p className="mt-4 text-ink-soft">
                Most tools look at one system at a time. {BRAND.name} links a MidPoint identity to
                its Keycloak OAuth client, so one real agent shows up once — governance roles,
                auth client and credentials combined. That&rsquo;s what surfaces an agent that is
                an admin in MidPoint <em>and</em> holds a never-expiring secret in Keycloak.
              </p>
            </div>
            <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="w-full rounded-xl border border-hairline bg-canvas p-4 text-center sm:w-56">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  MidPoint · IGA
                </p>
                <p className="mt-1 font-mono text-sm text-ink">svc-payment-bot</p>
                <p className="mt-1 text-xs text-ink-soft">roles · owner · lifecycle</p>
              </div>
              <span className="text-2xl text-moat" aria-hidden="true">
                ⇄
              </span>
              <div className="w-full rounded-xl border border-hairline bg-canvas p-4 text-center sm:w-56">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Keycloak · IdP
                </p>
                <p className="mt-1 font-mono text-sm text-ink">svc-payment-bot</p>
                <p className="mt-1 text-xs text-ink-soft">OAuth client · secret · scopes</p>
              </div>
              <span className="text-2xl text-moat" aria-hidden="true">
                →
              </span>
              <div className="w-full rounded-xl border-2 border-moat bg-moat-soft p-4 text-center sm:w-56">
                <p className="text-xs font-semibold uppercase tracking-wide text-moat">
                  Correlated agent
                </p>
                <p className="mt-1 font-mono text-sm text-ink">svc-payment-bot</p>
                <p className="mt-1 text-xs text-ink-soft">full risk picture, ranked</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────── */}
        <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink">
              From export to ranked report in six steps
            </h2>
            <p className="mt-4 text-ink-soft">
              Drop in a MidPoint user export and a Keycloak realm export — the whole pipeline runs
              locally in your browser tab.
            </p>
          </div>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PIPELINE_STEPS.map((step, i) => (
              <li
                key={step.name}
                className="rounded-2xl border border-hairline bg-surface p-6 shadow-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-semibold text-ink">{step.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Security ────────────────────────────────────────── */}
        <section id="security" className="border-y border-hairline bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Security by architecture
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">
                  Your identity exports are crown jewels. They never leave your device.
                </h2>
                <p className="mt-4 text-ink-soft">
                  {BRAND.name} isn&rsquo;t a promise-based privacy tool — it&rsquo;s a static page.
                  There is no backend to trust, because there is no backend at all.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  "No server, no database, no API — the app is served as static files",
                  "Exports are parsed in browser memory and cleared on refresh",
                  "Strictly read-only: it never connects to your MidPoint or Keycloak",
                  "Open source — audit every line on GitHub",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 shrink-0 text-moat"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 11.5l2 2 4-4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA band ────────────────────────────────────────── */}
        <section className="bg-brand">
          <div className="mx-auto max-w-6xl px-5 py-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Run your first scan in under a minute
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Use the bundled sample exports to see a full risk report — then try it on your own
              MidPoint and Keycloak data.
            </p>
            <Link
              href="/scan"
              className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand shadow-sm transition-colors hover:bg-brand-soft"
            >
              Launch the scanner
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-hairline bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-8 w-8" />
              <span>
                <span className="block text-sm font-semibold leading-tight text-ink">
                  {BRAND.name}
                </span>
                <span className="block text-xs text-ink-soft">{BRAND.tagline}</span>
              </span>
            </div>
            <nav className="flex items-center gap-5 text-sm text-ink-soft">
              <a href={BRAND.repoUrl} className="hover:text-ink">
                GitHub
              </a>
              <a href={BRAND.authorLinkedIn} className="hover:text-ink">
                LinkedIn
              </a>
              <Link href="/scan" className="hover:text-ink">
                Scanner
              </Link>
            </nav>
          </div>
          <p className="mt-6 text-center text-xs text-ink-soft sm:text-left">
            An open-source project by {BRAND.author}, built alongside a Zero Trust thesis
            (MidPoint &amp; Keycloak vs NIST SP 800-207). Not affiliated with Evolveum or the
            Keycloak project.
          </p>
        </div>
      </footer>
    </>
  );
}
