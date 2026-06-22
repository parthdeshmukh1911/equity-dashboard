import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import TabBar from '../../components/navigation/TabBar';
import HoldingsList from './HoldingsList';
import DetailScreen from './DetailScreen';
import { usePortfolio } from '../../context/PortfolioContext';
import PrivacyToggle from '../../components/ui/PrivacyToggle';
import {
  ArrowDownAZ,
  ArrowUpDown,
  Banknote,
  ListFilter,
  Scale,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
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

const SORT_OPTIONS = [
  { value: 'currentValue', label: 'Current Value', icon: Banknote },
  { value: 'investedValue', label: 'Invested Value', icon: Scale },
  { value: 'return', label: 'Returns', icon: TrendingUp },
  { value: 'weight', label: 'Weight', icon: ArrowUpDown },
  { value: 'name', label: 'Name', icon: ArrowDownAZ },
];

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
  const [sortBy, setSortBy] = useState('currentValue');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterBy, setFilterBy] = useState('all'); // all, profit, loss
  const swipeStart = useRef(null);

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

  function handleTouchStart(event) {
    const touch = event.touches[0];
    swipeStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    const horizontalDistance = touch.clientX - start.x;
    const verticalDistance = touch.clientY - start.y;

    // Only handle deliberate horizontal swipes so normal vertical scrolling
    // remains untouched.
    if (Math.abs(horizontalDistance) < 56 || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) {
      return;
    }

    const currentIndex = TAB_LABELS.indexOf(activeTab);
    const nextIndex = horizontalDistance < 0
      ? Math.min(currentIndex + 1, TAB_LABELS.length - 1)
      : Math.max(currentIndex - 1, 0);

    if (nextIndex !== currentIndex) handleTabChange(TAB_LABELS[nextIndex]);
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
      holdings = holdings.filter(h => (h.pnl ?? h.returnPct ?? 0) >= 0);
    } else if (filterBy === 'loss') {
      holdings = holdings.filter(h => (h.pnl ?? h.returnPct ?? 0) < 0);
    }

    // 2. Sort
    holdings = [...holdings].sort((a, b) => {
      let comparison;

      if (sortBy === 'name') {
        comparison = (a.name ?? '').localeCompare(b.name ?? '');
      } else if (sortBy === 'return') {
        comparison = (a.pnl ?? a.returnPct ?? 0) - (b.pnl ?? b.returnPct ?? 0);
      } else if (sortBy === 'investedValue') {
        comparison = (a.investedValue ?? a.invested ?? 0) - (b.investedValue ?? b.invested ?? 0);
      } else if (sortBy === 'weight') {
        comparison = (a.portfolioWeight ?? a.weightage ?? 0) - (b.portfolioWeight ?? b.weightage ?? 0);
      } else {
        comparison = (a.currentValue ?? 0) - (b.currentValue ?? 0);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => { swipeStart.current = null; }}
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

        <p className="mt-2 px-1 text-xs text-slate-500">
          Swipe left or right to switch asset types
        </p>

        <div className="flex items-center justify-end mt-4">
          <button
            onClick={() => setShowSortFilter(!showSortFilter)}
            aria-expanded={showSortFilter}
            aria-controls="asset-view-controls"
            className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/70 px-3 py-2 text-sm font-medium text-slate-200 shadow-sm transition-colors hover:border-emerald-500/50 hover:bg-slate-800"
          >
            <SlidersHorizontal size={14} />
            View controls
          </button>
        </div>

        {/* Expandable Sort/Filter Panel */}
        {showSortFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            id="asset-view-controls"
            className="mt-3 rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-800 to-slate-900 p-4 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                  <ListFilter size={16} aria-hidden="true" />
                </span>
                <h3 className="text-sm font-semibold text-white">View controls</h3>
              </div>
              <button
                type="button"
                aria-label="Close view controls"
                onClick={() => setShowSortFilter(false)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Sort by</p>
                <div className="grid grid-cols-2 gap-2">
                  {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setSortBy(value)}
                      aria-pressed={sortBy === value}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors ${sortBy === value ? 'border-emerald-400/70 bg-emerald-400/10 text-emerald-300' : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'}`}
                    >
                      <Icon size={15} aria-hidden="true" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Order</p>
                <div className="grid grid-cols-2 rounded-xl border border-slate-700 bg-slate-900/50 p-1">
                  {['desc', 'asc'].map(direction => {
                    const isDescending = direction === 'desc';
                    const label = sortBy === 'name'
                      ? (isDescending ? 'Z → A' : 'A → Z')
                      : (isDescending ? 'High → Low' : 'Low → High');

                    return (
                      <button
                        key={direction}
                        onClick={() => setSortDirection(direction)}
                        aria-pressed={sortDirection === direction}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${sortDirection === direction ? 'bg-emerald-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Filter returns</p>
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'profit', label: 'Profit', icon: TrendingUp },
                    { value: 'loss', label: 'Loss', icon: TrendingDown },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setFilterBy(value)}
                      aria-pressed={filterBy === value}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${filterBy === value ? 'border-emerald-400/70 bg-emerald-400/10 text-emerald-300' : 'border-slate-700 text-slate-300 hover:border-slate-600'}`}
                    >
                      {Icon && <Icon size={14} aria-hidden="true" />}
                      {label}
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
