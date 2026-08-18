/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Server-side PostgreSQL data access facade over the Aurora connection
 * pool (src/lib/aurora.ts). Server Components and API routes should
 * import from here rather than aurora.ts directly.
 *
 * For the client-side offline SQLite store and its React hook
 * (useDatabase / useOfflineDatabase), see src/lib/offlineDb.ts.
 */

export { query, withConnection, getAuroraPool, isDbConfigured } from './aurora.ts';
