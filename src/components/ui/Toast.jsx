import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const AUTO_DISMISS_MS = 4000;

const TYPE_CONFIG = {
  error: {
    bg: 'bg-red-500/90 border-red-400/50',
    icon: AlertCircle,
    label: 'Error',
  },
  success: {
    bg: 'bg-emerald-500/90 border-emerald-400/50',
    icon: CheckCircle,
    label: 'Success',
  },
};

/**
 * Toast — fixed-position notification for error/success feedback.
 * Auto-dismisses after 4000ms. Calls `onDismiss` on auto or manual close;
 * the parent is responsible for unmounting the Toast.
 *
 * @param {Object}             props
 * @param {string}             props.message    - notification text
 * @param {'error'|'success'}  [props.type]     - visual type (default: 'error')
 * @param {Function}           props.onDismiss  - called when toast should close
 */
export default function Toast({ message, type = 'error', onDismiss }) {
  // Auto-dismiss after 4000ms; clean up timer on unmount to prevent leaks
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss?.();
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.error;
  const Icon = config.icon;

  return (
    <motion.div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={[
        'fixed bottom-6 right-4 z-50',
        'flex items-start gap-3',
        'max-w-xs w-full px-4 py-3',
        'rounded-xl shadow-lg border',
        'backdrop-blur-sm',
        'text-white',
        config.bg,
      ].join(' ')}
      // Animate in: slide up from below + fade in
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Animate out: fade out + slide back down
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Type icon */}
      <Icon
        size={20}
        className="mt-0.5 shrink-0"
        aria-hidden="true"
      />

      {/* Message */}
      <p className="flex-1 text-sm font-medium leading-snug">
        {message}
      </p>

      {/* Manual dismiss button */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className={[
          'shrink-0 rounded-md p-0.5',
          'hover:bg-white/20 active:bg-white/30',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-white/60',
        ].join(' ')}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </motion.div>
  );
}
