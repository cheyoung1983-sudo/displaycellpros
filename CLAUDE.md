# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Display & Cell Pros LLC — a Next.js 15 (App Router) marketing + repair-shop web app for a Spokane, WA mobile device repair business. It combines a Shopify storefront, an AI-assisted repair intake/diagnostics flow (Gemini + OpenAI), Auth0 + NextAuth authentication, and a direct AWS Aurora PostgreSQL connection (via Prisma and a hand-rolled `pg` pool with IAM signing).

## Commands

```bash
npm run dev          # next dev -p 3000
npm run build         # prisma generate && next build
npm start             # next start -p 3000 (serve production build)
npm run lint           # next lint
npx tsc --noEmit        # strict typecheck (CI runs this separately from lint)
npm run test           # tsx scripts/run-all-tests.ts — hand-written assertion script, requires the `tsx` devDependency
npm run test:jest       # jest — runs the *.test.ts files under src/ (jsdom env)
npm run test:shopify    # tsx scripts/test-shopify.ts — hits real/sandboxed Shopify API
npm run test:all        # test + test:jest + test:shopify
```

There is no dev server for the legacy Vite/Express app (`server.ts`) wired into `package.json` — see "Legacy Vite/Express app" below if you need to touch it.

### Testing — read before adding tests

Two test paths, both wired into CI (`.github/workflows/webpack.yml`, in this order: lint → `test` → `test:jest` → build):
- `npm run test` runs `scripts/run-all-tests.ts`, a small hand-written assertion script (not a test framework) that only imports and exercises `completionCalculator.ts` and `supportedDevicesData.ts`.
- `npm run test:jest` runs the `*.test.ts` files scattered under `src/` (e.g. `src/lib/pricing.test.ts`, `src/lib/schemas.test.ts`, `src/components/*.test.ts`) via `jest.config.ts` (Next's `next/jest` wrapper, jsdom environment, `jest.setup.ts` loads `@testing-library/jest-dom`). Import `describe`/`it`/`expect`/`jest` from `@jest/globals` (not `'vitest'` — an earlier version of these files was written against Vitest, which was never installed; that's why they silently never ran until this was fixed).

Both `tsx` and `eslint`/`eslint-config-next` were previously used by `package.json` scripts (`test`, `test:all`, `lint`) but were missing from `devDependencies` — `npm install` alone did not make `npm run test` or `npm run lint` work. All of the above are now real, installed devDependencies; if a fresh `npm ci` ever reports one of these commands as "not found" again, the fix is to add the missing package, not to assume the script is aspirational. Pin `eslint` to `^8` — `next lint` under Next 15 with the legacy `.eslintrc.json` format does not support ESLint 9/10's CLI options.

If you add logic that needs testing, either add assertions to `scripts/run-all-tests.ts` following its existing `assert(condition, name, detail)` pattern, or add a Jest test file following the existing ones' style.

## Architecture

### Two apps live in this repo — only one is deployed

- **`src/app/**`** (Next.js App Router) is the real, deployed application. `vercel.json` declares `"framework": "nextjs"`, and `npm run build`/`dev`/`start` all invoke Next.js directly against this tree.
- **`index.html`, `src/main.tsx`, `src/App.tsx`, `server.ts`, `api/index.ts`, `vite.config.ts`, `index.ts`** are a legacy Vite + Express SPA (from an earlier "AI Studio" scaffold). `.vercelignore` explicitly excludes `server.ts` and `api/` from the Vercel build. These files are **not part of the production build** — don't assume changes here have any effect on the live site unless you're deliberately reviving this path. When in doubt about which app a change belongs in, check whether the target file is under `src/app/`.

### Routing & pages (`src/app`)

Standard Next.js App Router: each `src/app/<segment>/page.tsx` is a route (`store`, `cart`, `b2b`, `services`, `products/[handle]`, `privacy`, `welcome`, `lab`, `comments`). API routes live under `src/app/api/**/route.ts` — notable ones:
- `api/auth/**` — NextAuth (`[...nextauth]`) plus custom Auth0 callback/refresh/signin/start routes (both auth systems are present; see Auth below).
- `api/mcp/{authorize,token}` — MCP OAuth endpoints (used by Vercel Connect / MCP tooling, not end-user auth).
- `api/chat`, `api/triage`, `api/generate-quote`, `api/tax-lookup`, `api/tickets` — AI-assisted repair intake/diagnostics and quoting endpoints, validated with the Zod schemas in `src/lib/schemas.ts` (`DiagnoseSchema`, `SmartTriageSchema`, `DiagnosticPathSchema`, `CalculateCompletionSchema`, `BookingScheduleSchema`, etc.).
- `api/cron/refresh` — scheduled via the `crons` entry in `vercel.json` (daily).
- `api/health` — uptime-monitor target (`README_PROD.md`).

`src/middleware.ts` wraps `src/proxy.ts` and injects a production-only Content-Security-Policy; `vercel.json` also sets its own security headers for the same routes — if you change CSP/security headers, update both places.

### Auth — two systems coexist

- **Auth0** (`@auth0/nextjs-auth0`, `@auth0/auth0-react`) is the primary end-user login (`src/lib/auth0.ts`, `Auth0ProviderWithConfig`, `src/app/auth/[auth0]/route.ts`, `src/app/auth/profile/route.ts`, `src/app/auth/signin/page.tsx`). `src/lib/auth0-mgmt.ts` wraps the Auth0 Management API (RBAC, tenant audit — see `Auth0RbacModal`, `Auth0TenantAuditReport`).
- **NextAuth** (`next-auth`, `@next-auth/prisma-adapter`) also exists (`api/auth/[...nextauth]`) backed by the Prisma `Account`/`Session`/`User`/`VerificationToken` models in `prisma/schema.prisma`. Confirm which system a given surface actually uses before extending auth — don't assume they're unified.

