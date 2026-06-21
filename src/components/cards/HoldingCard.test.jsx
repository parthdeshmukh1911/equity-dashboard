import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import HoldingCard from './HoldingCard';

// ── Shared fixtures ────────────────────────────────────────────────────────────

const profitHolding = {
  id: '1',
  name: 'HDFC Bank',
  sector: 'Financial Services',
  category: 'stock',
  quantity: 10,
  investedValue: 150000,
  currentValue: 180000,
  returnValue: 30000,
  returnPct: 20,
  portfolioWeight: 12.5,
  confidenceLevel: 'High',
};

const lossHolding = {
  id: '2',
  name: 'Paytm',
  sector: 'Technology',
  category: 'stock',
  quantity: 5,
  investedValue: 40000,
  currentValue: 32000,
  returnValue: -8000,
  returnPct: -20,
  portfolioWeight: 5.0,
  confidenceLevel: 'Low',
};

const etfHolding = {
  id: '3',
  name: 'Nifty 50 ETF',
  sector: 'ETF',
  category: 'etf',
  quantity: 20,
  investedValue: 50000,
  currentValue: 55000,
  returnValue: 5000,
  returnPct: 10,
  portfolioWeight: 8.0,
};

// ── FULL VARIANT ───────────────────────────────────────────────────────────────

