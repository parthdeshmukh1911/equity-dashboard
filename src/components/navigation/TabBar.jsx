import { motion } from 'framer-motion';

/**
 * TabBar — controlled tab switcher with animated underline indicator.
 *
 * Used inside PortfolioPage for Stocks / ETFs / Mutual Funds switching.
 *
 * Props:
 *   tabs      {string[]}  — ordered list of tab labels (e.g. ['Stocks', 'ETFs', 'Mutual Funds'])
 *   activeTab {string}    — currently active tab label (must be a member of `tabs`)
 *   onChange  {function}  — called with the selected tab label when the user taps a different tab
 *
 * _Requirements: 4.1, 4.2_
 */

const TabBar = ({ tabs = [], activeTab, onChange }) => {
  return (
    <nav aria-label="Asset type tabs">
      <ul
        role="tablist"
        className="flex items-end bg-[#1E293B] rounded-xl overflow-hidden"
      >
        {tabs.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <li key={tab} className="relative flex-1" role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={tab}
                onClick={() => !isActive && onChange(tab)}
                className={[
                  'relative w-full py-3 px-2 text-sm font-medium text-center',
                  'transition-colors duration-300 ease-out',
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-emerald focus-visible:ring-inset',
                  isActive
                    ? 'text-emerald'
                    : 'text-[#94A3B8] hover:text-[#CBD5E1]',
                ].join(' ')}
              >
                {tab}

                {/* Animated underline indicator — slides between tabs via shared layoutId */}
                {isActive && (
                  <motion.span
                    layoutId="tabBarIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald rounded-full"
                    initial={false}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TabBar;
