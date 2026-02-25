"use client";

import { useEffect, useRef } from "react";

export default function WaterMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let destroyed = false;

    async function initializeMap() {
      if (!mapRef.current) {
        return;
      }

      const L = await import("leaflet");

      if (destroyed || !mapRef.current) {
        return;
      }

      const map = L.map(mapRef.current).setView([34.8, -95.5], 8);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      try {
        const response = await fetch("/data/cno-boundary.geojson");
        const boundary = await response.json();

        if (!destroyed) {
          L.geoJSON(boundary, {
            style: { color: "#0f766e", weight: 2, fillOpacity: 0.2 },
          }).addTo(map);
        }
      } catch {
        // no-op: keep base map visible when boundary load fails
      }

      return () => {
        map.remove();
      };
    }

    let cleanup: (() => void) | undefined;

    initializeMap().then((fn) => {
      cleanup = fn;
    });

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, []);

  return <div ref={mapRef} className="h-[460px] w-full rounded-md" />;
}
