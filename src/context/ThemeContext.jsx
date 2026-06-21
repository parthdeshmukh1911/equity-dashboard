import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'equity-dashboard-theme';
const VALID_THEMES = ['dark', 'light'];

/**
 * Check if localStorage is available and functional.
 * @returns {boolean} true if localStorage is available, false otherwise
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * ThemeProvider manages theme state with localStorage persistence.
 * 
 * Requirements:
 * - 2.6: Theme toggle persists to localStorage; if unavailable, disable toggle
 * - 9.5: Theme changes must atomically update both localStorage AND DOM;
 *        if either fails, revert both
 */
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    // On mount: read from localStorage, fall back to 'dark'
    if (isLocalStorageAvailable()) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && VALID_THEMES.includes(stored)) {
          return stored;
        }
      } catch (e) {
        console.warn('Failed to read theme from localStorage:', e);
      }
    }
    return 'dark';
  });

  const [isStorageAvailable] = useState(isLocalStorageAvailable());

  // Apply theme class to <html> on mount and whenever mode changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Remove both classes first
    htmlElement.classList.remove('dark', 'light');
    
    // Apply current theme
    htmlElement.classList.add(mode);
  }, [mode]);

  /**
   * Toggle theme between dark and light.
   * Atomically updates both localStorage and DOM class.
   * If either operation fails, reverts both changes.
   */
  const toggle = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    const oldMode = mode;
    const htmlElement = document.documentElement;

    // Track whether we need to revert
    let localStorageUpdated = false;
    let domUpdated = false;

    try {
      // Step 1: Update localStorage if available
      if (isStorageAvailable) {
        localStorage.setItem(STORAGE_KEY, newMode);
        localStorageUpdated = true;
      }

      // Step 2: Update DOM
      htmlElement.classList.remove(oldMode);
      htmlElement.classList.add(newMode);
      domUpdated = true;

      // Step 3: Update state (only if both succeeded or localStorage not available)
      setMode(newMode);
    } catch (error) {
      console.error('Failed to toggle theme:', error);

      // Revert localStorage if it was updated
      if (localStorageUpdated) {
        try {
          localStorage.setItem(STORAGE_KEY, oldMode);
        } catch (revertError) {
          console.error('Failed to revert localStorage:', revertError);
        }
      }

      // Revert DOM if it was updated
      if (domUpdated) {
        htmlElement.classList.remove(newMode);
        htmlElement.classList.add(oldMode);
      }

      // State remains unchanged on failure
    }
  };

  const value = {
    mode,
    toggle,
    isStorageAvailable,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context.
 * @returns {{ mode: 'dark' | 'light', toggle: () => void, isStorageAvailable: boolean }}
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
