'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import AlertBanner from '@/components/AlertBanner';
import DataTable from '@/components/DataTable';
import StreamGaugeChart from '@/components/StreamGaugeChart';
import { StreamGauge, Alert } from '@/types';
import { parseUSGSResponse } from '@/lib/usgs';

// Dynamic import for Leaflet map (no SSR)
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// ---- Tab definitions ----
type Tab = 'overview' | 'stream' | 'groundwater' | 'quality' | 'alerts';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'stream', label: 'Stream Gauges' },
  { id: 'groundwater', label: 'Groundwater' },
  { id: 'quality', label: 'Water Quality' },
  { id: 'alerts', label: 'Alerts' },
];

// ---- Stat card ----
function StatCard({
  label,
  value,
  icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ---- Mock alerts ----
const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'flood',
    message: 'Kiamichi River at Antlers approaching flood stage (Action Stage: 14 ft, Current: 13.2 ft)',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    severity: 'warning',
    site: 'USGS 07335700',
  },
  {
    id: '2',
    type: 'violation',
    message: 'Monitoring violation detected at Atoka Public Water System - Turbidity exceedance',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    severity: 'critical',
    site: 'PWS OK3001001',
  },
  {
    id: '3',
    type: 'drought',
    message: 'Drought Monitor D1 conditions persist in southeastern Oklahoma counties',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    severity: 'info',
  },
];

// ---- Gauge table columns ----
const GAUGE_COLUMNS = [
  { key: 'siteNo', label: 'Site No.' },
  { key: 'siteName', label: 'Site Name' },
  {
    key: 'latestValue',
    label: 'Latest Value',
    render: (v: unknown, row: Record<string, unknown>) =>
      v !== null && v !== undefined
        ? `${(v as number).toFixed(2)} ${row.unit as string}`
        : '—',
  },
  {
    key: 'latestDateTime',
    label: 'Last Updated',
    render: (v: unknown) =>
      v ? new Date(v as string).toLocaleString() : '—',
  },
  {
    key: 'status',
    label: 'Status',
    render: (v: unknown) => (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          v === 'active'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        {String(v)}
      </span>
    ),
  },
];

