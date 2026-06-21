/**
 * ProfitPie — Recharts pie chart showing the distribution of holdings
 * across profit/loss buckets (e.g. "Large Gain", "Small Gain", "Small Loss", "Large Loss").
 *
 * Props:
 *   data    {{ name: string, value: number }[]}
 *           Each entry is a bucket. `name` is the label, `value` is the count/weight.
 *   loading {boolean}  When true, renders a Skeleton placeholder.
 */

import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Skeleton from '../ui/Skeleton';

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Gradient palette from profit (#22C55E) → loss (#EF4444).
 * Sized to cover up to 6 buckets; extra slices fall back to the last color.
 */
const COLORS = [
  '#22C55E', // large gain  — profit green
  '#86EFAC', // small gain  — light green
  '#10B981', // break-even  — accent emerald
  '#FCA5A5', // small loss  — light red
  '#EF4444', // large loss  — loss red
  '#B91C1C', // extreme loss — deep red
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value, payload: inner } = payload[0];

  return (
    <div
      role="tooltip"
      className="rounded-xl px-3 py-2 text-sm shadow-lg"
      style={{
        background: 'rgba(15, 23, 42, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        minWidth: 130,
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
          style={{ background: inner?.fill }}
          aria-hidden="true"
        />
        <span className="text-xs font-semibold" style={{ color: '#F8FAFC' }}>
          {name}
        </span>
      </div>
      <p className="text-xs" style={{ color: '#94A3B8' }}>
        Count:{' '}
        <span className="font-semibold" style={{ color: '#F8FAFC' }}>
          {value}
        </span>
      </p>
    </div>
  );
}

// ─── Custom Legend ────────────────────────────────────────────────────────────

function CustomLegend({ payload }) {
  if (!payload || !payload.length) return null;

  return (
    <div
      className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5"
      aria-label="Chart legend"
    >
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-sm"
            style={{ background: entry.color }}
            aria-hidden="true"
          />
          <span className="text-xs" style={{ color: '#94A3B8' }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton Loading State ───────────────────────────────────────────────────

function ProfitPieSkeleton() {
  return (
    <div aria-label="Loading chart…" aria-busy="true" className="w-full">
      {/* Circular chart placeholder */}
      <div className="flex justify-center">
        <Skeleton width={200} height={200} rounded="full" />
      </div>
      {/* Legend row */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Skeleton width={72} height={12} rounded="full" />
        <Skeleton width={60} height={12} rounded="full" />
        <Skeleton width={68} height={12} rounded="full" />
        <Skeleton width={64} height={12} rounded="full" />
      </div>
    </div>
  );
}

// ─── ProfitPie Component ──────────────────────────────────────────────────────

export default function ProfitPie({ data = [], loading = false }) {
  if (loading) {
    return <ProfitPieSkeleton />;
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
      className="w-full"
      aria-label="Profit/loss distribution pie chart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            isAnimationActive
            animationBegin={0}
            animationDuration={600}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
