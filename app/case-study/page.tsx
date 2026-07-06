import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: `Case study — ${BRAND.name}`,
  description: `How and why ${BRAND.name} was built: architecture, security decisions, IAM concepts demonstrated, and roadmap.`,
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="border-l-4 border-brand pl-3 text-xl font-bold tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-ink-soft">{children}</div>
    </section>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-hairline bg-surface px-3 py-1 text-sm text-ink"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

const SECURITY_DECISIONS = [
  {
    decision: "Browser-only",
    why: "Identity exports contain your whole privilege model. The safest place for them is the device they are already on.",
  },
  {
    decision: "No backend, no upload",
    why: "There is no server-side attack surface and no trust question — nothing is transmitted, logged, or stored.",
  },
  {
    decision: "Read-only",
    why: "The scanner never connects to MidPoint or Keycloak. It analyzes exports; it cannot change anything.",
  },
  {
    decision: "Static hosting",
    why: "The app deploys as plain static files (GitHub Pages). What you audit in the repo is exactly what runs.",
  },
  {
    decision: "Export-based analysis",
    why: "Point-in-time scans of export files — deliberately not real-time monitoring, and honest about that.",
  },
];

const IAM_CONCEPTS = [
  "Identity Governance & Administration (IGA)",
  "Identity Provider (IdP) federation",
  "RBAC",
  "OAuth clients",
  "Service accounts",
  "Non-human identities (NHI)",
  "Separation of duties",
  "Least privilege",
  "Access review",
  "Zero Trust",
];

const TECH_STACK = [
  "Next.js (App Router, static export)",
  "TypeScript (strict)",
  "Tailwind CSS v4",
  "fast-xml-parser",
  "Vitest",
];

const ROADMAP = [
  "More IdP adapters — Microsoft Entra ID and Okta export support",
  "Scan history — optional, local-first storage (or Supabase for accounts)",
  "Live API connectors as an explicit opt-in (today it is exports only)",
  "Policy tuning UI for thresholds, privileged-role lists, and SoD pairs",
  "PDF report export alongside HTML / JSON / CSV",
];

export default function CaseStudyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink">Case study</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
          {BRAND.name} — Non-Human Identity Risk Scanner
        </h1>
        <p className="mt-3 text-ink-soft">
          An open-source, browser-only prototype built for IAM research and practical security
          review — and as a portfolio artifact alongside a Zero Trust thesis evaluating MidPoint
          and Keycloak against NIST SP 800-207.
        </p>

        <Section title="Problem">
          <p>
            In a typical enterprise, non-human identities — service accounts, API keys, workload
            identities, and increasingly AI agents — outnumber human users many times over. They
            hold standing privileged access, rarely have a clear owner, and are routinely skipped
            by the joiner-mover-leaver processes and access reviews that human accounts get.
          </p>
          <p>
            Worse, their identity data is split across systems: the governance view lives in an
            IGA platform like MidPoint, while the authentication reality — OAuth clients, secrets,
            scopes — lives in an IdP like Keycloak. Each system shows half the picture, so the
            riskiest combinations (an admin-role agent with a never-expiring secret) are invisible
            to both.
          </p>
        </Section>

        <Section title="Architecture">
          <p>
            {BRAND.name} is a fully static Next.js application. There is no backend: adapters,
            correlation engine, risk rules, scoring, and report generation are all TypeScript
            modules executing in the browser. Scan state lives in React context and is cleared on
            refresh. Thresholds, privileged-role patterns, and SoD pairs are plain JSON config.
          </p>
          <div className="rounded-xl border border-hairline bg-surface p-4 font-mono text-sm text-ink">
            MidPoint XML export&nbsp;&nbsp;┐
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ normalize → correlate → analyze → score → report
            <br />
            Keycloak realm JSON&nbsp;┘
          </div>
          <p>
            The correlation step is the core: it links a MidPoint identity to its Keycloak OAuth
            client so one real agent appears once, with governance roles, auth client, and
            credentials combined. Four rules then run over the correlated model: over-privilege,
            dormancy, separation-of-duties conflicts, and standing credentials.
          </p>
        </Section>

        <Section title="Security decisions">
          <ul className="space-y-3">
            {SECURITY_DECISIONS.map((item) => (
              <li key={item.decision} className="rounded-xl border border-hairline bg-surface p-4">
                <p className="font-semibold text-ink">{item.decision}</p>
                <p className="mt-1 text-sm">{item.why}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Tech stack">
          <Chips items={TECH_STACK} />
          <p className="text-sm">
            18 unit tests cover the adapters, correlation, and rules; TypeScript runs in strict
            mode; the site deploys via GitHub Actions to GitHub Pages as a static export.
          </p>
        </Section>

        <Section title="IAM concepts demonstrated">
          <Chips items={IAM_CONCEPTS} />
          <p className="text-sm">
            The project is deliberately built on the same mental model as commercial IGA/IdP
            stacks, so everything it demonstrates transfers to tools like SailPoint, Saviynt, Okta,
            or Entra ID.
          </p>
        </Section>

        <Section title="What makes it different">
          <p>
            Single-system scanners already exist. The differentiator here is{" "}
            <strong className="text-ink">cross-stack correlation</strong> — treating the IGA view
            and the IdP view as two halves of one identity, then scoring risk on the combined
            picture. That is also the honest research question behind it: what does identity
            governance look like when the identity is an autonomous agent rather than a person?
          </p>
        </Section>

        <Section title="Roadmap">
          <ul className="list-disc space-y-1.5 pl-5 text-sm">
            {ROADMAP.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm">
            The engine stays source-agnostic on purpose — new identity sources are adapters that
            emit the same canonical model.
          </p>
        </Section>

        <Section title="Honest scope">
          <p>
            {BRAND.name} is an open-source prototype: export-based, point-in-time analysis for
            research, learning, and practical review. It is not an enterprise product, does not do
            real-time monitoring, and is not certified for compliance use.
          </p>
        </Section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/scan"
            className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
          >
            Try the sample scan
          </Link>
          <a
            href={BRAND.repoUrl}
            className="rounded-lg border border-hairline bg-surface px-5 py-2.5 font-semibold text-ink transition-colors hover:border-ink-soft"
          >
            Browse the source
          </a>
        </div>
      </main>
    </>
  );
}