### Data layer — two databases, two access patterns

- **Prisma** (`src/lib/prisma.ts`, `prisma/schema.prisma`) — only models NextAuth's own tables today (Account/Session/User/VerificationToken). Datasource URL comes from `DATABASE_URL`; `prisma generate` runs as part of `npm run build` and `postinstall`.
- **Direct AWS Aurora PostgreSQL** (`src/lib/db.ts`, `src/lib/dbOptimizations.ts`, `src/lib/serverDb.ts`) — a hand-rolled `pg` connection pool with a **read/write split** (`PGHOST` vs `PGHOST_READ_ONLY`) and RDS IAM signing (`@aws-sdk/rds-signer`) instead of a static password; pool sizing/timeouts are tunable via `PG_MAX_POOL`, `PG_RO_MAX_POOL`, `PG_IDLE_TIMEOUT_MS`, `PG_CONNECTION_TIMEOUT_MS`, `PG_STATEMENT_TIMEOUT_MS`, `PG_MAX_USES` (see `.env.example`). This is the repair-shop domain data path (intake, diagnostics, tickets) — Prisma is not used for it. `db.ts` also defines an offline-first SQLite fallback (`useDatabase`/`useOfflineDatabase`) for persisting repair intake entries client-side when offline.

### Commerce (Shopify)

`src/lib/shopify.ts` is the Storefront API GraphQL client (`shopifyFetch`), defaulting to a sandbox store/token baked in as fallbacks if env vars are unset — real deployments must set `SHOPIFY_STORE_DOMAIN`/`SHOPIFY_STOREFRONT_ACCESS_TOKEN`. Query/mutation documents live in `src/lib/shopify/operations/` (e.g. `products.ts`); `src/lib/shopify-queries.ts` and `src/lib/shopify-types.ts` hold additional queries and generated-style types. Cart logic is in `src/lib/cart-actions.ts` and `src/app/cart/`.

### Repair/diagnostics domain logic

This is the app's differentiator — most of it lives in `src/lib/` and `src/utils/`, independent of any specific route:
- `src/utils/completionCalculator.ts` — dynamic ETA calculation (queue position, technician load, parts availability, priority tier) — has the most test coverage (`scripts/run-all-tests.ts` + `completionCalculator.test.ts`).
- `src/data/supportedDevicesData.ts` — the supported-device catalog (model names, board IDs, model numbers) used for fuzzy device lookup.
- `src/lib/pricing.ts` / `src/lib/repair-logic.ts` — quote/tax calculation (note: two separate pricing implementations exist; check which one a given call site actually uses before changing pricing logic).
- `src/lib/schemas.ts` — the Zod validation contracts for the AI/diagnostic API routes.
- AI integration goes through `@google/genai` (Gemini) and `openai`/`ai` (Vercel AI SDK / OpenAI) — see `api/chat`, `api/triage`, `api/generate-quote` and components like `SmartTriageChat.tsx`, `HardwareDiagnosticTool.tsx`, `VoiceIntakeModal.tsx`.

### Components

`src/components/` is a large flat directory (100+ files, no subfolders) covering repair intake/diagnostics UI, the Auth0/ElevenLabs/voice-agent admin tooling, store/cart UI, and shared chrome (`Navbar`, `Footer`, `LayoutWrapper`). There's no naming/grouping convention beyond PascalCase filenames matching the exported component — grep for the component name rather than guessing a subfolder.

Path alias: `@/*` maps to `./src/*` (`tsconfig.json`). Styling is Tailwind v4 (`@tailwindcss/postcss`, `tailwind.config.js`, `globals.css`); `src/lib/utils.ts` exports `cn()` (clsx + tailwind-merge) as the standard classname helper.

## Deployment & environments

- Production target is **Vercel** (`vercel.json`: framework, security headers, daily cron). `README_PROD.md` documents rollback (`vercel rollback`), preview-vs-production promotion (push to non-`main` = preview, `main` = production), health-check monitoring (`/api/health`), log drains, and the `express-rate-limit` threshold (100 req/15 min) — that rate limiter is in `server.ts`, which per above is **not part of the deployed app**; if rate limiting needs adjusting for the real app, it isn't currently implemented in `src/app/**` and will need to be added there (e.g. in `middleware.ts`).
- `netlify.toml` also exists (redirects `/api/*` to Netlify functions, SPA fallback to `index.html`) — this targets the legacy Vite SPA, not the Next.js app; Vercel is the live deployment target per `README_PROD.md`.
- CI (`.github/workflows/deploy.yml`, `webpack.yml`) runs on push/PR to `main`: `npm ci` → `npx tsc --noEmit` → `npm run lint` → `npm run test` → `npm run build`, on Node 20/22.
- `npm install` uses `legacy-peer-deps=true` (`.npmrc`) — keep this in mind if dependency resolution behaves unexpectedly.

## Root-level scripts

The repo root has a number of one-off `.cjs`/`.ts` scripts (`apply_autonoma_config*.cjs`, `pair_autonoma.cjs`, `trigger_autonoma_*.cjs`, `execute-mcp-tool.cjs`, `list-mcp-tools.cjs`, `get_app_logs.cjs`, `get_targets.cjs`, `request_autonoma_secrets.cjs`) — these are operational/MCP tooling utilities for the Autonoma platform and GitHub MCP server integration, unrelated to the Next.js app's runtime. `scripts/` (the directory) holds the actual dev/test/deploy helper scripts (`run-all-tests.ts`, `test-shopify.ts`, `test-db.ts`, `test-connection.ts`, `setup-db.ts`, `generate-sitemap.ts`, `deploy_vercel.ps1`).
