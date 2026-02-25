"use client";

import { useEffect, useState } from "react";

type UsgsResponse = {
  data?: {
    features?: unknown[];
    numberMatched?: number;
  };
  error?: string;
};

export default function UsgsSnapshot() {
  const [summary, setSummary] = useState<string>("Loading latest USGS monitoring data...");

  useEffect(() => {
    fetch("/api/usgs?collection=monitoring-locations&limit=25")
      .then((res) => res.json())
      .then((payload: UsgsResponse) => {
        if (payload.error) {
          setSummary(`USGS request failed: ${payload.error}`);
          return;
        }

        const matched = payload.data?.numberMatched;
        const count = payload.data?.features?.length;
        setSummary(
          `USGS monitoring locations loaded: ${count ?? 0} records (matched: ${matched ?? "n/a"})`,
        );
      })
      .catch(() => setSummary("USGS request failed: network error"));
  }, []);

  return <p className="text-sm text-slate-700">{summary}</p>;
}
