# AgentLens

Browser-only web app. Reads MidPoint + Keycloak exports and reports risky
non-human / AI-agent identities. Read-only. Nothing leaves the browser.

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
- Keep scan data in React state (see app/providers.tsx); no localStorage
- lib/correlate.ts (link MidPoint identity to its Keycloak client) is THE
  core feature — treat it with extra care

## Conventions
- TypeScript strict, no `any`
- One file per adapter and per rule; adapters output the canonical model, rules read it
- UI: high contrast only — light background, dark text. Never low-contrast.
- Small, focused components

## Pipeline (lib/pipeline.ts)
ingest → normalize → correlate → rules → score → ScanResult

## Layout
- app/            page.tsx (upload), report/page.tsx, providers.tsx (scan state)
- components/      FileDrop, AgentPanel, FindingRow, SummaryCards, badges, Pipeline, Header
- lib/model        types.ts (canonical model)
- lib/adapters     midpoint.ts, keycloak.ts
- lib/rules        overPrivilege, dormancy, sodConflict, standingCredential (+ index)
- lib/report       exportHtml.ts, exportData.ts
- config/          rules.json, sodConflicts.json, classification.json, correlation.json
- samples/         midpoint-export.xml, keycloak-realm.json (lib/samples.ts is generated)

## Commands
- npm run dev · npm run build · npm test · npm run typecheck
- Edit a sample? re-run `node scripts/gen-samples.mjs` to refresh lib/samples.ts
