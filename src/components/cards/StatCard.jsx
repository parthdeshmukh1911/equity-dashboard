/**
 * StatCard — glassmorphism stat card used in the Dashboard QuickStats row.
 *
 * @param {string}          label     — Stat title (e.g. "Portfolio Return")
 * @param {string|number}   value     — Primary display value
 * @param {string|number}  [subValue] — Secondary/supplementary value (optional)
 * @param {React.Component} icon      — Lucide React icon component to render
 */
export default function StatCard({ label, value, subValue, icon: Icon }) {
  // Detect whether the primary value represents a positive/negative numeric context.
  // A value is considered positive if it starts with '+' or is a positive number string
  // without a leading '−'/'-'. Used to apply profit/loss accent colours.
  const valueStr = String(value ?? '');
  const isPositive = valueStr.startsWith('+') || (/^\d/.test(valueStr) && !valueStr.startsWith('-') && !valueStr.startsWith('−'));
  const isNegative = valueStr.startsWith('-') || valueStr.startsWith('−');

  // Only apply colour when the value is explicitly signed/numeric
  const hasSign = isPositive || isNegative;
  const valueColor = hasSign
    ? isNegative
      ? '#EF4444'   // loss
      : '#22C55E'   // profit
    : '#F8FAFC';    // off-white — neutral stat (count, score, name)

  return (
    <article
      className="flex flex-col gap-2 rounded-card p-4 shadow-lg min-w-0"
      style={{
        background: 'rgba(30, 41, 59, 0.6)',       // slate-dark @ 60% opacity
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
      aria-label={`${label}: ${valueStr}${subValue ? `, ${subValue}` : ''}`}
    >
      {/* Icon + label row */}
      <div className="flex items-center gap-2">
        {Icon && (
          <span
            className="flex-shrink-0 p-1.5 rounded-lg"
            style={{ background: 'rgba(255, 255, 255, 0.06)' }}
            aria-hidden="true"
          >
            <Icon size={14} color="#94A3B8" strokeWidth={2} />
          </span>
        )}
        <span
          className="text-xs font-medium uppercase tracking-wide truncate"
          style={{ color: '#94A3B8' }}
        >
          {label}
        </span>
      </div>

      {/* Primary value */}
      <p
        className="text-base font-bold leading-tight truncate"
        style={{ color: valueColor }}
      >
        {value}
      </p>

      {/* Sub-value (optional) */}
      {subValue !== undefined && subValue !== null && (
        <p
          className="text-xs font-medium truncate"
          style={{ color: '#64748B' }}
        >
          {subValue}
        </p>
      )}
    </article>
  );
}
