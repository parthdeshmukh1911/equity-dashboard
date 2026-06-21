import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import TabBar from '../../components/navigation/TabBar';
import HoldingsList from './HoldingsList';
import DetailScreen from './DetailScreen';
import { usePortfolio } from '../../context/PortfolioContext';

// ── Tab configuration ────────────────────────────────────────────────────────

/**
 * Maps each tab label to:
 *  - stateKey  : key inside PortfolioContext `state` for data/loading/error
 *  - fetchKey  : key of the fetch function exposed by usePortfolio()
 */
const TAB_CONFIG = [
  { label: 'Stocks',       stateKey: 'stocks',      fetchKey: 'fetchStocks'      },
  { label: 'ETFs',         stateKey: 'etfs',        fetchKey: 'fetchEtfs'        },
  { label: 'Mutual Funds', stateKey: 'mutualFunds', fetchKey: 'fetchMutualFunds' },
];

const TAB_LABELS = TAB_CONFIG.map((t) => t.label);

// ── Page entry animation ─────────────────────────────────────────────────────

const pageVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

// ── PortfolioPage ────────────────────────────────────────────────────────────

/**
 * PortfolioPage — three-tab view for Stocks, ETFs, and Mutual Funds.
 *
 * Behaviour:
 *  - Renders a controlled <TabBar> for switching between asset types.
 *  - On first visit to each tab, fetches data from the respective endpoint
 *    via usePortfolio(); subsequent tab visits reuse the cached slice.
 *  - Passes the active tab's loading/error/data state to <HoldingsList>.
 *  - Opens <DetailScreen> (slide-up modal) when a HoldingCard is tapped.
 *
 * Requirements: 4.1, 4.2, 4.6
 */
export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState(TAB_LABELS[0]);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Pull context state and all fetch functions from the portfolio context
  const { state, fetchStocks, fetchEtfs, fetchMutualFunds } = usePortfolio();

  // Map fetch keys to actual functions for easy lookup
  const fetchFns = { fetchStocks, fetchEtfs, fetchMutualFunds };

  /**
   * Fetch data for the given tab if it hasn't been loaded yet.
   * Avoids re-fetching on every tab revisit — data already in cache is kept.
   */
  const ensureTabData = useCallback(
    (tabLabel) => {
      const config = TAB_CONFIG.find((t) => t.label === tabLabel);
      if (!config) return;

      const slice = state[config.stateKey];

      // Only fetch if there is no data and no in-flight request
      if (!slice.data && !slice.loading) {
        fetchFns[config.fetchKey]();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, fetchStocks, fetchEtfs, fetchMutualFunds]
  );

  // Fetch data for the initial tab on mount
  useEffect(() => {
    ensureTabData(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run only once on mount

  // ── Tab change handler ─────────────────────────────────────────────────────

  function handleTabChange(tab) {
    setActiveTab(tab);
    ensureTabData(tab);
  }

  // ── Detail screen handlers ─────────────────────────────────────────────────

  function handleHoldingPress(holding) {
    setSelectedHolding(holding);
    setDetailOpen(true);
  }

  function handleDetailClose() {
    setDetailOpen(false);
    // Keep selectedHolding until the exit animation completes so the modal
    // content doesn't disappear mid-animation. Reset after a short delay.
    setTimeout(() => setSelectedHolding(null), 350);
  }

  // ── Derive active tab data from context state ──────────────────────────────

  const activeConfig = TAB_CONFIG.find((t) => t.label === activeTab);
  const activeSlice  = activeConfig ? state[activeConfig.stateKey] : null;

  const holdings = activeSlice?.data  ?? null;
  const loading  = activeSlice?.loading ?? false;
  const error    = activeSlice?.error  ?? null;

  // Retry handler — re-fetch the active tab's endpoint
  function handleRetry() {
    if (activeConfig) {
      fetchFns[activeConfig.fetchKey]();
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <motion.main
      className="flex flex-col min-h-screen pb-24"
      style={{
        background: '#0F172A',
        paddingTop: 'max(1.25rem, env(safe-area-inset-top))',
      }}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      aria-label="Portfolio page"
    >
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <header className="px-4 pb-4">
        <h1 className="text-2xl font-bold text-white mb-4">Portfolio</h1>

        {/* TabBar — Requirement 4.1 */}
        <TabBar
          tabs={TAB_LABELS}
          activeTab={activeTab}
          onChange={handleTabChange}
        />
      </header>

      {/* ── Holdings list ────────────────────────────────────────────────── */}
      <section className="flex-1 px-4 pt-4" aria-label={`${activeTab} holdings`}>
        {/*
         * Animate the list out / in when the tab changes so there's no
         * abrupt content swap (Requirement 4.2 — tab-switch animation).
         * The key prop forces a remount on tab change, triggering the
         * entry animation for the new tab's list.
         */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* HoldingsList — Requirements 4.2, 4.7, 4.8 */}
          <HoldingsList
            holdings={holdings}
            loading={loading}
            error={error}
            onRetry={handleRetry}
            onPress={handleHoldingPress}
          />
        </motion.div>
      </section>

      {/* ── Detail Screen modal overlay ──────────────────────────────────── */}
      {/* Requirements: 4.5, 5.1 – 5.4 */}
      <DetailScreen
        holding={selectedHolding}
        isOpen={detailOpen}
        onClose={handleDetailClose}
      />
    </motion.main>
  );
}
