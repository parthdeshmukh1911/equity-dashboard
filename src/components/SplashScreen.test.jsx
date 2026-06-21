import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import SplashScreen from './SplashScreen';

// Framer Motion's AnimatePresence uses real timers for exit animations;
// we mock it to call onExitComplete immediately so tests remain synchronous.
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    AnimatePresence: ({ children, onExitComplete }) => {
      // Flatten children — when children is null/undefined (after state flip),
      // call onExitComplete if provided.
      if (!children) {
        onExitComplete?.();
        return null;
      }
      return children;
    },
    motion: {
      div: ({ children, className, role, 'aria-label': ariaLabel, ...rest }) => (
        <div className={className} role={role} aria-label={ariaLabel}>
          {children}
        </div>
      ),
      h1: ({ children, className }) => <h1 className={className}>{children}</h1>,
      p: ({ children, className }) => <p className={className}>{children}</p>,
    },
  };
});

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the app name on mount', () => {
    render(<SplashScreen />);
    expect(screen.getByText('Equity Dashboard')).toBeInTheDocument();
  });

  it('renders with accessible status role', () => {
    render(<SplashScreen />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has a descriptive aria-label', () => {
    render(<SplashScreen />);
    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Loading Equity Dashboard'
    );
  });

  it('renders the tagline text', () => {
    render(<SplashScreen />);
    expect(screen.getByText('Your portfolio, beautifully')).toBeInTheDocument();
  });

  it('is visible immediately on mount', () => {
    render(<SplashScreen />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('unmounts after 1500ms and calls onComplete', () => {
    const onComplete = vi.fn();
    render(<SplashScreen onComplete={onComplete} />);

    // Still visible before timeout
    expect(screen.queryByRole('status')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // After timeout the splash should be gone and onComplete should have been called
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('does not call onComplete before the timeout', () => {
    const onComplete = vi.fn();
    render(<SplashScreen onComplete={onComplete} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('works without an onComplete prop', () => {
    render(<SplashScreen />);
    // Should not throw when no callback provided
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('clears the timeout on unmount to avoid memory leaks', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = render(<SplashScreen />);
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
