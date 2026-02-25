import Head from "next/head";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About · CNO Water Data Hub</title>
      </Head>
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">About CNO Water Data Hub</h2>
        <div className="prose prose-blue text-gray-600">
          <p className="mb-4">
            The <strong>CNO Water Data Hub</strong> is a comprehensive water data platform developed for the
            Choctaw Nation of Oklahoma (CNO) Environmental Protection Service. It aggregates public federal
            and state water monitoring data for the CNO reservation territory in southeastern Oklahoma.
          </p>
          <p className="mb-4">
            <strong>Data Sources:</strong>
          </p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>USGS National Water Information System (NWIS) — stream gauges &amp; groundwater</li>
            <li>EPA Water Quality Portal</li>
            <li>Oklahoma Water Resources Board (OWRB)</li>
          </ul>
          <p className="mb-4">
            <strong>Technology Stack:</strong>
          </p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Next.js 14 (React) — frontend &amp; API routes</li>
            <li>Leaflet / React-Leaflet — interactive mapping</li>
            <li>USGS Water Services API — real-time data</li>
            <li>PostgreSQL + PostGIS — spatial data cache (Railway/Supabase)</li>
            <li>Vercel — deployment</li>
          </ul>
        </div>
      </section>
    </>
  );
}
