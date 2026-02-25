import Head from "next/head";
import type { GetServerSideProps } from "next";

interface USGSTimeSeries {
  name: string;
  siteName: string;
  variable?: { unit?: { unitCode?: string } };
  values: { value: { value: string; dateTime: string }[] }[];
}

interface Props {
  initialData: USGSTimeSeries[] | null;
  error: string | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/usgs/iv`);
    if (!res.ok) throw new Error(`USGS proxy error ${res.status}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json: any = await res.json();
    const timeSeries: USGSTimeSeries[] =
      json?.value?.timeSeries ?? [];
    return { props: { initialData: timeSeries, error: null } };
  } catch (err) {
    return {
      props: {
        initialData: null,
        error: err instanceof Error ? err.message : "Unknown error",
      },
    };
  }
};

export default function DataPage({ initialData, error }: Props) {
  const data = initialData;

  return (
    <>
      <Head>
        <title>Water Data · CNO Water Data Hub</title>
      </Head>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Live Stream &amp; Groundwater Data
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Real-time data proxied from the USGS National Water Information System for CNO territory gauging stations.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-4">
            Could not load USGS data: {error}
          </div>
        )}

        {data && data.length === 0 && (
          <p className="text-gray-500 text-sm">No data available at this time.</p>
        )}

        {data && data.length > 0 && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((ts, i) => {
              const valueArray = ts.values?.[0]?.value;
              const latestValue = valueArray?.[valueArray.length - 1];
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-blue-900 text-sm leading-snug mb-1">
                    {ts.siteName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">{ts.name}</p>
                  {latestValue ? (
                    <div className="text-2xl font-bold text-blue-700">
                      {latestValue.value}
                      <span className="text-xs font-normal text-gray-500 ml-1">
                        {ts.variable?.unit?.unitCode ?? ""}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No recent readings</p>
                  )}
                  {latestValue && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(latestValue.dateTime).toLocaleString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
