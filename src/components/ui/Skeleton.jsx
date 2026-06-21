/**
 * Skeleton — animated shimmer placeholder for loading states.
 *
 * Props:
 *   width   {string|number}  CSS width  (e.g. '100%', 200, '12rem'). Default '100%'.
 *   height  {string|number}  CSS height (e.g. 16, '1rem', '2.5rem'). Default 16.
 *   rounded {string}         Border-radius variant:
 *                              'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 *                              | 'full' | 'card'   Default 'md'.
 */

const ROUNDED_MAP = {
  none: 'rounded-none',
  sm:   'rounded-sm',
  md:   'rounded-md',
  lg:   'rounded-lg',
  xl:   'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
  card: 'rounded-card',   // 24px — custom token from tailwind.config.js
};

/**
 * Normalise a width/height value to a valid CSS string.
 * Plain numbers are treated as pixels.
 */
function toCss(value) {
  if (value === undefined || value === null) return undefined;
  return typeof value === 'number' ? `${value}px` : String(value);
}

export default function Skeleton({ width = '100%', height = 16, rounded = 'md' }) {
  const roundedClass = ROUNDED_MAP[rounded] ?? ROUNDED_MAP.md;

  const style = {
    width:  toCss(width),
    height: toCss(height),
  };

  return (
    <div
      role="status"
      aria-label="Loading…"
      aria-busy="true"
      className={`animate-pulse bg-slate-700/50 ${roundedClass}`}
      style={style}
    />
  );
}
