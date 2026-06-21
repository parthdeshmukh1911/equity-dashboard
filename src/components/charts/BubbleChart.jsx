/**
 * BubbleChart — Recharts ScatterChart showing holdings as bubbles.
 *
 * Props:
 *   data    {{ name: string, x: number, y: number, z: number }[]}
 *           Each entry represents one holding where:
 *             x = return percentage (x-axis)
 *             y = current value in ₹ (y-axis)
 *             z = portfolio weight % (bubble size)
 *   loading {boolean}  When true, renders a Skeleton placeholder.
 *
 * Color scheme:
 *   Positive return (x >= 0) — #22C55E (profit green)
 *   Negative return (x  < 0) — #EF4444 (loss red)
 */

import { motion } from 'framer-motion';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import Skeleton from '../ui/Skeleton';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_PROFIT = '#22C55E';
const COLOR_LOSS   = '#EF4444';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function bubbleColor(x) {
  return x >= 0 ? COLOR_PROFIT : COLOR_LOSS;
}

function formatValue(v) {
  if (v == null) return '—';
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(2)} Cr`;
  if (v >= 1_00_000)    return `₹${(v / 1_00_000).toFixed(2)} L`;
  if (v >= 1_000)       return `₹${(v / 1_000).toFixed(2)} K`;
  return `₹${Number(v).toFixed(2)}`;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  // Recharts wraps each value in a payload entry; the raw data object is in payload[0].payload
  const d = payload[0]?.payload ?? {};
  const returnColor = (d.x ?? 0) >= 0 ? COLOR_PROFIT : COLOR_LOSS;

  return (
    <div
      role="tooltip"
      className="rounded-xl px-3 py-2.5 text-sm shadow-lg"
      style={{
        background: 'rgba(15, 23, 42, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        minWidth: 160,
      }}
    >
      {d.name && (
        <p
          className="mb-1.5 text-xs font-semibold uppercase tracking-wide truncate"
          style={{ color: '#E2E8F0' }}
        >
          {d.name}
        </p>
      )}

      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs" style={{ color: '#94A3B8' }}>Return</span>
          <span className="text-xs font-semibold" style={{ color: returnColor }}>
            {d.x != null ? `${Number(d.x).toFixed(2)}%` : '—'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-xs" style={{ color: '#94A3B8' }}>Value</span>
          <span className="text-xs font-semibold" style={{ color: '#F8FAFC' }}>
            {d.y != null ? formatValue(d.y) : '—'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-xs" style={{ color: '#94A3B8' }}>Weight</span>
          <span className="text-xs font-semibold" style={{ color: '#F8FAFC' }}>
            {d.z != null ? `${Number(d.z).toFixed(2)}%` : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Loading State ───────────────────────────────────────────────────

function BubbleChartSkeleton() {
  return (
    <div aria-label="Loading chart…" aria-busy="true" className="w-full">
      <Skeleton width="100%" height={350} rounded="lg" />
    </div>
  );
}

// ─── BubbleChart Component ────────────────────────────────────────────────────

export default function BubbleChart({ data = [], loading = false }) {
  if (loading) {
    return <BubbleChartSkeleton />;
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full"
      aria-label="Portfolio holdings bubble chart"
    >
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 16, right: 24, bottom: 32, left: 16 }}>
          <XAxis
            type="number"
            dataKey="x"
            name="Return"
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(148,163,184,0.2)' }}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            label={{
              value: 'Return (%)',
              position: 'insideBottom',
              offset: -16,
              fill: '#64748B',
              fontSize: 11,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Value"
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(148,163,184,0.2)' }}
            tickLine={false}
            tickFormatter={(v) => formatValue(v)}
            width={72}
            label={{
              value: 'Value (₹)',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              fill: '#64748B',
              fontSize: 11,
            }}
          />
          {/* Map z (portfolio weight) to bubble pixel area */}
          <ZAxis type="number" dataKey="z" range={[50, 500]} name="Weight" />

          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(148,163,184,0.3)' }} />

          {/* Vertical reference line at x=0 to separate profit/loss */}
          <ReferenceLine x={0} stroke="rgba(148,163,184,0.25)" strokeDasharray="4 4" />

          <Scatter name="Holdings" data={data} isAnimationActive>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={bubbleColor(entry.x)}
                fillOpacity={0.8}
                stroke={bubbleColor(entry.x)}
                strokeOpacity={0.4}
                strokeWidth={1}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
