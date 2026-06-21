/**
 * DonutChart — Recharts PieChart with inner radius for asset allocation.
 *
 * Props:
 *   data    {{ name: string, value: number, color: string }[]}
 *   loading {boolean}  When true, renders a Skeleton placeholder.
 *
 * Requirements: 3.3, 6.1
 */

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Skeleton from '../ui/Skeleton';

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value, payload: { color } } = payload[0];
  return (
    <div
      role="tooltip"
      className="rounded-xl px-3 py-2 text-sm shadow-lg"
      style={{
        background: 'rgba(15, 23, 42, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
          style={{ background: color }}
          aria-hidden="true"
        />
        <span style={{ color: '#CBD5E1' }} className="text-xs">{name}</span>
        <span style={{ color: '#F8FAFC' }} className="text-xs font-semibold">
          {value != null ? `${Number(value).toFixed(1)}%` : '—'}
        </span>
      </div>
    </div>
  );
}

// ─── Custom Label ─────────────────────────────────────────────────────────────

function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, value }) {
  if (value < 5) return null; // skip tiny slices
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#F8FAFC"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${value.toFixed(0)}%`}
    </text>
  );
}

// ─── Custom Legend ────────────────────────────────────────────────────────────

function CustomLegend({ payload }) {
  if (!payload || !payload.length) return null;
  return (
    <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1" aria-label="Chart legend">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
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

function DonutChartSkeleton() {
  return (
    <div aria-label="Loading chart…" aria-busy="true" className="flex flex-col items-center gap-3">
      <Skeleton width={200} height={200} rounded="full" />
      <div className="flex gap-4">
        {[80, 60, 90, 50].map((w, i) => (
          <Skeleton key={i} width={w} height={12} rounded="full" />
        ))}
      </div>
    </div>
  );
}

// ─── DonutChart Component ─────────────────────────────────────────────────────

export default function DonutChart({ data = [], loading = false }) {
  if (loading) return <DonutChartSkeleton />;

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
    <div className="w-full" aria-label="Asset allocation donut chart">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderLabel}
            animationBegin={0}
            animationDuration={600}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                aria-label={`${entry.name}: ${entry.value}%`}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend rendered outside ResponsiveContainer so it is always in the DOM,
          even in test environments where ResizeObserver reports zero width. */}
      <CustomLegend
        payload={data.map((entry) => ({ value: entry.name, color: entry.color }))}
      />
    </div>
  );
}
