import { useEffect, useState } from "react";
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

  const inputClasses = "w-full rounded-full bg-slate-800 p-3 text-white placeholder-slate-400 focus:outline-none transition";
  const selectClasses = "w-full rounded-full bg-slate-800 p-3 text-white focus:outline-none transition appearance-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Add Asset</h2>

        {/* Asset Type Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { id: ASSET_TYPES.STOCK, label: "Stock" },
            { id: ASSET_TYPES.ETF, label: "ETF" },
            { id: ASSET_TYPES.MF, label: "Mutual Fund" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAssetType(tab.id)}
              className={`rounded-full py-3 font-semibold transition ${
                assetType === tab.id
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          {assetType !== ASSET_TYPES.MF && (
            <input
              type="text"
              placeholder="Symbol (e.g. HDFCBANK)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className={inputClasses}
            />
          )}

          <input
            type="text"
            placeholder={assetType === ASSET_TYPES.MF ? "Fund Name" : "Asset Name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={inputClasses}
            />
            <input
              type="number"
              placeholder="Avg. Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClasses}
            />
          </div>

          <select
            value={confidence}
            onChange={(e) => setConfidence(e.target.value)}
            className={selectClasses}
          >
            <option value="" disabled className="text-black">Conviction Level</option>
            {CONFIDENCE_OPTIONS.map((item) => (
              <option key={item} value={item} className="text-black">{item}</option>
            ))}
          </select>

          {assetType === ASSET_TYPES.STOCK && (
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className={selectClasses}
            >
              {SECTORS.map((item) => (
                <option key={item} value={item} className="text-black">{item}</option>
              ))}
            </select>
          )}

          {assetType === ASSET_TYPES.MF && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Fund Code"
                value={fundCode}
                onChange={(e) => setFundCode(e.target.value)}
                className={inputClasses}
              />
              <input
                type="text"
                placeholder="MFAPI Code"
                value={mfApiCode}
                onChange={(e) => setMfApiCode(e.target.value)}
                className={inputClasses}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-slate-700 py-3 text-white"
          >
            Cancel
          </button>
          <button
            disabled={loading || !isFormValid}
            onClick={handleSave}
            className="flex-1 rounded-full py-3 font-semibold text-white transition bg-gradient-to-r from-sky-600 to-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Holding"}
          </button>
        </div>
      </div>
    </Modal>
  );
}