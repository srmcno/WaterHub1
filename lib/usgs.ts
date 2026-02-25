const USGS_BASE_URL = "https://api.waterdata.usgs.gov/ogcapi/v0";

const ALLOWED_COLLECTIONS = new Set([
  "monitoring-locations",
  "time-series",
  "observations",
]);

export function buildUsgsUrl(
  collection: string,
  params: URLSearchParams = new URLSearchParams(),
) {
  const selectedCollection = ALLOWED_COLLECTIONS.has(collection)
    ? collection
    : "monitoring-locations";

  const outgoingParams = new URLSearchParams(params);
  if (!outgoingParams.has("f")) {
    outgoingParams.set("f", "json");
  }

  const url = new URL(
    `${USGS_BASE_URL}/collections/${selectedCollection}/items`,
  );
  url.search = outgoingParams.toString();
  return url;
}

export async function fetchUsgsCollection(
  collection: string,
  params: URLSearchParams = new URLSearchParams(),
) {
  const url = buildUsgsUrl(collection, params);
  const response = await fetch(url, {
    next: { revalidate: 3600 },
    headers: {
      Accept: "application/geo+json, application/json;q=0.9",
    },
  });

  const body = await response.json();
  return { response, body, url: url.toString() };
}
