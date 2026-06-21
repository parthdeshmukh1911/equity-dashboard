import { TrendingUp, Star, TrendingDown, Layers, BarChart2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import StatCard from '../../components/cards/StatCard';
import Skeleton from '../../components/ui/Skeleton';
import { formatPercent } from '../../utils/formatters';
import { calcDiversification } from '../../utils/diversification';

/**
 * Skeleton placeholder matching a StatCard's approximate dimensions.
 */
function StatCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-2 rounded-[24px] p-4 min-w-0"
      style={{
        background: 'rgba(30, 41, 59, 0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
      aria-hidden="true"
    >
      {/* Icon + label row */}
      <div className="flex items-center gap-2">
        <Skeleton width={28} height={28} rounded="lg" />
        <Skeleton width={80} height={10} rounded="md" />
      </div>
      {/* Primary value */}
      <Skeleton width={70} height={20} rounded="md" />
      {/* Sub value */}
      <Skeleton width={90} height={12} rounded="md" />
    </div>
  );
}

/**
 * Derive best and worst performers from a flat holdings array.
 *
 * @param {Array} holdings  — flat array of Holding objects
 * @returns {{ best: Holding|null, worst: Holding|null }}
 */
function getBestWorst(holdings) {
  if (!holdings || holdings.length === 0) {
    return { best: null, worst: null };
  }
  const sorted = [...holdings].sort((a, b) => (b.returnPct ?? 0) - (a.returnPct ?? 0));
  return {
    best: sorted[0],
    worst: sorted[sorted.length - 1],
  };
}

/**
 * QuickStats — Dashboard section showing five at-a-glance portfolio statistics.
 *
 * Stats displayed:
 *   1. Portfolio Return %
 *   2. Best Performer (name + return %)
 *   3. Worst Performer (name + return %)
 *   4. Total Holdings count
 *   5. Diversification Score (via calcDiversification)
 *
 * Self-contained: subscribes to PortfolioContext via usePortfolio().
 * Shows skeleton placeholders while dashboard data is loading.
 *
 * Requirements: 3.7
 */
export default function QuickStats() {
  const { state } = usePortfolio();
  const { dashboard, stocks, etfs, mutualFunds } = state;

  // ── Loading state ─────────────────────────────────────────────────────────
  // Show skeletons while the primary dashboard slice is loading.
  const isLoading = dashboard.loading && !dashboard.data;

  if (isLoading) {
    return (
      <section aria-label="Quick stats loading" aria-busy="true">
        <h2 className="text-base font-semibold text-white mb-3">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  // ── Derive data ───────────────────────────────────────────────────────────
  const overallInvestment = dashboard.data?.overallInvestment ?? {};
  const returnPct = overallInvestment.returnPct ?? 0;

  // Combine all holdings from the three slices for performer / count / diversification
  const allHoldings = [
    ...(stocks.data ?? []),
    ...(etfs.data ?? []),
    ...(mutualFunds.data ?? []),
  ];

  const { best, worst } = getBestWorst(allHoldings);
  const totalHoldings = allHoldings.length;
  const diversificationScore = calcDiversification(allHoldings);

  // ── Sign-prefix helper for percentages ────────────────────────────────────
  const fmtReturn = (pct) => {
    if (pct == null) return '—';
    // formatPercent already adds sign; use it directly
    return formatPercent(pct);
  };

  // ── Stat definitions ──────────────────────────────────────────────────────
  const stats = [
    {
      label: 'Portfolio Return',
      value: fmtReturn(returnPct),
      subValue: null,
      icon: TrendingUp,
    },
    {
      label: 'Best Performer',
      // Truncate long names to keep card compact
      value: best ? best.name : '—',
      subValue: best ? fmtReturn(best.returnPct) : null,
      icon: Star,
    },
    {
      label: 'Worst Performer',
      value: worst ? worst.name : '—',
      subValue: worst ? fmtReturn(worst.returnPct) : null,
      icon: TrendingDown,
    },
    {
      label: 'Total Holdings',
      // Plain number — StatCard will render it in off-white (neutral)
      value: totalHoldings > 0 ? String(totalHoldings) : '—',
      subValue: null,
      icon: Layers,
    },
    {
      label: 'Diversification',
      // Score is a plain number 0–100; no sign → neutral colour in StatCard
      value: allHoldings.length > 0 ? `${diversificationScore}/100` : '—',
      subValue: null,
      icon: BarChart2,
    },
  ];

  return (
    <section aria-label="Quick stats">
      <h2 className="text-base font-semibold text-white mb-3">Quick Stats</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, subValue, icon }) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            subValue={subValue}
            icon={icon}
          />
        ))}
      </div>
    </section>
  );
}
