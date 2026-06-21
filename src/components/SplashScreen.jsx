import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

/**
 * SplashScreen — animated launch screen shown on first app load.
 *
 * Displays the app name and a TrendingUp icon animation for 1.5 seconds,
 * then animates out with a fade + scale exit before calling `onComplete`.
 *
 * @param {Object}   props
 * @param {Function} [props.onComplete] - called after the exit animation finishes
 */
const SplashScreen = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F172A]"
          role="status"
          aria-label="Loading Equity Dashboard"
        >
          {/* Icon with enter animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#10B981]/15"
            aria-hidden="true"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            >
              <TrendingUp
                size={44}
                strokeWidth={2}
                color="#10B981"
                aria-hidden="true"
              />
            </motion.div>
          </motion.div>

          {/* App name */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
            className="text-2xl font-semibold tracking-tight text-[#F8FAFC]"
          >
            Equity Dashboard
          </motion.h1>

          {/* Subtle tagline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.35 }}
            className="mt-2 text-sm text-[#94A3B8]"
          >
            Your portfolio, beautifully
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
