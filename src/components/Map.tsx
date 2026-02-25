import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import type { FeatureCollection } from "geojson";

// Fix Leaflet default icon paths in Next.js
const fixLeafletIcons = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

// CNO reservation approximate center (southeastern Oklahoma)
const CNO_CENTER: [number, number] = [34.5, -95.5];
const INITIAL_ZOOM = 7;

const boundaryStyle = {
  color: "#1d4ed8",
  weight: 2,
  opacity: 0.85,
  fillColor: "#3b82f6",
  fillOpacity: 0.12,
};

export default function WaterMap() {
  const [boundary, setBoundary] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fixLeafletIcons();
    fetch("/geojson/cno-boundary.geojson")
      .then((res) => res.json())
      .then((data: FeatureCollection) => setBoundary(data))
      .catch((err) => console.error("Failed to load CNO boundary:", err));
  }, []);

  return (
    <MapContainer
      center={CNO_CENTER}
      zoom={INITIAL_ZOOM}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      {boundary && (
        <GeoJSON
          key="cno-boundary"
          data={boundary}
          style={boundaryStyle}
        />
      )}
      <Marker position={CNO_CENTER}>
        <Popup>
          <strong>CNO Territory</strong>
          <br />
          Choctaw Nation of Oklahoma
        </Popup>
      </Marker>
    </MapContainer>
  );
}
