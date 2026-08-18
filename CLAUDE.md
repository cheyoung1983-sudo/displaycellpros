# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The production Next.js site for **Display & Cell Pros** (displaycellpros.com), a device repair business. It combines a marketing/e-commerce site (Shopify-backed store, products, cart) with an AI-driven diagnostic/triage/repair-tracking system (Gemini/OpenAI-powered chat, diagnostics, and dynamic repair-completion estimates), plus B2B and technician-facing tooling.

## Two codebases live in this repo — only one is active

This repo is mid-migration from a Vite + Express "AI Studio" scaffold to Next.js App Router. Both sets of files still exist on disk:

- **Active app**: `src/app/**` (Next.js App Router), driven by `package.json` scripts (`next dev`/`next build`). This is what actually deploys.
- **Legacy/unused**: `server.ts` (Express server duplicating AI/diagnostic endpoints), `index.ts`, `index.html`, `vite.config.ts`. These are explicitly excluded from Vercel deploys via `.vercelignore` (see the "Legacy Root Files" section) and are not wired into any npm script. Do not extend `server.ts` for new features — port logic into `src/app/api/**` route handlers instead. Treat these files as dead code unless the user says otherwise.
- `src/lib/`, `src/components/`, `src/utils/`, `src/data/`, `src/hooks/` are shared and used by the active Next.js app (some also referenced by the legacy server).

## Commands

```bash
npm run dev             # next dev on port 3000
npm run build            # prisma generate && next build
npm run lint             # next lint (ESLint, next/core-web-vitals)
npx tsc --noEmit          # strict TypeScript check — CI runs this before build
npm run test              # tsx scripts/run-all-tests.ts (custom assert-based suite, not Jest)
npm run test:shopify      # tsx scripts/test-shopify.ts
npm run test:all          # both of the above
```

Jest is configured (`jest.config.ts`, `next/jest`, jsdom) and `*.test.ts`/`*.test.tsx` files exist alongside source (e.g. `src/lib/db.test.ts`, `src/components/DeviceModelAutocomplete.test.ts`), but there is no `jest` script in `package.json` — run it directly with `npx jest` or `npx jest path/to/file.test.ts` for a single file. `npm run test` runs a separate, non-Jest suite (`scripts/run-all-tests.ts`) that asserts against `src/utils/completionCalculator.ts` and `src/data/supportedDevicesData.ts`.

CI (`.github/workflows/deploy.yml`, runs on push/PR to `main`) does, in order: `npm ci` → `npx tsc --noEmit` → `npm run lint` → `npm run build`. Match this locally before pushing.

## Architecture

**Routing / API**: Next.js App Router under `src/app`. Route groups include `products/[handle]`, `store`, `cart`, `b2b`, `services`, `lab` (internal diagnostics workbench), `comments`, `welcome`, `auth`. API routes live under `src/app/api/**` — notably `chat`, `generate-quote`, `tax-lookup`, `tickets`, `triage`, `recaptcha/assess`, `cron/refresh` (daily via `vercel.json` cron), and `mcp/authorize` + `mcp/token` (MCP OAuth endpoints). Auth uses NextAuth (`auth/[...nextauth]`) layered with Auth0 (`src/lib/auth0*.ts`, `src/services/auth0McpService.ts`).

**Data layer**: Prisma (`prisma/schema.prisma`) targets PostgreSQL but only defines NextAuth's own models (`Account`, `Session`, `User`, `VerificationToken`) — no datasource `url` is hardcoded, it's resolved at runtime (see `src/lib/db.ts` / `prisma.config.ts`). Application data (repair tickets, device info) goes through a separate AWS Aurora PostgreSQL connection with IAM auth (`src/lib/aurora.ts`, `src/lib/db.ts`, `src/lib/dbOptimizations.ts`), signed via `@aws-sdk/rds-signer`. Pool tuning is env-driven (`PG_MAX_POOL`, `PG_RO_MAX_POOL`, etc. — see `.env.example`). `PGHOST_READ_ONLY` is used for read replicas.

**Commerce**: Shopify Storefront API integration lives in `src/lib/shopify.ts`, `src/lib/shopify-queries.ts`, `src/lib/shopify-types.ts`, and `src/lib/shopify/operations/`. Cart logic is in `src/lib/cart-actions.ts`.

**AI features**: Chat/diagnostic/triage endpoints call OpenAI (`openai`, `ai` SDK — Vercel AI Gateway model IDs like `openai/gpt-5.4`) and Google Gemini (`@google/genai`). Request/response validation uses Zod schemas centralized in `src/lib/schemas.ts` (`DiagnoseSchema`, `SmartTriageSchema`, `DiagnosticPathSchema`, `CalculateCompletionSchema`, `BookingScheduleSchema`, `SupportMessageSchema`, `AcademyVideoSchema`, `SupportChatSchema`). Server-side hardening (rate limiting, response caching, timeouts, security headers) is centralized in `src/lib/serverSecurity.ts` — reuse these helpers for new AI/API endpoints rather than rolling new ones.

**Repair domain logic**: `src/utils/completionCalculator.ts` computes dynamic repair-completion estimates (tier, queue position, technician load, parts availability, priority/express). `src/data/supportedDevicesData.ts` is the device catalog (model names, board IDs, model numbers) used for fuzzy device lookup. `src/lib/repair-logic.ts` and `src/lib/technicianEvents.ts` hold related domain logic.

**Security**: `src/lib/serverSecurity.ts`, `src/lib/lexical-firewall.ts`, `src/lib/serverDb.ts`, and reCAPTCHA Enterprise (`@google-cloud/recaptcha-enterprise`, `src/app/api/recaptcha/assess`) guard public-facing forms and AI endpoints. CSP and other security headers are set in `vercel.json`.

**Deployment**: Vercel, Next.js framework preset. `.vercelignore` excludes many legacy/experimental folders (`cb001`, `functions`, `netlify`, `server.ts`, `www.displaycellpros.com-refractored`, etc.) — check this file before assuming a top-level folder is relevant. `vercel.json` defines a daily cron (`/api/cron/refresh`) and response security headers. See `README_PROD.md` for on-call/production operations (rollback, monitoring, rate-limit tuning, secret rotation).

## Conventions

- Path alias `@/*` resolves to the repo root (see `tsconfig.json`); prefer it over relative `../../..` imports in `src/**`.
- New Zod validation schemas belong in `src/lib/schemas.ts`, not inline in route handlers, so both the (legacy) Express server and Next.js routes can share them.
- ESLint (`next/core-web-vitals`) has `react/no-unescaped-entities`, `@next/next/no-html-link-for-pages`, and `@next/next/no-img-element` disabled — don't fight these locally.
- `eslint.ignoreDuringBuilds: true` in `next.config.js` means lint failures do **not** fail `npm run build` — CI runs `npm run lint` as a separate, blocking step.
