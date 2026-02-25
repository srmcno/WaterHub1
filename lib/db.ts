import { Pool } from "pg";

let pool: Pool | null = null;

/**
 * Returns a singleton PostgreSQL connection pool.
 * Configure via environment variables:
 *   DATABASE_URL  – full connection string (preferred, set by Railway/Supabase)
 *   PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD – individual params
 */
export function getDb(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "false"
        ? false
        : { rejectUnauthorized: true },
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });

    pool.on("error", (err) => {
      console.error("Unexpected DB pool error:", err);
    });
  }
  return pool;
}

/**
 * Executes a query using the shared pool.
 */
export async function query<T extends Record<string, unknown>>(
  text: string,
  values?: unknown[]
): Promise<T[]> {
  const db = getDb();
  const result = await db.query(text, values);
  return result.rows as T[];
}
