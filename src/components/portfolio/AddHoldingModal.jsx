import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import Modal from "../ui/Modal";

const ASSET_TYPES = {
  STOCK: "stocks",
  ETF: "etfs",
  MF: "mutualFunds"
};

const CONFIDENCE_OPTIONS = ["Very High", "High", "Medium", "Low"];

const SECTORS = [
  "Financial Services", "Technology", "Energy", "Consumer Cyclical",
  "Healthcare", "Housing Finance", "Communication Services", "Utilities",
  "Real Estate", "Consumer Defensive", "Industrials", "Renewable Energy",
  "Digital Advertising & Technology", "Basic Materials", "Alcoholic Beverages",
  "Travel & Visa Services", "Industrial Machinery", "Oil, Gas & Consumable Fuels",
  "Automobile and Auto Components", "Power Financing", "Capital Goods",
  "Fast Moving Consumer Goods", "Construction", "Telecommunication",
  "Metals & Mining", "Consumer Services", "Consumer Durables", "Power",
  "Services", "Chemicals", "Construction Materials", "Realty",
  "Media, Entertainment & Publication", "Textiles", "Diversified"
];

export default function AddHoldingModal({ isOpen, onClose }) {
  const [assetType, setAssetType] = useState(ASSET_TYPES.STOCK);
  const { addHolding } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [confidence, setConfidence] = useState("High");
  const [sector, setSector] = useState(SECTORS[0]);
  const [fundCode, setFundCode] = useState("");
  const [mfApiCode, setMfApiCode] = useState("");
  
  const qty = parseFloat(quantity);
  const avg = parseFloat(price);

  const isFormValid =
    assetType === ASSET_TYPES.STOCK
      ? symbol.trim() && name.trim() && qty > 0 && avg > 0 && sector
      : assetType === ASSET_TYPES.ETF
      ? symbol.trim() && name.trim() && qty > 0 && avg > 0
      : name.trim() && qty > 0 && avg > 0 && fundCode.trim() && mfApiCode.trim();

  useEffect(() => {
    if (!isOpen) {
      setAssetType(ASSET_TYPES.STOCK);
      setSymbol("");
      setName("");
      setQuantity("");
      setPrice("");
      setConfidence("High");
      setSector(SECTORS[0]);
      setFundCode("");
      setMfApiCode("");
    }
  }, [isOpen]);

  async function handleSave() {
    try {
      setLoading(true);
      const payload = {
        assetType,
        quantity: Number(quantity),
        price: Number(price),
        confidence
      };

      if (assetType === ASSET_TYPES.STOCK) {
        payload.symbol = symbol.trim();
        payload.name = name.trim();
        payload.sector = sector;
      } else if (assetType === ASSET_TYPES.ETF) {
        payload.symbol = symbol.trim();
        payload.name = name.trim();
      } else {
        payload.name = name.trim();
        payload.fundCode = fundCode.trim();
        payload.mfApiCode = mfApiCode.trim();
      }

      await addHolding(payload);
      onClose();
    } catch (err) {
      alert(err.message || "Unable to add holding.");
    } finally {
      setLoading(false);
    }
  }

  // Premium glassmorphic inputs with soft glows on focus
  const inputBaseClasses = "w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 focus:ring-4 focus:ring-white/5 transition-all duration-300 backdrop-blur-md";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative p-8 rounded-[2.5rem] bg-[#09090B]/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Soft background glow for layered depth */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-gradient-to-b from-white/10 to-transparent blur-3xl opacity-50 pointer-events-none" />

            <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50 mb-8 relative z-10">
              Add Asset
            </h2>

            {/* ── Highly Interactive Segmented Control ── */}
            <div className="relative flex w-full p-1.5 mb-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner">
              {[
                { id: ASSET_TYPES.STOCK, label: "Stock" },
                { id: ASSET_TYPES.ETF, label: "ETF" },
                { id: ASSET_TYPES.MF, label: "Mutual Fund" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAssetType(tab.id)}
                  className={`relative flex-1 py-3 text-sm font-semibold transition-colors duration-300 z-10 ${
                    assetType === tab.id ? "text-slate-900" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {assetType === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-20">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* ── Form Inputs (Staggered Entrance Animation) ── */}
            <motion.div 
              className="space-y-5 relative z-10"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
                hidden: {}
              }}
            >
              {assetType !== ASSET_TYPES.MF && (
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  <input
                    type="text"
                    placeholder="Symbol (e.g. HDFCBANK)"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className={inputBaseClasses}
                  />
                </motion.div>
              )}
              
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                <input
                  type="text"
                  placeholder={assetType === ASSET_TYPES.MF ? "Fund Name" : "Asset Name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputBaseClasses}
                />
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-2 gap-5">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={inputBaseClasses}
                />
                <input
                  type="number"
                  placeholder="Avg. Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={inputBaseClasses}
                />
              </motion.div>
              
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                <select
                  value={confidence}
                  onChange={(e) => setConfidence(e.target.value)}
                  className={`${inputBaseClasses} appearance-none`}
                >
                  <option value="" disabled className="text-black">Conviction Level</option>
                  {CONFIDENCE_OPTIONS.map((item) => (
                    <option key={item} value={item} className="text-black">{item}</option>
                  ))}
                </select>
              </motion.div>

              {assetType === ASSET_TYPES.STOCK && (
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className={`${inputBaseClasses} appearance-none`}
                  >
                    {SECTORS.map((item) => (
                      <option key={item} value={item} className="text-black">{item}</option>
                    ))}
                  </select>
                </motion.div>
              )}

              {assetType === ASSET_TYPES.MF && (
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Fund Code"
                    value={fundCode}
                    onChange={(e) => setFundCode(e.target.value)}
                    className={inputBaseClasses}
                  />
                  <input
                    type="text"
                    placeholder="MFAPI Code"
                    value={mfApiCode}
                    onChange={(e) => setMfApiCode(e.target.value)}
                    className={inputBaseClasses}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* ── Actions with Magnetic/Hover Interaction ── */}
            <div className="mt-10 flex gap-4 relative z-10">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 rounded-2xl bg-transparent border border-white/10 py-4 text-sm font-bold text-white/70 transition-colors"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={!loading && isFormValid ? { scale: 1.02, boxShadow: "0 0 30px rgba(255,255,255,0.3)" } : {}}
                whileTap={!loading && isFormValid ? { scale: 0.98 } : {}}
                disabled={loading || !isFormValid}
                onClick={handleSave}
                className="flex-1 rounded-2xl bg-white py-4 text-sm font-extrabold text-black disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? "Adding..." : "Add Holding"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}