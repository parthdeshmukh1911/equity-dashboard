/**
 * Treemap — Recharts Treemap where each rectangle is proportional
 * to the holding's portfolio weight.
 *
 * Props:
 *   data    {{ name: string, size: number, color: string }[]}
 *   loading {boolean}  When true, renders a Skeleton placeholder.
 *
 * Requirements: 6.3
 */

import { Treemap as RechartsTreemap, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import Skeleton from '../ui/Skeleton';

// ─── Custom Content Renderer ──────────────────────────────────────────────────

/**
 * Renders each treemap rectangle using the `color` field from the data item.
 * Recharts passes root and leaf nodes; we skip the root node (depth === 0).
 * We also skip rectangles that are too small to render meaningfully.
 */
function CustomContent({ x, y, width, height, name, value, depth, root, colors, ...rest }) {
  // Skip root node and overly small cells
  if (depth === 0 || width < 20 || height < 20) return null;

  // `colors` is a custom prop we inject via the data array workaround.
  // Recharts passes the data item's fields through content props directly.
  // We receive `color` from the data item via spread rest props.
  const fill = rest.color ?? '#3B82F6';

  const showName  = width > 45 && height > 25;
  const showValue = width > 60 && height > 45;

  const fontSize      = Math.min(12, Math.max(8, width / 8));
  const valueFontSize = Math.min(10, Math.max(7, width / 10));

  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        rx={6}
        ry={6}
        fill={fill}
        fillOpacity={0.85}
        stroke="rgba(15,23,42,0.5)"
        strokeWidth={1.5}
      />
      {showName && (
        <text
          x={x + width / 2}
          y={showValue ? y + height / 2 - 7 : y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#F8FAFC"
          fontSize={fontSize}
          fontWeight={600}
        >
          {name && name.length > 12 ? `${name.slice(0, 11)}…` : name}
        </text>
      )}
      {showValue && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(248,250,252,0.75)"
          fontSize={valueFontSize}
        >
          {value != null ? `${Number(value).toFixed(1)}%` : ''}
        </text>
      )}
    </g>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const { name, value, color } = payload[0]?.payload ?? payload[0] ?? {};

  return (
    <div
      role="tooltip"
      className="rounded-xl px-3 py-2 text-sm shadow-lg"
      style={{
        background: 'rgba(15, 23, 42, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        minWidth: 120,
      }}
    >
      <div className="flex items-center gap-2 mb-0.5">
        {color && (
          <span
            className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-sm"
            style={{ background: color }}
            aria-hidden="true"
          />
        )}
        <p style={{ color: '#CBD5E1' }} className="text-xs">
          {name}
        </p>
      </div>
      <p style={{ color: '#F8FAFC' }} className="text-xs font-semibold pl-4">
        {value != null ? `${Number(value).toFixed(1)}% weight` : '—'}
      </p>
    </div>
  );
}

// ─── Skeleton Loading State ───────────────────────────────────────────────────

function TreemapSkeleton() {
  return (
    <div aria-label="Loading treemap…" aria-busy="true" className="w-full">
      <Skeleton width="100%" height={300} rounded="lg" />
    </div>
  );
}

// ─── Treemap Component ────────────────────────────────────────────────────────

export default function Treemap({ data = [], loading = false }) {
  if (loading) return <TreemapSkeleton />;

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
      aria-label="Top holdings treemap chart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <RechartsTreemap
          data={data}
          dataKey="size"
          nameKey="name"
          aspectRatio={4 / 3}
          content={<CustomContent />}
          animationBegin={0}
          animationDuration={600}
        >
          <Tooltip content={<CustomTooltip />} />
        </RechartsTreemap>
      </ResponsiveContainer>
    </motion.div>
  );
}
