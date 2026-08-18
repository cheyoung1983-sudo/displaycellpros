# Display & Cell Pros

Next.js 15 (App Router) web platform for Display & Cell Pros — on-site mobile
electronics and smartphone repair services in Spokane, Washington. Includes
the customer-facing site, Shopify-backed parts store, B2B portal, repair
ticketing, and an internal diagnostics/ops "lab" area.

Deployed on Vercel. See `README_PROD.md` for production operations
(rollback, monitoring, secrets rotation).

## Run locally

**Prerequisites:** Node.js 22 (see `.nvmrc`)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in the values you need
   (Auth0, Shopify, AWS RDS/Aurora, reCAPTCHA, Gemini). Not every route needs
   every variable configured to run locally.
3. Run the app:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` / `npm run build` / `npm start` — Next.js dev/build/start
- `npm run lint` — ESLint (`next lint`)
- `npm test` — Jest unit tests
- `npm run test:shopify` — live smoke test against the configured Shopify store
