/**
 * Pill-shaped badge.
 *
 * @param {{ color?: string, label: string, className?: string }} props
 */
export default function Badge({
  color = "#64748B",
  label,
  className = ""
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
      style={{
        color,
        backgroundColor: `${color}20`,
        border: `1px solid ${color}40`
      }}
    >
      {label}
    </span>
  );
}