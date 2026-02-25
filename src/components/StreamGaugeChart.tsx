'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface TimeSeriesPoint {
  dateTime: string;
  value: number | null;
}

interface StreamGaugeChartProps {
  data: TimeSeriesPoint[];
  parameterName?: string;
  unit?: string;
  loading?: boolean;
}

export default function StreamGaugeChart({
  data,
  parameterName = 'Streamflow',
  unit = 'ft³/s',
  loading = false,
}: StreamGaugeChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Loading chart data...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    time: new Date(d.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: d.value,
  }));

  const values = data.map((d) => d.value).filter((v): v is number => v !== null);
  const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          {parameterName} <span className="text-gray-400 font-normal">({unit})</span>
        </h3>
        <span className="text-xs text-gray-500">
          Avg: {avg.toFixed(1)} {unit}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number) => [`${value.toLocaleString()} ${unit}`, parameterName]}
          />
          <ReferenceLine
            y={avg}
            stroke="#93c5fd"
            strokeDasharray="4 4"
            label={{ value: 'Avg', position: 'right', fontSize: 10, fill: '#93c5fd' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#1d4ed8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
