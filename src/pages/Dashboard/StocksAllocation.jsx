import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';

export default function StocksAllocation({ data, loading }) {
  if (loading || !data) {
    return (
      <section className="mb-6">
        <Skeleton width="100%" height={300} rounded="xl" />
      </section>
    );
  }

  const topStocks = data.slice(0, 7); // Show top 7 stocks
  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <BarChart2 size={16} className="text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Top Stocks Allocation</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/80 border border-slate-700/50 rounded-2xl shadow-lg backdrop-blur-md overflow-hidden"
      >
        <div className="divide-y divide-slate-700/50">
          {topStocks.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-xs font-bold text-slate-300">
                  {i + 1}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">{item.name}</span>
                  <span className="text-xs text-slate-400">{formatCurrency(item.exposure)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-white">{item.allocation.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
