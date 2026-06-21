/**
 * SectorBars — Framer Motion animated horizontal progress bars
 * showing sector allocation percentages.
 *
 * Props:
 *   data    {{ sector: string, pct: number }[]}
 *   loading {boolean}  When true, renders Skeleton placeholders.
 *
 * Requirements: 3.5, 6.2
 */

import { motion } from 'framer-motion';
import Skeleton from '../ui/Skeleton';

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ─── Bar Colors ───────────────────────────────────────────────────────────────

const BAR_COLORS = [
  '#10B981', // emerald (accent)
  '#3B82F6', // blue
  '#F59E0B', // amber
  '#8B5CF6', // violet
  '#EF4444', // red
  '#06B6D4', // cyan
  '#EC4899', // pink
  '#84CC16', // lime
];

// ─── Skeleton Loading State ───────────────────────────────────────────────────

function SectorBarsSkeleton() {
  return (
    <div aria-label="Loading sector allocation…" aria-busy="true" className="space-y-3 w-full">
      {[80, 65, 55, 45, 35].map((w, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton width={120} height={12} rounded="full" />
          <Skeleton width={`${w}%`} height={8} rounded="full" />
          <Skeleton width={35} height={12} rounded="full" />
        </div>
      ))}
    </div>
  );
}

// ─── SectorBars Component ─────────────────────────────────────────────────────

export default function SectorBars({ data = [], loading = false }) {
  if (loading) return <SectorBarsSkeleton />;

  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center rounded-xl py-10"
        style={{ color: '#64748B' }}
        aria-label="No sector data available"
      >
        <p className="text-sm">No data available</p>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full space-y-3"
      aria-label="Sector allocation bar chart"
      role="list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {data.map((item, index) => {
        const color = BAR_COLORS[index % BAR_COLORS.length];
        return (
          <motion.div
            key={item.sector}
            role="listitem"
            aria-label={`${item.sector}: ${item.pct.toFixed(1)}%`}
            variants={rowVariants}
            className="flex items-center gap-3"
          >
            {/* Sector label */}
            <span
              className="w-36 flex-shrink-0 truncate text-xs"
              style={{ color: '#CBD5E1' }}
              title={item.sector}
            >
              {item.sector}
            </span>

            {/* Bar track */}
            <div
              className="flex-1 overflow-hidden rounded-full"
              style={{ height: 8, background: 'rgba(255,255,255,0.08)' }}
              aria-hidden="true"
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${item.pct}%` }}
                transition={{ duration: 0.5, delay: index * 0.08 + 0.15, ease: 'easeOut' }}
              />
            </div>

            {/* Percentage label */}
            <span
              className="w-10 flex-shrink-0 text-right text-xs font-semibold"
              style={{ color: '#F8FAFC' }}
            >
              {item.pct.toFixed(1)}%
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