// ---- Main Page ----
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [gauges, setGauges] = useState<StreamGauge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{ dateTime: string; value: number | null }[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  const fetchGauges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // HUC 1114 covers southeastern Oklahoma (CNO territory)
      const res = await fetch('/api/usgs?type=iv&huc=1114&parameterCd=00060&format=json');
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      const parsed = parseUSGSResponse(json);
      setGauges(parsed.filter((g) => g.lat && g.lng));
    } catch (err) {
      setError('Unable to load live gauge data. Showing cached/demo data.');
      // Provide demo data so the UI is still functional
      setGauges(DEMO_GAUGES);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChartData = useCallback(async (siteNo: string) => {
    setChartLoading(true);
    try {
      const end = new Date();
      const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const res = await fetch(
        `/api/usgs?type=dv&sites=${siteNo}&parameterCd=00060&startDT=${start.toISOString().slice(0, 10)}&endDT=${end.toISOString().slice(0, 10)}&format=json`
      );
      if (!res.ok) throw new Error('Chart data unavailable');
      const json = await res.json();
      const ts = json?.value?.timeSeries?.[0];
      const vals = ts?.values?.[0]?.value ?? [];
      setChartData(
        vals.map((v: { dateTime: string; value: string }) => ({
          dateTime: v.dateTime,
          value: parseFloat(v.value),
        }))
      );
    } catch {
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGauges();
  }, [fetchGauges]);

  useEffect(() => {
    if (gauges.length > 0 && activeTab === 'stream') {
      fetchChartData(gauges[0].siteNo);
    }
  }, [gauges, activeTab, fetchChartData]);

  function exportGaugesCSV() {
    const header = 'Site No,Site Name,Latest Value,Unit,Last Updated,Status\n';
    const rows = gauges
      .map(
        (g) =>
          `"${g.siteNo}","${g.siteName}",${g.latestValue ?? ''},${g.unit},"${g.latestDateTime ?? ''}",${g.status}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cno-gauges-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const activeCount = gauges.filter((g) => g.status === 'active').length;
  const criticalAlerts = MOCK_ALERTS.filter((a) => a.severity === 'critical').length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ---- Header ---- */}
      <header className="bg-[#1a3a5c] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-400 bg-opacity-30 flex items-center justify-center text-2xl">
            💧
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">CNO Water Data Hub</h1>
            <p className="text-blue-200 text-sm">
              Choctaw Nation of Oklahoma — Water Resources Monitoring Platform
            </p>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <div className="text-xs text-blue-300">Last Updated</div>
            <div className="text-sm font-medium">
              {new Date().toLocaleString('en-US', { timeZoneName: 'short' })}
            </div>
          </div>
        </div>

        {/* Tab nav */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-300 text-white'
                  : 'border-transparent text-blue-200 hover:text-white hover:border-blue-400'
              }`}
            >
              {tab.label}
              {tab.id === 'alerts' && MOCK_ALERTS.length > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {MOCK_ALERTS.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* ---- Main content ---- */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Alert banner */}
        {MOCK_ALERTS.filter((a) => a.severity === 'critical').length > 0 && (
          <div className="mb-4">
            <AlertBanner alerts={MOCK_ALERTS.filter((a) => a.severity === 'critical')} />
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800">
            ⚠️ {error}
          </div>
        )}

        {/* ============ OVERVIEW TAB ============ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Active Gauges"
                value={loading ? '…' : activeCount}
                icon="📊"
                color="bg-blue-100"
                sub="Stream monitoring stations"
              />
              <StatCard
                label="Water Systems"
                value="47"
                icon="🏗️"
                color="bg-teal-100"
                sub="Public water systems"
              />
              <StatCard
                label="Monitoring Wells"
                value="23"
                icon="🔩"
                color="bg-indigo-100"
                sub="Groundwater sites"
              />
              <StatCard
                label="Active Violations"
                value={criticalAlerts}
                icon="⚠️"
                color="bg-red-100"
                sub="Require attention"
              />
            </div>

            {/* Map */}
            <div>
              <h2 className="text-base font-semibold text-gray-700 mb-2">
                CNO Territory — Stream Gauge Locations
              </h2>
              <Map gauges={gauges} height="480px" />
              <p className="text-xs text-gray-400 mt-1">
                Blue circles indicate active USGS stream gauge stations within HUC 1114 (southeastern Oklahoma).
              </p>
            </div>

            {/* Recent Alerts */}
            <div>
              <h2 className="text-base font-semibold text-gray-700 mb-2">Recent Alerts</h2>
              <AlertBanner alerts={MOCK_ALERTS} />
            </div>

            {/* Quick gauge table */}
            <DataTable
              columns={GAUGE_COLUMNS as Parameters<typeof DataTable>[0]['columns']}
              data={gauges as unknown as Record<string, unknown>[]}
              loading={loading}
              title="Stream Gauges — Quick View"
              onExportCSV={exportGaugesCSV}
            />
          </div>
        )}

        {/* ============ STREAM GAUGES TAB ============ */}
        {activeTab === 'stream' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Stream Gauge Monitoring</h2>
              <button
                onClick={fetchGauges}
                disabled={loading}
                className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Refreshing…' : '↻ Refresh'}
              </button>
            </div>

            <Map gauges={gauges} height="400px" />

            {gauges.length > 0 && (
              <StreamGaugeChart
                data={chartData}
                parameterName="Streamflow"
                unit="ft³/s"
                loading={chartLoading}
              />
            )}

            <DataTable
              columns={GAUGE_COLUMNS as Parameters<typeof DataTable>[0]['columns']}
              data={gauges as unknown as Record<string, unknown>[]}
              loading={loading}
              title="All Stream Gauges"
              onExportCSV={exportGaugesCSV}
            />
          </div>
        )}

        {/* ============ GROUNDWATER TAB ============ */}
        {activeTab === 'groundwater' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Groundwater Monitoring</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              <div className="text-4xl mb-3">🔩</div>
              <p className="font-medium">Groundwater data integration coming soon</p>
              <p className="text-sm mt-1 text-gray-400">
                This section will display USGS groundwater level data from monitoring wells within CNO territory.
              </p>
            </div>
          </div>
        )}

        {/* ============ WATER QUALITY TAB ============ */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Water Quality Monitoring</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              <div className="text-4xl mb-3">🧪</div>
              <p className="font-medium">Water quality data integration coming soon</p>
              <p className="text-sm mt-1 text-gray-400">
                This section will display EPA ECHO water quality violations and USGS water quality parameters.
              </p>
            </div>
          </div>
        )}

        {/* ============ ALERTS TAB ============ */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">All Alerts & Notifications</h2>
            <AlertBanner alerts={MOCK_ALERTS} />
            {MOCK_ALERTS.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-medium">No active alerts</p>
                <p className="text-sm mt-1 text-gray-400">All water systems are operating normally.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ---- Footer ---- */}
      <footer className="bg-[#1a3a5c] text-blue-200 text-xs py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; {new Date().getFullYear()} Choctaw Nation of Oklahoma — Water Resources Division
          </div>
          <div className="flex gap-4">
            <span>Data: USGS Water Services</span>
            <span>•</span>
            <span>EPA ECHO</span>
            <span>•</span>
            <span>OpenStreetMap</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---- Demo gauges (fallback when API is unavailable) ----
const DEMO_GAUGES: StreamGauge[] = [
  {
    siteNo: '07335700',
    siteName: 'Kiamichi River at Antlers, OK',
    lat: 34.2348,
    lng: -95.6177,
    parameterCd: '00060',
    unit: 'ft³/s',
    latestValue: 342.5,
    latestDateTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    siteNo: '07336000',
    siteName: 'Kiamichi River near Talihina, OK',
    lat: 34.7529,
    lng: -95.0530,
    parameterCd: '00060',
    unit: 'ft³/s',
    latestValue: 128.0,
    latestDateTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    siteNo: '07332500',
    siteName: 'Blue River near Connerville, OK',
    lat: 34.4393,
    lng: -96.5497,
    parameterCd: '00060',
    unit: 'ft³/s',
    latestValue: 56.3,
    latestDateTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    siteNo: '07340300',
    siteName: 'Mountain Fork River near Eagletown, OK',
    lat: 34.0301,
    lng: -94.6025,
    parameterCd: '00060',
    unit: 'ft³/s',
    latestValue: 891.2,
    latestDateTime: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    siteNo: '07332000',
    siteName: 'Washita River at Pauls Valley, OK',
    lat: 34.7393,
    lng: -97.2197,
    parameterCd: '00060',
    unit: 'ft³/s',
    latestValue: 210.0,
    latestDateTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    siteNo: '07337900',
    siteName: 'Red River near Gainesville, TX',
    lat: 33.9265,
    lng: -97.1281,
    parameterCd: '00060',
    unit: 'ft³/s',
    latestValue: 1450.0,
    latestDateTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'active',
  },
];
