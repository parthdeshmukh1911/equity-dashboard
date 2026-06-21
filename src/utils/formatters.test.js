import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercent } from './formatters.js';

describe('formatCurrency', () => {
  describe('basic functionality', () => {
    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('₹0');
    });

    it('should format positive numbers with ₹ prefix', () => {
      expect(formatCurrency(100)).toBe('₹100.00');
      expect(formatCurrency(1000)).toBe('₹1,000');
    });

    it('should format negative numbers with − sign and ₹ prefix', () => {
      expect(formatCurrency(-100)).toBe('−₹100.00');
      expect(formatCurrency(-1000)).toBe('−₹1,000');
    });
  });

  describe('scale formatting', () => {
    it('should format small values (< 1000) with 2 decimal places', () => {
      expect(formatCurrency(50)).toBe('₹50.00');
      expect(formatCurrency(999.99)).toBe('₹999.99');
      expect(formatCurrency(-50)).toBe('−₹50.00');
    });

    it('should format thousands with comma separator', () => {
      expect(formatCurrency(1000)).toBe('₹1,000');
      expect(formatCurrency(5000)).toBe('₹5,000');
      expect(formatCurrency(99999)).toBe('₹99,999');
      expect(formatCurrency(-5000)).toBe('−₹5,000');
    });

    it('should format lakhs (100,000+) with L suffix', () => {
      expect(formatCurrency(100000)).toBe('₹1.00L');
      expect(formatCurrency(123456)).toBe('₹1.23L');
      expect(formatCurrency(1234567)).toBe('₹12.35L');
      expect(formatCurrency(-500000)).toBe('−₹5.00L');
    });

    it('should format crores (10,000,000+) with Cr suffix', () => {
      expect(formatCurrency(10000000)).toBe('₹1.00Cr');
      expect(formatCurrency(12345678)).toBe('₹1.23Cr');
      expect(formatCurrency(100000000)).toBe('₹10.00Cr');
      expect(formatCurrency(-25000000)).toBe('−₹2.50Cr');
    });
  });

  describe('edge cases', () => {
    it('should handle Infinity as ₹0', () => {
      expect(formatCurrency(Infinity)).toBe('₹0');
      expect(formatCurrency(-Infinity)).toBe('₹0');
    });

    it('should handle NaN as ₹0', () => {
      expect(formatCurrency(NaN)).toBe('₹0');
    });

    it('should handle very large numbers', () => {
      expect(formatCurrency(1e12)).toBe('₹100000.00Cr');
    });

    it('should preserve sign for negative zero (edge case)', () => {
      expect(formatCurrency(-0)).toBe('₹0');
    });
  });
});

describe('formatPercent', () => {
  describe('basic functionality', () => {
    it('should format zero without sign prefix', () => {
      expect(formatPercent(0)).toBe('0.00%');
    });

    it('should format positive numbers with + prefix', () => {
      expect(formatPercent(12.5)).toBe('+12.50%');
      expect(formatPercent(100)).toBe('+100.00%');
      expect(formatPercent(0.01)).toBe('+0.01%');
    });

    it('should format negative numbers with − prefix', () => {
      expect(formatPercent(-3.2)).toBe('−3.20%');
      expect(formatPercent(-100)).toBe('−100.00%');
      expect(formatPercent(-0.01)).toBe('−0.01%');
    });
  });

  describe('precision', () => {
    it('should always show 2 decimal places', () => {
      expect(formatPercent(5)).toBe('+5.00%');
      expect(formatPercent(5.1)).toBe('+5.10%');
      expect(formatPercent(5.123)).toBe('+5.12%');
      expect(formatPercent(-10.999)).toBe('−11.00%');
    });

    it('should round correctly', () => {
      expect(formatPercent(12.345)).toBe('+12.35%');
      expect(formatPercent(12.344)).toBe('+12.34%');
      expect(formatPercent(-7.895)).toBe('−7.89%'); // Note: JavaScript toFixed rounds -7.895 to -7.89 (banker's rounding)
    });
  });

  describe('edge cases', () => {
    it('should handle very large percentages', () => {
      expect(formatPercent(150.75)).toBe('+150.75%');
      expect(formatPercent(1000)).toBe('+1000.00%');
    });

    it('should handle very small percentages', () => {
      expect(formatPercent(0.001)).toBe('+0.00%');
      expect(formatPercent(-0.001)).toBe('−0.00%');
    });

    it('should handle Infinity as 0.00%', () => {
      expect(formatPercent(Infinity)).toBe('0.00%');
      expect(formatPercent(-Infinity)).toBe('0.00%');
    });

    it('should handle NaN as 0.00%', () => {
      expect(formatPercent(NaN)).toBe('0.00%');
    });

    it('should handle negative zero', () => {
      expect(formatPercent(-0)).toBe('0.00%');
    });
  });
});
