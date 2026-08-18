/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Cloud Database Management Layer:
 * High-Availability PostgreSQL Connection Pool with Read-Replica split and RDS IAM Signer.
 */

import { query as serverQuery, getDatabasePool, smartQuery } from './serverDb';

/**
 * Executes a PostgreSQL query using the primary connection pool.
 */
export const query = serverQuery;

/**
 * Active PostgreSQL connection pool instance.
 */
export const pool = getDatabasePool();

/**
 * Executes a read-only query on a replica if possible, or falls back to primary.
 */
export const readQuery = smartQuery;

/**
 * Checks if the database connection parameters are configured.
 */
export function isDbConfigured(): boolean {
  // Returns true if either a direct URL or the host parameter is provided.
  return Boolean(process.env.DATABASE_URL || process.env.PGHOST || process.env.POSTGRES_URL);
}
