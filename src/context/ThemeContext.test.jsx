import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext.jsx';

// Test component to access the theme context
function TestComponent() {
  const { mode, toggle, isStorageAvailable } = useTheme();
  return (
    <div>
      <div data-testid="mode">{mode}</div>
      <div data-testid="storage-available">{String(isStorageAvailable)}</div>
      <button onClick={toggle} data-testid="toggle-button">
        Toggle
      </button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset HTML class
    document.documentElement.className = '';
    // Clear any mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up
    document.documentElement.className = '';
  });

  describe('initialization', () => {
    it('should default to dark mode when localStorage is empty', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode').textContent).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should restore dark theme from localStorage', () => {
      localStorage.setItem('equity-dashboard-theme', 'dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode').textContent).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should restore light theme from localStorage', () => {
      localStorage.setItem('equity-dashboard-theme', 'light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode').textContent).toBe('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('should default to dark when localStorage has invalid value', () => {
      localStorage.setItem('equity-dashboard-theme', 'invalid');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode').textContent).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should apply theme class to HTML element on mount', () => {
      localStorage.setItem('equity-dashboard-theme', 'light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('toggle functionality', () => {
    it('should toggle from dark to light', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode').textContent).toBe('dark');

      await act(async () => {
        screen.getByTestId('toggle-button').click();
      });

      expect(screen.getByTestId('mode').textContent).toBe('light');
      expect(localStorage.getItem('equity-dashboard-theme')).toBe('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should toggle from light to dark', async () => {
      localStorage.setItem('equity-dashboard-theme', 'light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode').textContent).toBe('light');

      await act(async () => {
        screen.getByTestId('toggle-button').click();
      });

      expect(screen.getByTestId('mode').textContent).toBe('dark');
      expect(localStorage.getItem('equity-dashboard-theme')).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('should toggle multiple times correctly', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const button = screen.getByTestId('toggle-button');

      // Dark -> Light
      await act(async () => {
        button.click();
      });
      expect(screen.getByTestId('mode').textContent).toBe('light');

      // Light -> Dark
      await act(async () => {
        button.click();
      });
      expect(screen.getByTestId('mode').textContent).toBe('dark');

      // Dark -> Light
      await act(async () => {
        button.click();
      });
      expect(screen.getByTestId('mode').textContent).toBe('light');

      expect(localStorage.getItem('equity-dashboard-theme')).toBe('light');
    });
  });

  describe('localStorage persistence', () => {
    it('should persist theme changes to localStorage', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        screen.getByTestId('toggle-button').click();
      });

      expect(localStorage.getItem('equity-dashboard-theme')).toBe('light');
    });

    it('should detect localStorage availability', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('storage-available').textContent).toBe('true');
    });
  });

  describe('atomic operation guarantee', () => {
    it('should update both localStorage and DOM together', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        screen.getByTestId('toggle-button').click();
      });

      // Both should be updated
      expect(localStorage.getItem('equity-dashboard-theme')).toBe('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(screen.getByTestId('mode').textContent).toBe('light');
    });

    it('should handle localStorage errors gracefully', async () => {
      // Note: The current implementation allows localStorage to fail after availability check
      // since availability is checked only once at mount. If setItem fails during toggle,
      // the theme will still change but won't persist. This is acceptable behavior.
      
      // Start with working localStorage
      localStorage.setItem('equity-dashboard-theme', 'dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const initialMode = screen.getByTestId('mode').textContent;

      // Now mock localStorage.setItem to throw an error AFTER provider is mounted
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('localStorage is full');
      });

      // Console.error will be called, but we suppress it for the test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await act(async () => {
        screen.getByTestId('toggle-button').click();
      });

      // With the current implementation, when localStorage fails:
      // - localStorage write fails and gets reverted
      // - DOM gets reverted
      // - State remains unchanged
      expect(screen.getByTestId('mode').textContent).toBe(initialMode);
      expect(document.documentElement.classList.contains(initialMode)).toBe(true);

      // Cleanup
      Storage.prototype.setItem = originalSetItem;
      consoleError.mockRestore();
    });
  });

  describe('useTheme hook', () => {
    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleError.mockRestore();
    });

    it('should provide mode, toggle, and isStorageAvailable', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode')).toBeDefined();
      expect(screen.getByTestId('storage-available')).toBeDefined();
      expect(screen.getByTestId('toggle-button')).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty string in localStorage', () => {
      // Clear any mocks from previous tests
      vi.restoreAllMocks();
      localStorage.clear();
      
      localStorage.setItem('equity-dashboard-theme', '');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode').textContent).toBe('dark');
    });

    it('should handle null in localStorage gracefully', () => {
      // This shouldn't happen normally but test defensive code
      localStorage.removeItem('equity-dashboard-theme');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode').textContent).toBe('dark');
    });

    it('should only have one theme class on HTML element at a time', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Initially dark
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);

      // Toggle to light
      await act(async () => {
        screen.getByTestId('toggle-button').click();
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // Toggle back to dark
      await act(async () => {
        screen.getByTestId('toggle-button').click();
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });
  });
});
