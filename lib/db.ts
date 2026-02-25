import { Pool } from "pg";

let pool: Pool | null = null;

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return null;
  }

  const sslDisabled = process.env.PGSSLMODE === "disable";
  const allowSelfSigned = process.env.PGSSL_ALLOW_SELF_SIGNED === "true";

  return new Pool({
    connectionString,
    ssl: sslDisabled
      ? false
      : { rejectUnauthorized: !allowSelfSigned },
  });
}

export function getPool() {
  if (!pool) {
    pool = createPool();
  }

  return pool;
}
