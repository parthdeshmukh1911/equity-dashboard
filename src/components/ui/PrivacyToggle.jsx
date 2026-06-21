import { Eye, EyeOff } from 'lucide-react';
import { usePrivacy } from '../../context/PrivacyContext';

export default function PrivacyToggle() {
  const { isPrivacyMode, togglePrivacyMode } = usePrivacy();

  return (
    <button
      onClick={togglePrivacyMode}
      className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
      aria-label={isPrivacyMode ? "Disable privacy mode" : "Enable privacy mode"}
    >
      {isPrivacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}