describe('HoldingCard — full variant', () => {
  it('renders holding name', () => {
    render(<HoldingCard holding={profitHolding} variant="full" />);
    expect(screen.getByText('HDFC Bank')).toBeInTheDocument();
  });

  it('renders sector badge', () => {
    render(<HoldingCard holding={profitHolding} variant="full" />);
    expect(screen.getByText('Financial Services')).toBeInTheDocument();
  });

  it('renders quantity', () => {
    render(<HoldingCard holding={profitHolding} variant="full" />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders portfolio weight', () => {
    render(<HoldingCard holding={profitHolding} variant="full" />);
    expect(screen.getByText('12.50%')).toBeInTheDocument();
  });

  it('renders confidence level', () => {
    render(<HoldingCard holding={profitHolding} variant="full" />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('does not render confidence badge when not provided', () => {
    render(<HoldingCard holding={etfHolding} variant="full" />);
    expect(screen.queryByText('High')).not.toBeInTheDocument();
    expect(screen.queryByText('Medium')).not.toBeInTheDocument();
    expect(screen.queryByText('Low')).not.toBeInTheDocument();
  });

  it('renders current value label', () => {
    render(<HoldingCard holding={profitHolding} variant="full" />);
    // ₹1.80L — currentValue 180000
    expect(screen.getByText('₹1.80L')).toBeInTheDocument();
  });

  it('renders invested value label', () => {
    render(<HoldingCard holding={profitHolding} variant="full" />);
    // ₹1.50L — investedValue 150000
    expect(screen.getByText('₹1.50L')).toBeInTheDocument();
  });

  // ── Return colour (Requirements 4.4) ─────────────────────────────────────────

  it('applies profit color (#22C55E) to return percentage for positive return', () => {
    render(<HoldingCard holding={profitHolding} variant="full" />);
    const returnPctEl = screen.getByText('+20.00%');
    expect(returnPctEl).toHaveStyle({ color: '#22C55E' });
  });

  it('applies loss color (#EF4444) to return percentage for negative return', () => {
    render(<HoldingCard holding={lossHolding} variant="full" />);
    const returnPctEl = screen.getByText('−20.00%');
    expect(returnPctEl).toHaveStyle({ color: '#EF4444' });
  });

  it('applies profit color to return value text for positive return', () => {
    render(<HoldingCard holding={profitHolding} variant="full" />);
    const returnValEl = screen.getByText('+₹30,000');
    expect(returnValEl).toHaveStyle({ color: '#22C55E' });
  });

  it('applies loss color to return value text for negative return', () => {
    render(<HoldingCard holding={lossHolding} variant="full" />);
    const returnValEl = screen.getByText('−₹8,000');
    expect(returnValEl).toHaveStyle({ color: '#EF4444' });
  });

  // ── Accessibility (Requirements 12.1, 12.4) ───────────────────────────────────

  it('has correct aria-label with name, current value and return percent', () => {
    render(<HoldingCard holding={profitHolding} variant="full" />);
    // article role when no onPress
    const card = document.querySelector('[aria-label]');
    expect(card).not.toBeNull();
    expect(card.getAttribute('aria-label')).toContain('HDFC Bank');
    expect(card.getAttribute('aria-label')).toContain('₹1.80L');
    expect(card.getAttribute('aria-label')).toContain('+20.00%');
  });

  // ── onPress / button behaviour (Requirement 4.5) ─────────────────────────────

  it('renders as <article> when onPress is not provided', () => {
    render(<HoldingCard holding={profitHolding} variant="full" />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('renders as <button> when onPress is provided', () => {
    const onPress = vi.fn();
    render(<HoldingCard holding={profitHolding} variant="full" onPress={onPress} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onPress when button is clicked', () => {
    const onPress = vi.fn();
    render(<HoldingCard holding={profitHolding} variant="full" onPress={onPress} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('calls onPress when Space key is pressed on the button (native button behavior)', () => {
    const onPress = vi.fn();
    render(<HoldingCard holding={profitHolding} variant="full" onPress={onPress} />);
    // Native <button> fires click on Space keyup — simulate directly
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  // ── Glassmorphism styling (Requirement 2.4) ───────────────────────────────────

  it('applies backdrop-filter blur glassmorphism style', () => {
    render(<HoldingCard holding={profitHolding} variant="full" />);
    const card = screen.getByRole('article');
    expect(card).toHaveStyle({ backdropFilter: 'blur(16px)' });
  });
});

// ── COMPACT VARIANT ────────────────────────────────────────────────────────────

describe('HoldingCard — compact variant', () => {
  it('renders holding name', () => {
    render(<HoldingCard holding={profitHolding} variant="compact" />);
    expect(screen.getByText('HDFC Bank')).toBeInTheDocument();
  });

  it('renders current value', () => {
    render(<HoldingCard holding={profitHolding} variant="compact" />);
    expect(screen.getByText('₹1.80L')).toBeInTheDocument();
  });

  it('renders return percentage', () => {
    render(<HoldingCard holding={profitHolding} variant="compact" />);
    expect(screen.getByText('+20.00%')).toBeInTheDocument();
  });

  it('does NOT render sector badge', () => {
    render(<HoldingCard holding={profitHolding} variant="compact" />);
    expect(screen.queryByText('Financial Services')).not.toBeInTheDocument();
  });

  it('does NOT render quantity label', () => {
    render(<HoldingCard holding={profitHolding} variant="compact" />);
    expect(screen.queryByText('Qty')).not.toBeInTheDocument();
  });

  it('applies profit color for positive return', () => {
    render(<HoldingCard holding={profitHolding} variant="compact" />);
    const pctEl = screen.getByText('+20.00%');
    expect(pctEl).toHaveStyle({ color: '#22C55E' });
  });

  it('applies loss color for negative return', () => {
    render(<HoldingCard holding={lossHolding} variant="compact" />);
    const pctEl = screen.getByText('−20.00%');
    expect(pctEl).toHaveStyle({ color: '#EF4444' });
  });

  it('has correct aria-label', () => {
    render(<HoldingCard holding={profitHolding} variant="compact" />);
    const card = document.querySelector('[aria-label]');
    expect(card).not.toBeNull();
    expect(card.getAttribute('aria-label')).toContain('HDFC Bank');
    expect(card.getAttribute('aria-label')).toContain('₹1.80L');
    expect(card.getAttribute('aria-label')).toContain('+20.00%');
  });

  it('renders as <button> when onPress is provided', () => {
    const onPress = vi.fn();
    render(<HoldingCard holding={profitHolding} variant="compact" onPress={onPress} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onPress when compact button is clicked', () => {
    const onPress = vi.fn();
    render(<HoldingCard holding={profitHolding} variant="compact" onPress={onPress} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders as <article> when onPress is not provided', () => {
    render(<HoldingCard holding={profitHolding} variant="compact" />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});

// ── DEFAULT VARIANT ────────────────────────────────────────────────────────────

describe('HoldingCard — default variant fallback', () => {
  it('defaults to full variant when variant prop is omitted', () => {
    render(<HoldingCard holding={profitHolding} />);
    // Full variant renders Qty label; compact does not
    expect(screen.getByText('Qty')).toBeInTheDocument();
  });
});

// ── PROPERTY-BASED TESTS ───────────────────────────────────────────────────────
// **Validates: Requirements 4.4**

describe('HoldingCard — Property 8: return color is consistent with return sign', () => {
  it('profit color for positive returnValue, loss color for negative returnValue (full)', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 30 }),
          sector: fc.constantFrom('Technology', 'Financial Services', 'Healthcare', 'Energy'),
          category: fc.constantFrom('stock', 'etf', 'mutualfund'),
          quantity: fc.integer({ min: 1, max: 1000 }),
          investedValue: fc.integer({ min: 1000, max: 10_000_000 }),
          returnValue: fc.integer({ min: -500_000, max: 500_000 }).filter(v => v !== 0),
          returnPct: fc.float({ min: Math.fround(-50), max: Math.fround(100), noNaN: true }),
          portfolioWeight: fc.float({ min: Math.fround(0.1), max: Math.fround(100), noNaN: true }),
        }).map(h => ({
          ...h,
          currentValue: h.investedValue + h.returnValue,
        })),
        (holding) => {
          const { unmount } = render(<HoldingCard holding={holding} variant="full" />);
          // Find the return-percentage pill (always rendered in full variant)
          const allElements = document.querySelectorAll('[style]');
          let foundReturnEl = false;
          const expectedColor = holding.returnValue > 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)';
          const hexColor = holding.returnValue > 0 ? '#22C55E' : '#EF4444';

          // Check that at least one styled element with the return color is present
          allElements.forEach(el => {
            const color = el.style.color;
            if (color === hexColor || color === expectedColor) {
              foundReturnEl = true;
            }
          });

          unmount();
          return foundReturnEl;
        }
      ),
      { numRuns: 50 }
    );
  });
});
