# Project Completion Plan: Display & Cell Pros Web Platform

> **Status:** Diagnostic complete, grounded in a live `npm install` + `npx tsc --noEmit` + `npm run build` run against the current `main` branch on 2026-08-18. Numbers and file paths below are from that run, not guesses.

## 1. What this project is

Display & Cell Pros is a Next.js 15.5 / React 19 (App Router) web platform for a phone/device repair business, deployed to Vercel at `displaycellpros.com`. It combines:

- **Customer-facing site**: marketing pages, `services`, `store` (Shopify storefront integration under `src/lib/shopify`), `products/[handle]`, `cart`, `b2b` portal.
- **Repair operations tooling**: intake forms, ticket tracking, QR/NFC device-label scanning, AI-assisted triage (OpenAI + Google GenAI), repair time estimation, technician chat/checklists (`src/components/Repair*`, `src/app/api/tickets`, `src/app/api/triage`).
- **Auth**: both **Auth0** (`@auth0/nextjs-auth0`, `src/lib/auth0.ts`, `src/app/auth/[auth0]`) and **NextAuth** (`next-auth`, `@next-auth/prisma-adapter`) are wired in simultaneously.
- **Data layer**: Prisma 7 (`prisma/schema.prisma`) over Postgres, targeting an AWS RDS Aurora cluster via IAM auth (`@aws-sdk/rds-signer`, `.env.example` has full RDS config).
- **Infra**: Vercel deploy, GitHub Actions CI (`.github/workflows/deploy.yml`) running `tsc --noEmit` → `lint` → `build` on every push to `main`, a `/api/health` endpoint, cron routes, reCAPTCHA Enterprise.

## 2. Verified current state

| Check | Result |
|---|---|
| `npm install` | ✅ Succeeds (790 packages) |
| `npx tsc --noEmit` | ❌ **209 errors** |
| `npm run build` (`next build`) | ❌ **Fails to compile** |
| CI pipeline (`deploy.yml`) | Runs the same three checks on every push to `main` → currently red |

Because CI type-checks and builds on every push, **the project is not deployable through its own pipeline right now.** (Production may currently be serving an older Vercel build made outside this pipeline — worth confirming in the Vercel dashboard.)

## 3. Root causes (why, not just what)

### 3.1 Two separate frontends were merged into one `src/` tree
Git history shows this literally happened: `Merge refactored Vite/Express codebase into displaycellpros repository`, `chore: merge branch hub002/main into displaycellpros`. As a result the repo now contains:

- **App A (legacy, orphaned)**: a Vite/CRA-style SPA — root `index.html` → `src/main.tsx` → `src/App.tsx` — the original "AI Studio" scaffold `README.md` still describes ("Run and deploy your AI Studio app", `OPENAI_API_KEY`). Nothing in `src/app/` (the real Next.js app) imports `App.tsx` or `main.tsx` — it's dead weight.
- **App B (real, deployed)**: the Next.js App Router tree in `src/app/`, confirmed live via `layout.tsx` → `@/components/UserProviderWrapper`.

Both apps share `src/components/`, `src/lib/`, `src/data/`, `src/utils/`, but App A's files use Vite-style explicit-extension imports (`from './x.tsx'`), which are invalid under this project's `tsconfig.json` (no `allowImportingTsExtensions`). **This single issue accounts for 152 of the 209 tsc errors (TS5097).**

### 3.2 Auth0 SDK version/import mismatch (build-blocking)
`src/lib/auth0.ts` imports `@auth0/nextjs-auth0/server` — an export path that only exists in Auth0 SDK v4+. `package.json` pins `@auth0/nextjs-auth0@3.5.0`, whose `package.json` `exports` map only offers `.`, `./client`, `./edge`, `./testing` — no `/server`. This alone fails `next build`.

### 3.3 Database layer is quadruplicated and colliding
- `src/lib/db.ts` — **not a database module.** It's App A's offline/local-SQLite React-hooks file (`useState`/`useEffect` at module scope), left over from the Vite app.
- `src/lib/serverDb.ts` and `src/lib/aurora.ts` — two near-duplicate, real AWS RDS Aurora `pg.Pool` implementations (same IAM signer pattern, same config, written independently).
- `src/lib/prisma.ts` imports `{ pool } from "./db"` — a symbol `db.ts` doesn't export.
- `src/app/api/tickets/route.ts` and `src/app/comments/page.tsx` import `{ query, isDbConfigured }` from `@/lib/db` — also not exported there.

