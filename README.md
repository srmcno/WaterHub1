# CNO Water Data Hub (Phase 1 Foundation)

Initial production-oriented setup for a CNO Water Data Hub application using Next.js.

## Included in this PR

- Next.js application skeleton ready for Vercel deployment
- Leaflet interactive map rendering a CNO reservation boundary GeoJSON overlay
- USGS proxy API route using the new `api.waterdata.usgs.gov` OGC API endpoint
- Railway/Supabase-friendly PostgreSQL connection helper (`pg`)
- Skeleton ingestion job route for scheduled refresh + optional DB persistence

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## API routes

### `GET /api/usgs`
Proxy route for USGS OGC API collections.

Example:

```bash
curl "http://localhost:3000/api/usgs?collection=monitoring-locations&limit=25"
```

### `POST /api/jobs/usgs-refresh`
Skeleton ingestion endpoint for cron jobs (Railway/Supabase scheduled requests).

- If `CRON_SECRET` is set, send either:
  - `x-cron-secret: <CRON_SECRET>` header, or
  - `Authorization: Bearer <CRON_SECRET>` header
- Persists run metadata to PostgreSQL when `DATABASE_URL` is configured.

## Deploy notes

- **Frontend:** Vercel (native Next.js deployment)
- **Backend/API:** Same Next.js project routes, deployable on Vercel or Railway
- **Database:** PostgreSQL/PostGIS (Railway or Supabase)
- **Scheduled refresh:** Call `POST /api/jobs/usgs-refresh` on a schedule
- Optional local TLS override: set `PGSSL_ALLOW_SELF_SIGNED=true` only for self-signed cert environments
