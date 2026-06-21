import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Button — branded button with primary/ghost variants, sm/md sizes,
 * loading spinner, disabled state, focus ring, and Framer Motion tap feedback.
 *
 * @param {Object}  props
 * @param {'primary'|'ghost'} props.variant   - visual style (default: 'primary')
 * @param {'sm'|'md'}         props.size      - size preset (default: 'md')
 * @param {boolean}           props.loading   - shows spinner and blocks interaction
 * @param {boolean}           props.disabled  - visual disabled state
 * @param {string}            [props['aria-label']] - accessible label override
 * @param {Function}          [props.onClick] - click handler
 * @param {React.ReactNode}   [props.children]
 * @param {string}            [props.className] - extra Tailwind classes
 * @param {'button'|'submit'|'reset'} [props.type] - button type (default: 'button')
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  'aria-label': ariaLabel,
  onClick,
  children,
  className = '',
  type = 'button',
  ...rest
}) => {
  const isDisabled = disabled || loading;

  // ── Variant styles ──────────────────────────────────────────────────────────
  const variantClasses = {
    primary:
      'bg-emerald text-navy font-semibold border border-transparent ' +
      'hover:brightness-110 active:brightness-95',
    ghost:
      'bg-transparent text-emerald font-semibold border border-emerald ' +
      'hover:bg-emerald/10 active:bg-emerald/20',
  };

  // ── Size styles ─────────────────────────────────────────────────────────────
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-5 text-base',
  };

  // ── Shared base styles ──────────────────────────────────────────────────────
  const baseClasses = [
    'inline-flex items-center justify-center gap-2 rounded-xl',
    'transition-colors duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
    'focus-visible:ring-offset-navy',
    isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
  ].join(' ');

  const composedClassName = [
    baseClasses,
    variantClasses[variant] ?? variantClasses.primary,
    sizeClasses[size] ?? sizeClasses.md,
    className,
  ]
    .join(' ')
    .trim();

  return (
    <motion.button
      type={type}
      className={composedClassName}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      onClick={isDisabled ? undefined : onClick}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      {...rest}
    >
      {loading && (
        <Loader2
          className="animate-spin"
          size={size === 'sm' ? 14 : 16}
          aria-hidden="true"
        />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
