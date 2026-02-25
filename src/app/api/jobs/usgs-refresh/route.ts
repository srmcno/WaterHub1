import { NextRequest, NextResponse } from "next/server";

import { getPool } from "@/lib/db";
import { fetchUsgsCollection } from "@/lib/usgs";

export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const suppliedSecret =
    request.headers.get("x-cron-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (cronSecret && suppliedSecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = new URLSearchParams({ limit: "100", f: "json" });
    const { response, body, url } = await fetchUsgsCollection(
      "monitoring-locations",
      params,
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Unable to fetch monitoring data from USGS",
          status: response.status,
          sourceUrl: url,
        },
        { status: response.status },
      );
    }

    const features = Array.isArray(body?.features) ? body.features : [];
    const pool = getPool();

    if (pool) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ingestion_runs (
          id BIGSERIAL PRIMARY KEY,
          source TEXT NOT NULL,
          records_ingested INTEGER NOT NULL,
          payload JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(
        `INSERT INTO ingestion_runs (source, records_ingested, payload)
         VALUES ($1, $2, $3)`,
        ["usgs-monitoring-locations", features.length, body],
      );
    }

    return NextResponse.json({
      ok: true,
      sourceUrl: url,
      recordsIngested: features.length,
      persistedToDatabase: Boolean(pool),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "USGS refresh job failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
