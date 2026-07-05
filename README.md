# AgentLens

**Browser-only risk scanner for non-human / AI-agent identities.**

**[▶ Live demo](https://joe07here.github.io/agentlens/)** — try it in your browser with the bundled sample data, nothing to install.

AgentLens reads a [MidPoint](https://evolveum.com/midpoint/) identity export and a
[Keycloak](https://www.keycloak.org/) realm export, **correlates the same agent across
both systems**, and ranks its risks. Everything runs in your browser — no server, no
upload, no network calls. Nothing leaves the device.

## Why it's different

Most tools look at one system at a time. AgentLens' moat is **cross-stack correlation**:
it links a MidPoint identity to its Keycloak OAuth client so one real agent shows up
**once**, with its full picture — governance roles *and* auth client *and* its secret.
That combined view is what surfaces risks neither system shows on its own (e.g. a service
account that is admin in MidPoint *and* holds a never-expiring client secret in Keycloak).

## The scan pipeline

```
ingest → normalize → correlate → analyze → score → report
```

1. **Ingest** — parse the two exports (`lib/adapters/`)
2. **Normalize** — fold into one canonical model; classify human vs non-human (`lib/normalize.ts`)
3. **Correlate** — link the same agent across systems (`lib/correlate.ts` — the moat)
4. **Analyze** — run the four risk rules (`lib/rules/`)
5. **Score** — rank findings worst-first (`lib/score.ts`)
6. **Report** — render + export HTML / JSON / CSV (`app/report/`, `lib/report/`)

## The four risk rules

| Rule | Flags |
|------|-------|
| **Over-privilege** | An agent holding admin-level roles (machines held to least privilege) |
| **Dormancy** | An enabled agent inactive beyond the threshold |
| **Separation of duties** | Two conflicting duties on one agent (e.g. initiate *and* approve payments) |
| **Standing credential** | A long-lived secret that never expires or is past its max age |

Thresholds, severities, the privileged-role list, SoD pairs, classification patterns and
correlation strategy are all editable in `config/*.json` — no code changes needed.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

On the upload screen, drop the two exports (or click **Load sample data**) and **Run scan**.

```bash
npm test           # vitest — adapters + end-to-end pipeline
npm run typecheck  # tsc --noEmit (strict)
npm run build      # static production build (deploy to Vercel / any static host)
```

## Sample data

`samples/midpoint-export.xml` and `samples/keycloak-realm.json` contain a realistic mix:
a service account that is admin in both systems with a SoD conflict and a never-expiring
secret, a dormant account, a Keycloak-only legacy client, and healthy human + machine
controls. `lib/samples.ts` (used by the in-app "Load sample data" button) is generated
from these files via `node scripts/gen-samples.mjs`.

## Stack

Next.js (App Router) · TypeScript (strict) · Tailwind v4 · fast-xml-parser · vitest.
No backend, no database, no external API calls.

## Roadmap

v0.1 is client-side only. The engine is intentionally source-agnostic so growth stays
**additive, not a rewrite**: add Supabase for scan history & accounts, then live API
connectors and more IdP adapters. See `docs/Architecture_v0.2.html`.
