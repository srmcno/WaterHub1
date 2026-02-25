'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { StreamGauge } from '@/types';

interface MapProps {
  gauges: StreamGauge[];
  height?: string;
}

export default function Map({ gauges, height = '500px' }: MapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current) return;
    if (mapRef.current) return;

    import('leaflet').then((L) => {
      // Fix default marker icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current!).setView([34.5, -95.5], 7);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      fetch('/cno-boundary.geojson')
        .then((r) => r.json())
        .then((geojson) => {
          L.geoJSON(geojson, {
            style: {
              color: '#1a3a5c',
              weight: 2,
              fillColor: '#2563eb',
              fillOpacity: 0.08,
              dashArray: '5, 5',
            },
          }).addTo(map);
        })
        .catch(() => {/* boundary is optional */});
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapRef.current) return;

    import('leaflet').then((L) => {
      const map = mapRef.current;
      if (!map) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existing = (map as any)._gaugeLayer;
      if (existing) {
        existing.clearLayers();
      }

      const group = L.layerGroup();
      gauges.forEach((gauge) => {
        if (!gauge.lat || !gauge.lng) return;

        const marker = L.circleMarker([gauge.lat, gauge.lng], {
          radius: 8,
          fillColor: gauge.status === 'active' ? '#2563eb' : '#9ca3af',
          color: '#fff',
          weight: 2,
          fillOpacity: 0.9,
        });

        const valueText =
          gauge.latestValue !== null
            ? `${gauge.latestValue.toFixed(1)} ${gauge.unit}`
            : 'No data';
        const dateText = gauge.latestDateTime
          ? new Date(gauge.latestDateTime).toLocaleString()
          : 'N/A';

        marker.bindPopup(`
          <div style="min-width:180px">
            <strong style="color:#1a3a5c">${gauge.siteName}</strong><br/>
            <small>Site: ${gauge.siteNo}</small><br/>
            <hr style="margin:4px 0"/>
            <b>Latest:</b> ${valueText}<br/>
            <b>Time:</b> ${dateText}<br/>
            <b>Status:</b> <span style="color:${gauge.status === 'active' ? 'green' : 'gray'}">${gauge.status}</span>
          </div>
        `);

        group.addLayer(marker);
      });

      group.addTo(map);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map as any)._gaugeLayer = group;
    });
  }, [gauges]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}
      className="border border-gray-200 shadow-sm"
    />
  );
}
