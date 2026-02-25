'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    name: string;
    description: string;
    area_sq_miles?: number;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export default function MapComponent() {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the GeoJSON boundary data
    fetch('/data/cno-boundary.geojson')
      .then((res) => res.json())
      .then((data) => setGeoJsonData(data))
      .catch((err) => {
        console.error('Error loading GeoJSON:', err);
        setError('Failed to load boundary data');
      });
  }, []);

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <MapContainer
      center={[34.5, -95.5]}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          style={{
            fillColor: '#0066cc',
            fillOpacity: 0.15,
            color: '#0044aa',
            weight: 2,
          }}
          onEachFeature={(feature, layer) => {
            const props = feature.properties;
            const popupContent = `
              <div class="p-2">
                <h3 class="font-bold">${props.name}</h3>
                <p class="text-sm">${props.description}</p>
                ${props.area_sq_miles ? `<p class="text-xs text-gray-600">${props.area_sq_miles} sq miles</p>` : ''}
              </div>
            `;
            layer.bindPopup(popupContent);
            layer.bindTooltip(props.name);
          }}
        />
      )}
    </MapContainer>
  );
}
