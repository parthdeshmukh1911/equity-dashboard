import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

import OverallInvestments from './OverallInvestments';
import AssetAllocation from './AssetAllocation';
import OverallSectorAllocation from './OverallSectorAllocation';
import StocksAllocation from './StocksAllocation';
import Button from '../../components/ui/Button';
import PrivacyToggle from '../../components/ui/PrivacyToggle';

function ErrorBanner({ onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="sticky top-0 z-30 mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
      style={{
        background: 'rgba(239, 68, 68, 0.15)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <AlertCircle size={16} color="#EF4444" className="flex-shrink-0" />
        <p className="text-sm font-medium truncate text-red-300">
          Unable to load portfolio data
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRetry}
        className="flex-shrink-0 border-red-500/40 text-red-300 hover:bg-red-500/10"
      >
        <RefreshCw size={13} />
        Retry
      </Button>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { state, refreshAll } = usePortfolio();

  const { overallInvestments, assetAllocation, overallSectorAllocation, stocksAllocation } = state;

  const isLoading = overallInvestments.loading || assetAllocation.loading || overallSectorAllocation.loading || stocksAllocation.loading;
  const hasError = !!overallInvestments.error || !!assetAllocation.error || !!overallSectorAllocation.error || !!stocksAllocation.error;

  return (
    <main className="flex-1 overflow-y-auto px-4 pt-6 pb-28 bg-slate-900" id="dashboard-main">
      <div className="max-w-[428px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <PrivacyToggle />
        </div>
        <AnimatePresence>
          {hasError && <ErrorBanner key="error-banner" onRetry={refreshAll} />}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <OverallInvestments data={overallInvestments.data} loading={overallInvestments.loading} />
          <AssetAllocation data={assetAllocation.data} loading={assetAllocation.loading} />
          <OverallSectorAllocation data={overallSectorAllocation.data} loading={overallSectorAllocation.loading} />
          <StocksAllocation data={stocksAllocation.data} loading={stocksAllocation.loading} />
        </motion.div>
      </div>
    </main>
  );
}
