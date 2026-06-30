import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';

export default function OverallSectorAllocation({ data, loading }) {
  if (loading || !data) {
    return (
      <section className="mb-6">
        <Skeleton width="100%" height={200} rounded="xl" />
      </section>
    );
  }

  // Sort by allocation descending
  const sortedData = [...data].sort((a, b) => b.allocation - a.allocation);
  const topSectors = sortedData.slice(0, 5);

  // Calculate 'Others' if there are more than 5
  if (sortedData.length > 5) {
    const othersAllocation = sortedData.slice(5).reduce((sum, item) => sum + item.allocation, 0);
    const othersExposure = sortedData.slice(5).reduce((sum, item) => sum + item.exposure, 0);
    if (othersAllocation > 0) {
      topSectors.push({ sector: 'Others', allocation: othersAllocation, exposure: othersExposure });
    }
  }

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Layers size={16} className="text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Sector Allocation</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-5 shadow-lg backdrop-blur-md space-y-4"
      >
        {topSectors.map((item, i) => (
          <div key={item.sector} className="flex flex-col gap-1">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-slate-200">{item.sector}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{formatCurrency(item.exposure)}</span>
                <span className="text-sm font-bold text-white w-12 text-right">{item.allocation.toFixed(1)}%</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-700/50 rounded-full h-2 mt-1 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.allocation}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="bg-indigo-500 h-2 rounded-full"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
