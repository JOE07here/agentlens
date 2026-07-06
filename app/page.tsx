import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { RULE_INFO } from "@/lib/ruleInfo";
import { LogoLockup, LogoMark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RiskRuleCard } from "@/components/RiskRuleCard";
import { MetricCard } from "@/components/MetricCard";
import { GuidedDemo } from "@/components/GuidedDemo";
import { PipelineVisualizer } from "@/components/PipelineVisualizer";
import { CorrelationBeforeAfter } from "@/components/CorrelationBeforeAfter";
import { UserJourneySection } from "@/components/UserJourneySection";
import { LearnTooltip } from "@/components/LearnTooltip";

const TRUST_CARDS = [
  {
    title: "0 bytes uploaded",
    body: "Your exports are parsed in browser memory and never transmitted.",
  },
  {
    title: "Runs fully in browser",
    body: "The whole pipeline — parse, correlate, score — executes in your tab.",
  },
  {
    title: "No backend",
    body: "Static files only. There is no server to trust, because there is no server.",
  },
  {
    title: "Open source",
    body: "Every line is on GitHub. Audit the rules, tune the thresholds.",
  },
];

export default function Landing() {
  return (
    <>
      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-hairline bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <Link href="/">
            <LogoLockup />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-ink-soft md:flex">
            <a href="#product" className="hover:text-ink">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-ink">
              How it works
            </a>
            <a href="#security" className="hover:text-ink">
              Security
            </a>
            <Link href="/case-study" className="hover:text-ink">
              Case study
            </Link>
            <a href={BRAND.repoUrl} className="hover:text-ink">
              GitHub
            </a>
          </nav>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href="/scan"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
            >
              Launch scanner
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="border-b border-hairline bg-gradient-to-b from-brand-soft/60 to-canvas">
          <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:py-28">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-ink ring-1 ring-inset ring-brand/20">
              Open-source NHI risk scanner
            </p>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Find risky service accounts before attackers do.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">
              {BRAND.name} correlates non-human identities — service accounts, AI agents, workload
              identities — across <strong className="font-semibold text-ink">MidPoint</strong> and{" "}
              <strong className="font-semibold text-ink">Keycloak</strong> exports, and ranks the
              risks neither system shows alone. Browser-only: your exports never leave your device.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/scan"
                className="rounded-lg bg-brand px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
              >
                Try sample scan
              </Link>
              <GuidedDemo />
              <a
                href={BRAND.repoUrl}
                className="rounded-lg border border-hairline bg-surface px-6 py-3 font-semibold text-ink transition-colors hover:border-ink-soft"
              >
                View GitHub
              </a>
            </div>
            <p className="mt-5 text-sm text-ink-soft">
              No account, no install — export-based analysis with bundled sample data.
            </p>
          </div>
        </section>

        {/* ── Trust cards ─────────────────────────────────────── */}
        <section className="border-b border-hairline bg-surface">
          <div className="mx-auto grid max-w-6xl gap-5 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_CARDS.map((card) => (
              <div key={card.title} className="rounded-2xl border border-hairline bg-canvas p-5">
                <p className="font-semibold text-brand-ink">{card.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Problem ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink">
              Service accounts outnumber people — and nobody reviews them
            </h2>
            <p className="mt-4 text-ink-soft">
              Human accounts get joiner-mover-leaver processes and{" "}
              <LearnTooltip term="access review">access reviews</LearnTooltip>.{" "}
              <LearnTooltip term="service account">Service accounts</LearnTooltip>,{" "}
              <LearnTooltip term="ai agent">AI agents</LearnTooltip>, and{" "}
              <LearnTooltip term="workload identity">workload identities</LearnTooltip> quietly
              accumulate privileges, keep never-expiring secrets, and stay enabled long after
              their job ended. They hold some of the most privileged, least-watched access in the
              environment — {BRAND.name} puts them under the same scrutiny, guided by{" "}
              <LearnTooltip term="least privilege">least privilege</LearnTooltip> and{" "}
              <LearnTooltip term="zero trust">Zero Trust</LearnTooltip> principles.
            </p>
          </div>
        </section>

        {/* ── Risk rules ──────────────────────────────────────── */}
        <section id="product" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-ink">
            Four risk rules, explained in plain language
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {RULE_INFO.map((rule) => (
              <RiskRuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        </section>

        {/* ── Correlation (the differentiator) ────────────────── */}
        <section className="border-y border-hairline bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-moat-ink">
                Cross-stack correlation
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">
                One agent. One picture.
              </h2>
              <p className="mt-4 text-ink-soft">
                Most tools look at one system at a time. {BRAND.name} links a{" "}
                <LearnTooltip term="midpoint">MidPoint</LearnTooltip> identity to its{" "}
                <LearnTooltip term="keycloak">Keycloak</LearnTooltip> OAuth client, so one real
                agent shows up once — governance roles, auth client and credentials combined.
              </p>
            </div>
            <div className="mt-12">
              <CorrelationBeforeAfter />
            </div>
          </div>
        </section>

        {/* ── Sample dashboard preview ────────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink">What a scan gives you</h2>
            <p className="mt-4 text-ink-soft">
              These numbers come from the bundled sample exports — run the same scan yourself in
              one click, no data required.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <MetricCard label="Agents scanned" value={6} tone="brand" />
            <MetricCard label="High risks" value={6} tone="danger" />
            <MetricCard label="Standing credentials" value={2} tone="warn" />
            <MetricCard label="SoD conflicts" value={1} tone="warn" />
            <MetricCard label="Cross-stack agents" value={3} tone="moat" />
          </div>
          <p className="mt-4 text-center text-xs text-ink-soft">
            Sample report preview — from the bundled demo data, not live monitoring.
          </p>
          <div className="mt-8 text-center">
            <Link
              href="/scan"
              className="inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
            >
              Run the sample scan
            </Link>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────── */}
        <section
          id="how-it-works"
          className="border-y border-hairline bg-surface"
        >
          <div className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-ink">
                From export to ranked report in six steps
              </h2>
              <p className="mt-4 text-ink-soft">
                Drop in a MidPoint user export and a Keycloak realm export — the whole pipeline
                runs locally in your browser tab.
              </p>
            </div>
            <div className="mt-12">
              <PipelineVisualizer />
              <p className="mt-3 text-center text-xs text-ink-soft">
                Click any stage to see what it does — with example input and output.
              </p>
            </div>
          </div>
        </section>

        {/* ── Security ────────────────────────────────────────── */}
        <section id="security" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink">
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
                    className="mt-0.5 shrink-0 text-moat-ink"
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
        </section>

        {/* ── IAM review journey ──────────────────────────────── */}
        <section className="border-t border-hairline bg-canvas">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-ink">
                How {BRAND.name} helps an IAM review
              </h2>
              <p className="mt-4 text-ink-soft">
                From raw exports to an audit-ready remediation list — a point-in-time scan that
                slots into the access review you already run.
              </p>
            </div>
            <div className="mt-10">
              <UserJourneySection />
            </div>
          </div>
        </section>

        {/* ── Case study teaser ───────────────────────────────── */}
        <section className="border-t border-hairline bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Built as an IAM research project — read the case study
              </h2>
              <p className="text-ink-soft">
                Why this exists, how the architecture works, which IAM concepts it demonstrates
                (IGA, RBAC, SoD, least privilege, Zero Trust), and where it goes next.
              </p>
              <Link
                href="/case-study"
                className="rounded-lg border border-hairline bg-canvas px-5 py-2.5 font-semibold text-ink transition-colors hover:border-ink-soft"
              >
                Read the case study →
              </Link>
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
              className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-[#2c3a8c] shadow-sm transition-colors hover:bg-white/90"
            >
              Try sample scan
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
              <Link href="/case-study" className="hover:text-ink">
                Case study
              </Link>
              <Link href="/scan" className="hover:text-ink">
                Scanner
              </Link>
            </nav>
          </div>
          <p className="mt-6 text-center text-xs text-ink-soft sm:text-left">
            {BRAND.name} is an open-source prototype for export-based analysis, built for IAM
            research and practical security review by {BRAND.author} alongside a Zero Trust thesis
            (MidPoint &amp; Keycloak vs NIST SP 800-207). Not a monitoring product, not
            certified for compliance use, and not affiliated with Evolveum or the Keycloak
            project.
          </p>
        </div>
      </footer>
    </>
  );
}
