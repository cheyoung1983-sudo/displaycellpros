# Deployment Preparation: Final Manual Steps

The project build is stabilized after major dependency upgrades and configuration fixes.

## 1. Fix Component Imports [DONE]
The components were failing to import constants because they were attempting to import from `src/lib/constants` (a file that does not exist or has no exports) instead of `src/lib/constants.tsx` or `src/lib/ui-constants`.

- **Action Taken:** Updated imports in `www.displaycellpros.com-refractored` to use the correct paths.

## 2. Resolve Vercel Auth OIDC Import [DONE]
The build was failing because `createSigner` is not found on `@vercel/functions/oidc`.

- **Action Taken:** Verified that `@vercel/functions/oidc` exports `awsCredentialsProvider` for AWS OIDC. Updated `src/lib/db.ts` to use `awsCredentialsProvider` correctly. Removed redundant root `lib/vercelAuth.ts` which was causing build conflicts.

## 3. Resolve Prisma Client Generation [DONE]
The build failed with `Type error: Module '"@prisma/client"' has no exported member 'PrismaClient'`.

- **Action Taken:** Restored `url = env("DATABASE_URL")` to `prisma/schema.prisma` and updated `prisma.config.ts` to explicitly map the datasource. This ensures the Prisma CLI can correctly identify the provider and generate the types during the build phase.
- **Action Taken:** Added `prisma generate` to the `build` script in `package.json`.

## 4. Final Deployment
1. [DONE] `npx tsc --noEmit` completes with 0 errors.
2. [DONE] `npm run build` completes successfully.
3. [DONE] Deployed to Vercel production: `https://www.displaycellpros.com`.

## 5. Dependency Security Follow-up
1. [PENDING] Prisma 7.9.1 remains subject to three high-severity audit advisories through `@prisma/config` and `deepmerge-ts`.
2. Do not apply npm's suggested downgrade to Prisma 6.12. Reassess when Prisma publishes a compatible security release.
