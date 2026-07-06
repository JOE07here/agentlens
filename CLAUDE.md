# CyberLens (formerly AgentLens)

Browser-only web app. Reads MidPoint + Keycloak exports and reports risky
non-human / AI-agent identities. Read-only. Nothing leaves the browser.
Brand name/tagline/links live in lib/brand.ts — rename the product there only.

## Stack
- Next.js (App Router) + TypeScript (strict) + Tailwind v4
- 100% client-side: no backend, no database, no network/API calls
- XML: fast-xml-parser. JSON: native. Tests: vitest.

## Specs — read before building a feature
- /docs has Architecture v0.2 and the Build Guide (HTML)
- Canonical types live in lib/model/types.ts — everything flows through them

## Hard rules
- Read-only: never write back to MidPoint or Keycloak
- No LLM, no fetch, no analytics — privacy is the product
- SCAN data stays in React state (see app/providers.tsx) — never persisted.
  localStorage holds exactly one key: "theme" (UI preference, no scan data).
- lib/correlate.ts (link MidPoint identity to its Keycloak client) is THE
  core feature — treat it with extra care
- Honest wording only: "prototype", "open-source scanner", "export-based
  analysis". Never claim enterprise readiness, real-time monitoring, or
  compliance certification.

## Conventions
- TypeScript strict, no `any`
- One file per adapter and per rule; adapters output the canonical model, rules read it
- UI: light/dark/system theming via CSS vars in app/globals.css (.dark class
  on <html>, applied pre-paint by a script in app/layout.tsx + ThemeToggle).
  High contrast is required in BOTH modes (WCAG AA minimum). Use the semantic
  tokens; `brand`/`moat` are fills that carry white text, `brand-ink`/
  `moat-ink` are accent text/borders on surfaces.
- Small, focused components

## Pipeline (lib/pipeline.ts)
ingest → normalize → correlate → rules → score → ScanResult

## Layout
- app/            page.tsx (landing), scan/page.tsx (scanner), report/page.tsx,
                   case-study/page.tsx, providers.tsx (scan state)
- components/      FileDrop, AgentPanel, FindingRow, SummaryCards, badges, Pipeline,
                   Header, Logo, ThemeToggle, MetricCard, GuideSteps, RiskRuleCard, EmptyState
- lib/model        types.ts (canonical model)
- lib/brand.ts     product name/links · lib/ruleInfo.ts plain-language rule explanations
- lib/adapters     midpoint.ts, keycloak.ts
- lib/rules        overPrivilege, dormancy, sodConflict, standingCredential (+ index)
- lib/report       exportHtml.ts, exportData.ts
- config/          rules.json, sodConflicts.json, classification.json, correlation.json
- samples/         midpoint-export.xml, keycloak-realm.json (lib/samples.ts is generated)

## Commands
- npm run dev · npm run build · npm test · npm run typecheck
- Edit a sample? re-run `node scripts/gen-samples.mjs` to refresh lib/samples.ts
- NOTE: `next build`/`next dev` hang inside the Claude Code sandbox on this
  machine — verify via vitest + tsc locally and let GitHub Actions build/deploy.
