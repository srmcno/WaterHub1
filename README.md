# CNO Water Data Hub

A real-time water resources monitoring platform for the **Choctaw Nation of Oklahoma (CNO)**. Built with Next.js 14 and powered by USGS & EPA data APIs.

## Features

- 🗺️ **Interactive Map** — Leaflet map showing CNO territory boundary and active USGS stream gauge locations
- 📊 **Stream Gauge Monitoring** — Real-time and historical streamflow data via USGS Water Services API
- 🔩 **Groundwater Tracking** — USGS groundwater level monitoring wells
- 🧪 **Water Quality** — EPA ECHO violations and water quality parameters
- 🚨 **Alerts & Notifications** — Flood, drought, and water quality alerts (dismissible, severity-coded)
- 📥 **CSV Export** — Export any data table to CSV
- 📈 **Time Series Charts** — Recharts-powered streamflow visualization

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Mapping | Leaflet + react-leaflet |
| Charts | Recharts |
| HTTP | Axios |
| Data | USGS Water Services, EPA ECHO |

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
git clone <repository-url>
cd WaterHub1
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard
│   ├── globals.css         # Global styles + Tailwind
│   └── api/
│       ├── usgs/route.ts   # USGS proxy API
│       └── epa/route.ts    # EPA ECHO proxy API
├── components/
│   ├── Map.tsx             # Leaflet map (client-only)
│   ├── DataTable.tsx       # Sortable, filterable table
│   ├── StreamGaugeChart.tsx # Recharts time series
│   └── AlertBanner.tsx     # Dismissible alerts
├── lib/
│   └── usgs.ts             # USGS API utilities
└── types/
    └── index.ts            # TypeScript interfaces
public/
└── cno-boundary.geojson    # CNO territory boundary
```

## API Routes

### `GET /api/usgs`

Proxies to USGS Water Services.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `type` | `iv` (instantaneous), `dv` (daily), `gw` (groundwater) | `iv` |
| `huc` | Hydrologic Unit Code | — |
| `sites` | Comma-separated USGS site numbers | — |
| `parameterCd` | Parameter code (e.g., `00060` = streamflow) | — |
| `startDT` / `endDT` | Date range (YYYY-MM-DD) | — |

### `GET /api/epa`

Proxies to EPA ECHO API.

| Parameter | Description |
|-----------|-------------|
| `endpoint` | `facilities`, `violations`, `effluent` |
| `state` | State code (e.g., `OK`) |

## Data Sources

- **USGS National Water Information System** — https://waterservices.usgs.gov
- **EPA ECHO (Enforcement and Compliance History Online)** — https://echo.epa.gov
- **OpenStreetMap** — Base map tiles

## Deployment

Deploy to Vercel (recommended):

```bash
npx vercel --prod
```

Or use any platform supporting Next.js (Netlify, AWS Amplify, Docker).

### Environment Variables

No API keys are required — all upstream APIs are public. For production, consider adding rate limiting via middleware.

---

*Data provided by USGS and EPA. This platform is for informational purposes.*
