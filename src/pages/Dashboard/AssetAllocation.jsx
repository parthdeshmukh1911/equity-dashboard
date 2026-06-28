import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';
import { usePrivacy } from '../../context/PrivacyContext';

export default function AssetAllocation({ data, loading }) {
  const { isPrivacyMode } = usePrivacy();

  if (loading || !data) {
    return (
      <section className="mb-6">
        <Skeleton width="100%" height={160} rounded="xl" />
      </section>
    );
  }

  // Find the total row and individual items
  const totalItem = data.find((d) => d.asset === 'Total');
  const filteredData = data.filter((d) => d.asset !== 'Total' && d.allocation > 0);
  
  const totalAllocation = totalItem ? totalItem.allocation : filteredData.reduce((acc, curr) => acc + curr.allocation, 0);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Layers size={16} className="text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Asset Allocation</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-5 shadow-lg backdrop-blur-md space-y-5"
      >
        {filteredData.map((item, i) => {
          const percentage = totalAllocation > 0 ? (item.allocation / totalAllocation) * 100 : 0;
          const barColor = item.asset === 'Equity' ? 'bg-blue-500' : 'bg-green-500';

          return (
            <div key={item.asset} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-slate-200">{item.asset}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {isPrivacyMode ? '₹***' : formatCurrency(item.allocation)}
                  </span>
                  <span className="text-sm font-bold text-white w-12 text-right">{percentage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={`${barColor} h-2.5 rounded-full`}
                />
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
