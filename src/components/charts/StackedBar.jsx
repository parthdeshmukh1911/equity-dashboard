/**
 * StackedBar — Recharts stacked bar chart showing portfolio composition
 * broken down by asset type: Stocks, ETFs, and Mutual Funds.
 *
 * Props:
 *   data    {{ label: string, stocks: number, etfs: number, mf: number }[]}
 *           Each entry represents one bar group (e.g. a time period or category).
 *   loading {boolean}  When true, renders a Skeleton placeholder instead of the chart.
 *
 * Color scheme (matches design system):
 *   Stocks  — #10B981 (emerald)
 *   ETFs    — #3B82F6 (blue)
 *   MF      — #F59E0B (amber)
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import Skeleton from '../ui/Skeleton';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = {
  stocks: '#10B981',
  etfs:   '#3B82F6',
  mf:     '#F59E0B',
};

const LABELS = {
  stocks: 'Stocks',
  etfs:   'ETFs',
  mf:     'Mutual Funds',
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      role="tooltip"
      className="rounded-xl px-3 py-2 text-sm shadow-lg"
      style={{
        background: 'rgba(15, 23, 42, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        minWidth: 140,
      }}
    >
      {label && (
        <p
          className="mb-1 text-xs font-semibold uppercase tracking-wide"
          style={{ color: '#94A3B8' }}
        >
          {label}
        </p>
      )}
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: '#CBD5E1' }}>
            <span
              className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
              style={{ background: entry.fill }}
              aria-hidden="true"
            />
            {LABELS[entry.dataKey] ?? entry.name}
          </span>
          <span className="text-xs font-semibold" style={{ color: '#F8FAFC' }}>
            {entry.value != null ? `${Number(entry.value).toFixed(1)}%` : '—'}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Custom Legend ────────────────────────────────────────────────────────────

function CustomLegend() {
  return (
    <div className="mt-3 flex justify-center gap-4" aria-label="Chart legend">
      {Object.entries(LABELS).map(([key, name]) => (
        <div key={key} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-sm"
            style={{ background: COLORS[key] }}
            aria-hidden="true"
          />
          <span className="text-xs" style={{ color: '#94A3B8' }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton Loading State ───────────────────────────────────────────────────

function StackedBarSkeleton() {
  return (
    <div aria-label="Loading chart…" aria-busy="true" className="w-full">
      {/* Chart area */}
      <Skeleton width="100%" height={200} rounded="lg" />
      {/* Legend row */}
      <div className="mt-3 flex justify-center gap-4">
        <Skeleton width={70} height={12} rounded="full" />
        <Skeleton width={50} height={12} rounded="full" />
        <Skeleton width={90} height={12} rounded="full" />
      </div>
    </div>
  );
}

// ─── StackedBar Component ─────────────────────────────────────────────────────

export default function StackedBar({ data = [], loading = false }) {
  if (loading) {
    return <StackedBarSkeleton />;
  }

  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center rounded-xl py-10"
        style={{ color: '#64748B' }}
        aria-label="No data available"
      >
        <p className="text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full" aria-label="Portfolio composition stacked bar chart">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          barCategoryGap="30%"
        >
          <XAxis
            dataKey="label"
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />

          {/* Stacked bars — order determines visual stacking (bottom → top) */}
          <Bar
            dataKey="stocks"
            name={LABELS.stocks}
            stackId="portfolio"
            fill={COLORS.stocks}
            radius={[0, 0, 0, 0]}
            aria-label="Stocks allocation"
          />
          <Bar
            dataKey="etfs"
            name={LABELS.etfs}
            stackId="portfolio"
            fill={COLORS.etfs}
            radius={[0, 0, 0, 0]}
            aria-label="ETFs allocation"
          />
          <Bar
            dataKey="mf"
            name={LABELS.mf}
            stackId="portfolio"
            fill={COLORS.mf}
            radius={[4, 4, 0, 0]}
            aria-label="Mutual Funds allocation"
          />
        </BarChart>
      </ResponsiveContainer>

      <CustomLegend />
    </div>
  );
}
