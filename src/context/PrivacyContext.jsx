import { createContext, useContext, useState, useEffect } from 'react';

const PrivacyContext = createContext();

export function PrivacyProvider({ children }) {
  // Load initial state from localStorage if available, default to false
  const [isPrivacyMode, setIsPrivacyMode] = useState(() => {
    try {
      const stored = localStorage.getItem('equity_privacy_mode');
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('equity_privacy_mode', JSON.stringify(isPrivacyMode));
    } catch {
      // Ignore write errors
    }
  }, [isPrivacyMode]);

  const togglePrivacyMode = () => setIsPrivacyMode((prev) => !prev);

  return (
    <PrivacyContext.Provider value={{ isPrivacyMode, togglePrivacyMode }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  const context = useContext(PrivacyContext);
  if (!context) {
    return { isPrivacyMode: false, togglePrivacyMode: () => {} };
  }
  return context;
}
