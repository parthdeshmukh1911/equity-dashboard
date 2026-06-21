import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import TabBar from '../../components/navigation/TabBar';
import HoldingsList from './HoldingsList';
import DetailScreen from './DetailScreen';
import { usePortfolio } from '../../context/PortfolioContext';
import PrivacyToggle from '../../components/ui/PrivacyToggle';
import { SlidersHorizontal, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import RefreshButton from '../../components/ui/RefreshButton';
import usePageScrollRestoration from '../../hooks/usePageScrollRestoration';

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
  const scrollRef = usePageScrollRestoration('portfolio');
  const [activeTab, setActiveTab] = useState(TAB_LABELS[0]);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [sortBy, setSortBy] = useState('value_desc'); // value_desc, return_desc, name_asc
  const [filterBy, setFilterBy] = useState('all'); // all, profit, loss

  // Pull context state and all fetch functions from the portfolio context
  const { state, fetchStocks, fetchEtfs, fetchMutualFunds, refreshAll } = usePortfolio();

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

  let holdings = activeSlice?.data  ?? null;
  const loading  = activeSlice?.loading ?? false;
  const error    = activeSlice?.error  ?? null;

  // Apply Sort and Filter logic
  if (holdings && Array.isArray(holdings)) {
    // 1. Filter
    if (filterBy === 'profit') {
      holdings = holdings.filter(h => (h.pnl || h.returnPct) >= 0);
    } else if (filterBy === 'loss') {
      holdings = holdings.filter(h => (h.pnl || h.returnPct) < 0);
    }

    // 2. Sort
    holdings = [...holdings].sort((a, b) => {
      const aVal = a.currentValue || 0;
      const bVal = b.currentValue || 0;
      const aRet = a.pnl || a.returnPct || 0;
      const bRet = b.pnl || b.returnPct || 0;
      const aName = a.name || '';
      const bName = b.name || '';

      if (sortBy === 'value_desc') return bVal - aVal;
      if (sortBy === 'return_desc') return bRet - aRet;
      if (sortBy === 'name_asc') return aName.localeCompare(bName);
      return 0;
    });
  }

  // Retry handler — re-fetch the active tab's endpoint
  function handleRetry() {
    if (activeConfig) {
      fetchFns[activeConfig.fetchKey]();
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <motion.main
      ref={scrollRef}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-24"
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <div className="flex items-center gap-2">
            <RefreshButton onRefresh={refreshAll} />
            <PrivacyToggle />
          </div>
        </div>

        {/* TabBar — Requirement 4.1 */}
        <TabBar
          tabs={TAB_LABELS}
          activeTab={activeTab}
          onChange={handleTabChange}
        />

        <div className="flex items-center justify-end mt-4">
          <button
            onClick={() => setShowSortFilter(!showSortFilter)}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-full hover:bg-slate-800 transition-colors"
          >
            <SlidersHorizontal size={14} />
            Sort & Filter
          </button>
        </div>

        {/* Expandable Sort/Filter Panel */}
        {showSortFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 bg-slate-800/80 border border-slate-700 p-4 rounded-2xl"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-white">View Options</h3>
              <button onClick={() => setShowSortFilter(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">Sort By</label>
                <div className="flex gap-2 flex-wrap">
                  {['value_desc', 'return_desc', 'name_asc'].map(option => (
                    <button
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border ${sortBy === option ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-transparent border-slate-600 text-slate-300'}`}
                    >
                      {option === 'value_desc' ? 'Value' : option === 'return_desc' ? 'Return' : 'Name'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">Filter</label>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'profit', 'loss'].map(option => (
                    <button
                      key={option}
                      onClick={() => setFilterBy(option)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border ${filterBy === option ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-transparent border-slate-600 text-slate-300'}`}
                    >
                      {option === 'all' ? 'All' : option === 'profit' ? 'Profit' : 'Loss'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
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
