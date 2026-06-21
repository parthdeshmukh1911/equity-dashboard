import { formatCurrency, formatPercent } from '../../utils/formatters';

/**
 * SummaryCard — glassmorphism card showing summary data for an asset type
 * (Stocks, ETFs, or Mutual Funds). Used in the Dashboard's horizontally
 * scrollable InvestmentCards row.
 *
 * @param {string}  assetType       — Display name: "Stocks", "ETFs", "Mutual Funds"
 * @param {number}  currentValue    — Current market value (₹)
 * @param {number}  investedValue   — Amount invested (₹)
 * @param {number}  returnValue     — Absolute return (₹): currentValue − investedValue
 * @param {number}  returnPct       — Return as percentage
 * @param {number}  weight          — Portfolio weight (%)
 */
export default function SummaryCard({
  assetType,
  currentValue,
  investedValue,
  returnValue,
  returnPct,
  weight,
}) {
  const isPositive = returnValue >= 0;
  const returnColor = isPositive ? '#22C55E' : '#EF4444';

  // Icon/accent colour per asset type
  const accentMap = {
    Stocks: '#6366F1',       // indigo
    ETFs: '#F59E0B',         // amber
    'Mutual Funds': '#06B6D4', // cyan
  };
  const accent = accentMap[assetType] ?? '#6366F1';

  const ariaLabel = `${assetType}: current value ${formatCurrency(currentValue)}, return ${formatPercent(returnPct)}`;

  return (
    <article
      className="flex-shrink-0 w-44 rounded-[24px] p-4 shadow-lg"
      style={{
        background: 'rgba(30, 41, 59, 0.6)',       // slate-dark at 60 % opacity
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
      aria-label={ariaLabel}
    >
      {/* Asset type header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-semibold tracking-wide uppercase"
          style={{ color: accent }}
        >
          {assetType}
        </span>
        {/* Portfolio weight badge */}
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#94A3B8',
          }}
        >
          {weight?.toFixed(1)}%
        </span>
      </div>

      {/* Current value — primary metric */}
      <p className="text-lg font-bold text-white leading-tight mb-1">
        {formatCurrency(currentValue)}
      </p>

      {/* Invested value */}
      <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>
        Invested: {formatCurrency(investedValue)}
      </p>

      {/* Divider */}
      <div
        className="mb-3"
        style={{ height: 1, background: 'rgba(255,255,255,0.06)' }}
      />

      {/* Return row */}
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-semibold"
          style={{ color: returnColor }}
        >
          {isPositive && returnValue !== 0 ? '+' : ''}
          {formatCurrency(returnValue)}
        </span>
        <span
          className="text-xs font-medium"
          style={{ color: returnColor }}
        >
          {formatPercent(returnPct)}
        </span>
      </div>
    </article>
  );
}
