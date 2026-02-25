'use client';

import { useState, useCallback } from 'react';

interface WaterValue {
  value: string | null;
  qualifiers: string[];
  dateTime: string;
  method?: {
    methodDescription: string;
  };
}

interface Site {
  siteName: string;
  siteCode: {
    value: string;
    network: string;
    agencyCode: string;
  };
  timeZoneInfo: {
    daylightSavingsTimeZone: {
      zoneOffset: string;
      zoneAbbreviation: string;
    };
    standardTimeZone: {
      zoneOffset: string;
      zoneAbbreviation: string;
    };
    siteUsesDaylightSavingsTime: boolean;
  };
  geoLocation: {
    geogLocation: {
      srs: string;
      pointX: number;
      pointY: number;
    };
    localSiteXY: unknown[];
  };
  note: unknown[];
  siteType: string[];
  siteProperty: Array<{
    value: string;
    name: string;
  }>;
}

interface Variable {
  variableCode: string;
  variableName: string;
  variableDescription: string;
  noDataValue: number;
  noDataValueNote: string;
  propertyOrCharacteristic: string;
  unit: {
    unitCode: string;
    unitDescription: string;
  };
  options: {
    option: Array<{
      name: string;
      optionCode: string;
    }>;
  };
  note: unknown[];
  variableProperty: Array<{
    value: string;
    name: string;
  }>;
}

interface TimeSeries {
  sourceInfo: Site;
  variable: Variable;
  values: Array<{
    value: WaterValue[];
    method: Array<{
      methodDescription: string;
      methodCode: string;
    }>;
    source: unknown[];
    offset: unknown[];
    sample: unknown[];
    censorCode: unknown[];
  }>;
  name: string;
}

interface USGSData {
  value: {
    timeSeries: TimeSeries[];
    queryInfo: {
      queryURL: string;
      criteria: {
        parameter: unknown[];
      };
      note: unknown[];
      totalTimeSeries: number;
    };
  };
}

const CNO_SITES = [
  '07334200', // Kiamichi River near Fort Towson
  '07335000', // Little River near Idabel
  '07336000', // Glover River near Glover
  '07337900', // Buffalo Creek near Rattan
];

// Skeleton loader component
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-200">
      <td className="p-3"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="p-3"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="p-3"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="p-3"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
    </tr>
  );
}

export default function DataPage() {
  const [data, setData] = useState<USGSData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const sitesParam = CNO_SITES.join(',');
      const response = await fetch(
        `/api/usgs?sites=${sitesParam}&parameterCd=00060,00065,72019&period=P7D`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const result: USGSData = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Water Data Explorer</h1>
          <p className="text-blue-700">
            Real-time and historical water data from USGS stations in the Choctaw Nation of Oklahoma territory
          </p>
        </header>

        {/* Stream Gauge Data Section */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Stream Gauge Data</h2>
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Fetch Data'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold">Error:</p>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold text-gray-700">Site Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Site Code</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Parameter</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Latest Value</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                )}

                {!loading && !data && (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-gray-500">
                      Click &quot;Fetch Data&quot; to load stream gauge data
                    </td>
                  </tr>
                )}

                {!loading && data && data.value.timeSeries && data.value.timeSeries.length > 0 ? (
                  data.value.timeSeries.map((series, idx) => {
                    const latestValue = series.values[0]?.value?.[0];
                    return (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 text-sm font-medium text-gray-800">
                          {series.sourceInfo.siteName}
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          {series.sourceInfo.siteCode.value}
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          {series.variable.variableName}
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          {latestValue?.value ? `${latestValue.value} ${series.variable.unit.unitCode}` : 'N/A'}
                        </td>
                      </tr>
                    );
                  })
                ) : !loading && data ? (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {data && (
            <div className="mt-4 text-xs text-gray-500">
              Total time series: {data.value.queryInfo.totalTimeSeries}
            </div>
          )}
        </section>

        {/* Information Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">About This Data</h3>
            <p className="text-gray-700 text-sm mb-4">
              This data is sourced from the United States Geological Survey (USGS) National Water Information System (NWIS).
              It provides real-time and historical measurements from stream gauges across the Choctaw Nation of Oklahoma territory.
            </p>
            <p className="text-gray-600 text-xs">
              Data refreshes every 5 minutes. For more information, visit the{' '}
              <a href="https://waterdata.usgs.gov/ok/" className="text-blue-600 hover:underline">
                USGS Oklahoma Water Data
              </a>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Monitoring Stations</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              {CNO_SITES.map((site) => (
                <li key={site} className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  {site}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
