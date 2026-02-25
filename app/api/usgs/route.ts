import { NextRequest, NextResponse } from "next/server";

import { fetchUsgsCollection } from "@/lib/usgs";

/**
 * USGS Water Data OGC API Proxy
 *
 * Proxies requests to the USGS Water Data API (api.waterdata.usgs.gov).
 * Supported collections: monitoring-locations, time-series, observations
 *
 * Query Parameters:
 * - collection: OGC collection name (default: "monitoring-locations")
 * - Any other params are forwarded to USGS (e.g. limit, bbox, f)
 */
export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  const collection = params.get("collection") ?? "monitoring-locations";
  params.delete("collection");

  try {
    const { response, body, url } = await fetchUsgsCollection(collection, params);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "USGS API request failed",
          status: response.status,
          sourceUrl: url,
          details: body,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({ sourceUrl: url, data: body });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected failure while calling USGS API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
