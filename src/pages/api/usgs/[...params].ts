import type { NextApiRequest, NextApiResponse } from "next";

const USGS_BASE_URL = "https://waterservices.usgs.gov/nwis";

// Allowlist of valid USGS NWIS service endpoints
const ALLOWED_SERVICES = new Set(["iv", "dv", "gwlevels", "site", "stat", "measurements"]);

// Default USGS site IDs for CNO territory (southeastern Oklahoma)
const CNO_DEFAULT_SITES = [
  "07332500", // Red River at Denison Dam
  "07335500", // Blue River near Blue, OK
  "07336000", // Kiamichi River at Antlers, OK
  "07340000", // Little River near Horatio, AR
  "07361000", // Mountain Fork River
];

type USGSData = Record<string, unknown>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<USGSData | { error: string }>
) {
  const { params } = req.query;
  const paramArray = Array.isArray(params) ? params : [params];
  const service = paramArray[0] ?? "iv"; // iv = instantaneous values

  // Validate service against allowlist to prevent path traversal
  if (!ALLOWED_SERVICES.has(service)) {
    return res.status(400).json({ error: `Invalid service: ${service}` });
  }
  // Build USGS query parameters
  const usgsParams = new URLSearchParams();

  // Accept query overrides from the client
  const {
    sites,
    stateCd,
    huc,
    parameterCd,
    period,
    startDT,
    endDT,
    format,
  } = req.query;

  if (sites) {
    usgsParams.set("sites", String(sites));
  } else if (stateCd) {
    usgsParams.set("stateCd", String(stateCd));
  } else if (huc) {
    usgsParams.set("huc", String(huc));
  } else {
    // Default: fetch CNO territory gauges
    usgsParams.set("sites", CNO_DEFAULT_SITES.join(","));
  }

  usgsParams.set("parameterCd", String(parameterCd ?? "00060,00065")); // discharge + gauge height
  // Only allow JSON format through the proxy
  usgsParams.set("format", "json");
  if (format && format !== "json") {
    return res.status(400).json({ error: "Only JSON format is supported" });
  }

  if (period) usgsParams.set("period", String(period));
  if (startDT) usgsParams.set("startDT", String(startDT));
  if (endDT) usgsParams.set("endDT", String(endDT));

  const upstreamUrl = `${USGS_BASE_URL}/${service}/?${usgsParams.toString()}`;

  try {
    const upstreamRes = await fetch(upstreamUrl, {
      headers: { Accept: "application/json" },
      // next.js fetch cache: revalidate every 15 minutes
      next: { revalidate: 900 },
    } as RequestInit);

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json({
        error: `USGS API returned ${upstreamRes.status}: ${upstreamRes.statusText}`,
      });
    }

    const data: USGSData = await upstreamRes.json();

    // Cache the response for 15 minutes
    res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=1800");
    return res.status(200).json(data);
  } catch (err) {
    console.error("USGS proxy error:", err);
    return res.status(502).json({ error: "Failed to fetch data from USGS" });
  }
}