Net effect: real server routes are importing App A's client-side offline cache module by path collision, while two separate "real" Postgres pool implementations sit unused. This is both a build failure (React hooks in a Server Component) and a correctness bug (tickets/comments literally cannot query the database as written).

### 3.4 Duplicate auth systems
Auth0 (10 files) and NextAuth + Prisma adapter (3 files, backed by `Account`/`Session`/`User` models in `prisma/schema.prisma`) are both present. Only one should be canonical.

### 3.5 Fragmented test tooling
Three uncoordinated test setups: the `test` npm script runs a bespoke `tsx scripts/run-all-tests.ts` runner; `jest` + `jest.config.ts`/`jest.setup.ts` exist but aren't wired to any script; several `*.test.ts` files `import` from `vitest`, which isn't even a project dependency (`Cannot find module 'vitest'` — 6 of the 209 errors).

### 3.6 Remaining ~50 tsc errors, misc
- Missing packages actually referenced in code: `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`, `@vercel/speed-insights/react`, `@auth0/auth0-react`.
- `import.meta.env` used in several components — a Vite idiom; Next.js uses `process.env` (also part of the App A/App B split).
- Case-only filename collision: `QRScannerModal.tsx` vs `QrScannerModal.tsx`.
- Duplicate `User` identifier in `RepairStatusTracker.tsx`.
- `StaticImageData` passed where `string` is expected (image props).
- `ServiceTier.TIER_1..4` referenced but not defined on the enum.

### 3.7 Config cruft
`next.config.js` (active, CJS) vs `next.config.__vercel_builder_backup__.js` (stale, ESM) — leftover backup file. ESLint is set to `ignoreDuringBuilds: true` in `next.config.js`, while CI separately runs `npm run lint` as its own gate — inconsistent but not itself broken.

### 3.8 Prior cleanup attempts exist but were never executed
`docs/superpowers/plans/2026-07-30-strategic-modernization.md` and `2026-07-30-typescript-fixes.md` already identified parts of this (Prisma/Auth type errors, dependency modernization) — **every checkbox in both is still unchecked.**

---

## 4. Implementation plan

Ordered so each phase unblocks the next and the build goes from "fails to compile" → "fails typecheck only" → "green," rather than fixing symptoms in file-alphabetical order.

### Phase 0 — Decisions needed before touching code
These are product/architecture calls, not typos. Recommended defaults are marked ⭐; flag if you want the other path.

