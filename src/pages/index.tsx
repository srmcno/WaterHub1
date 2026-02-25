import Head from "next/head";
import dynamic from "next/dynamic";

const WaterMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>CNO Water Data Hub</title>
        <meta name="description" content="Choctaw Nation of Oklahoma Water Data Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex flex-col items-center justify-start min-h-screen">
        <section className="w-full px-4 py-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-1">
            Reservation Water Map
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Interactive map showing CNO boundary, USGS stream gauges, and groundwater monitoring sites.
          </p>
          <div className="w-full rounded-xl overflow-hidden shadow-lg border border-gray-200" style={{ height: "600px" }}>
            <WaterMap />
          </div>
        </section>
      </main>
    </>
  );
}
