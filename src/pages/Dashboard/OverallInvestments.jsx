import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';

export default function OverallInvestments({ data, loading }) {
  if (loading || !data) {
    return (
      <section className="mb-6">
        <Skeleton width="100%" height={220} rounded="xl" />
      </section>
    );
  }

  const total = data.find((d) => d.assetClass === 'Total') || {};
  const others = data.filter((d) => d.assetClass !== 'Total');

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  const formatPct = (val) => `${(val || 0).toFixed(2)}%`;

  const isProfit = total.profit >= 0;

  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Overall Investments</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-5 shadow-lg backdrop-blur-md"
      >
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 text-sm font-medium">Current Value</span>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white tracking-tight">{formatCurrency(total.current)}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${isProfit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{formatCurrency(Math.abs(total.profit))} ({formatPct(total.returnPercentage)})</span>
            </div>
            <span className="text-slate-500 text-xs font-medium">All Time</span>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-700/50 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-medium mb-1">Total Invested</span>
            <span className="text-white font-medium text-lg">{formatCurrency(total.invested)}</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-5 space-y-3">
          {others.map((item) => {
            const itemIsProfit = item.profit >= 0;
            return (
              <div key={item.assetClass} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">{item.assetClass}</span>
                  <span className="text-slate-400 text-xs">{formatCurrency(item.invested)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-white text-sm font-medium">{formatCurrency(item.current)}</span>
                  <span className={`text-xs font-medium ${itemIsProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                    {itemIsProfit ? '+' : ''}{formatPct(item.returnPercentage)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