- [ ] **Auth system**: keep **NextAuth + Prisma adapter** ⭐ (already schema-backed, no version mismatch) and remove Auth0, *or* keep Auth0 (fix the v3/v4 mismatch, update the 10 dependent files) and remove NextAuth. 10 files depend on Auth0 vs 3 on NextAuth, so removing Auth0 is less code churn, but confirm which one actually has working production credentials today.
- [ ] **Canonical DB pool module**: consolidate to **`src/lib/aurora.ts`** ⭐ (or `serverDb.ts` — they're near-identical; pick whichever has been more recently exercised in production) as the single Postgres/Aurora pool, used by both `prisma.ts` and the raw-`query()` routes.
- [ ] **Test framework**: standardize on **Jest** ⭐ (already has `next/jest` config wired) — migrate the `vitest`-flavored `*.test.ts` files to Jest APIs and fold `scripts/run-all-tests.ts` assertions into Jest tests, or delete duplicates.
- [ ] **Legacy Vite SPA (`index.html`, `src/main.tsx`, `src/App.tsx`)**: delete ⭐ (confirmed unreferenced by the real app), or salvage anything Next.js doesn't yet have and delete the rest.

### Phase 1 — Stop the bleeding: separate the two apps
**Goal:** `tsc` only ever sees the real app; the legacy SPA stops polluting every typecheck.

- [ ] Confirm nothing in production depends on the root `index.html` entry (check Vercel routing/rewrites).
- [ ] Delete `index.html`, `src/main.tsx`, `src/App.tsx`, and any App-A-only files under `src/components`/`src/lib` not imported by `src/app/**`.
- [ ] Re-run `npx tsc --noEmit` — expect the 152 TS5097 errors to disappear.
- [ ] Remove now-dead root `index.ts` / `metadata.json` if confirmed unused by the Next app (currently excluded from `tsconfig.json` already, but referenced in `README.md`).

### Phase 2 — Fix the build-blocking errors
- [ ] Auth0: either upgrade `@auth0/nextjs-auth0` to v4 and migrate `src/lib/auth0.ts`/`src/app/auth/[auth0]` to the v4 API, or pin `src/lib/auth0.ts` back to the v3 API (drop the `/server` subpath import) — per the Phase 0 auth decision.
- [ ] Rename/repoint `src/lib/db.ts` so it no longer shadows the DB import path: either move the offline-SQLite hook file to a differently named module (e.g. `src/lib/offlineDb.ts`) or delete it if App A is being removed, then update `prisma.ts`, `api/tickets/route.ts`, and `app/comments/page.tsx` to import `pool`/`query`/`isDbConfigured` from the canonical Aurora module chosen in Phase 0.
- [ ] Delete the non-canonical duplicate (`serverDb.ts` or `aurora.ts`, whichever loses).
- [ ] `npm run build` should now compile past webpack module resolution — re-run and capture the next error tier.

### Phase 3 — Consolidate auth
- [ ] Remove the losing auth system's dependencies from `package.json`, its files, its Prisma models (if NextAuth loses, drop `Account`/`Session` models + migration follow-up), and any env vars in `.env.example`.
- [ ] Verify every route/component gating on auth (`UserProfile.tsx`, `Auth0UserButton.tsx` / `UserProviderWrapper.tsx`, `api/tickets`, `api/refresh-token`) uses the single remaining system.
- [ ] Manually exercise sign-in/sign-out locally.

### Phase 4 — Clear remaining `tsc` errors
- [ ] Install genuinely-needed missing packages (`stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`, `@vercel/speed-insights/react`) **or** delete the dead code paths referencing them if those features (Stripe checkout, Speed Insights) aren't actually in use.
- [ ] Replace remaining `import.meta.env.X` with `process.env.NEXT_PUBLIC_X` (client) or `process.env.X` (server) — check `NEXT_PUBLIC_` prefixing for anything read in the browser.
- [ ] Resolve `QRScannerModal.tsx`/`QrScannerModal.tsx` case collision (pick one, update the import in `RepairStatusTracker.tsx`).
- [ ] Fix duplicate `User` identifier in `RepairStatusTracker.tsx`.
- [ ] Fix `StaticImageData` vs `string` mismatches in `LiveTechnicianChat.tsx`, `AboutUs.tsx`, `App.tsx` (if still relevant post-Phase-1) by using `.src` or Next's `Image` component consistently.
- [ ] Add the missing `TIER_1`–`TIER_4` members to the `ServiceTier` enum/const in `IntakeForm.tsx`'s source, or fix the call sites to use the enum's actual members.
- [ ] Re-run `npx tsc --noEmit` until it reports 0 errors.

### Phase 5 — Consolidate test tooling
- [ ] Migrate `*.test.ts` files off `vitest` imports onto Jest globals (or add `vitest` + a vitest config if that's preferred instead — but pick one framework, not both).
- [ ] Fold the assertions in `scripts/run-all-tests.ts` into proper Jest test files under `src/`, or keep it only if it's doing something Jest genuinely can't (e.g. a smoke test against a live deployment).
- [ ] Update `package.json` `test`/`test:all` scripts to run Jest (`next/jest` is already configured).
- [ ] `npm test` passes clean.

### Phase 6 — Config cleanup
- [ ] Delete `next.config.__vercel_builder_backup__.js` (stale backup, wrong module syntax) once `next.config.js` is confirmed as the active config.
- [ ] Decide whether `eslint.ignoreDuringBuilds: true` should stay, given CI already gates on `npm run lint` separately — align the two so a red lint doesn't silently ship via `next build` locally.
- [ ] Add an `.nvmrc` / `engines` field matching the Node 22 used in `deploy.yml` (per the still-unchecked strategic-modernization plan, Task 3).

### Phase 7 — Get CI green end-to-end
- [ ] `npx tsc --noEmit` → 0 errors.
- [ ] `npm run lint` → passes.
- [ ] `npm run build` → succeeds.
- [ ] Push a throwaway branch/PR and confirm `.github/workflows/deploy.yml` goes green.
- [ ] Cross-check against the live Vercel deployment to make sure this pipeline's output matches what's actually being served in production, and promote if not.

### Phase 8 — Stretch (lower priority, only after Phases 0–7 are done)
- [ ] Revisit `.artifacts/mobile_readiness.artifact.md` (native Android/iOS via Firebase) — currently just a strategy doc, no code yet. Don't start until the web app has a stable, single-source-of-truth codebase to build the mobile bridge against.

---

## 5. Suggested execution order for an agentic worker

Phases 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 map directly to git-committable checkpoints; recommend one commit per phase (matching this repo's existing plan-doc convention), re-running `npx tsc --noEmit` and `npm run build` after every phase to confirm forward progress before moving on.
