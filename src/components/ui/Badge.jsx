const COLOR_MAP = {
  emerald: 'bg-emerald-500/20 text-emerald-400',
  blue:    'bg-blue-500/20 text-blue-400',
  purple:  'bg-purple-500/20 text-purple-400',
  orange:  'bg-orange-500/20 text-orange-400',
  red:     'bg-red-500/20 text-red-400',
  yellow:  'bg-yellow-500/20 text-yellow-400',
  gray:    'bg-gray-500/20 text-gray-400',
  teal:    'bg-teal-500/20 text-teal-400',
  pink:    'bg-pink-500/20 text-pink-400',
};

/**
 * Pill-shaped badge for sector and category labels on HoldingCard.
 *
 * @param {{ color?: string, label: string, className?: string }} props
 */
export default function Badge({ color = 'gray', label, className = '' }) {
  const colorClasses = COLOR_MAP[color] ?? COLOR_MAP.gray;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
}
