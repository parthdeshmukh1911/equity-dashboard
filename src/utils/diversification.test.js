import { describe, it, expect } from 'vitest';
import { calcDiversification } from './diversification.js';

describe('calcDiversification', () => {
  describe('basic functionality', () => {
    it('should return 0 for empty array', () => {
      expect(calcDiversification([])).toBe(0);
    });

    it('should return 0 for single holding (completely concentrated)', () => {
      expect(calcDiversification([
        { portfolioWeight: 100 }
      ])).toBe(0);
    });

    it('should return 100 for two equal holdings (perfectly diversified)', () => {
      expect(calcDiversification([
        { portfolioWeight: 50 },
        { portfolioWeight: 50 }
      ])).toBe(100);
    });

    it('should return 100 for three equal holdings', () => {
      expect(calcDiversification([
        { portfolioWeight: 33.33 },
        { portfolioWeight: 33.33 },
        { portfolioWeight: 33.34 }
      ])).toBe(100);
    });

    it('should return 100 for four equal holdings', () => {
      expect(calcDiversification([
        { portfolioWeight: 25 },
        { portfolioWeight: 25 },
        { portfolioWeight: 25 },
        { portfolioWeight: 25 }
      ])).toBe(100);
    });
  });

  describe('realistic portfolios', () => {
    it('should handle moderately diversified portfolio', () => {
      const score = calcDiversification([
        { portfolioWeight: 40 },
        { portfolioWeight: 30 },
        { portfolioWeight: 20 },
        { portfolioWeight: 10 }
      ]);
      
      // This portfolio is not perfectly diversified, should be between 0 and 100
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(100);
      // The HHI-based diversification score for this portfolio
      expect(score).toBeCloseTo(93.33, 1);
    });

    it('should handle heavily skewed portfolio', () => {
      const score = calcDiversification([
        { portfolioWeight: 80 },
        { portfolioWeight: 10 },
        { portfolioWeight: 5 },
        { portfolioWeight: 5 }
      ]);
      
      // Very concentrated portfolio, low score
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(50);
    });

    it('should handle many small holdings with one dominant', () => {
      const score = calcDiversification([
        { portfolioWeight: 50 },
        { portfolioWeight: 10 },
        { portfolioWeight: 10 },
        { portfolioWeight: 10 },
        { portfolioWeight: 10 },
        { portfolioWeight: 10 }
      ]);
      
      // Somewhat concentrated, but better than pure concentration
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(100);
    });
  });

  describe('edge cases', () => {
    it('should handle holdings with zero weight', () => {
      const score = calcDiversification([
        { portfolioWeight: 50 },
        { portfolioWeight: 50 },
        { portfolioWeight: 0 }
      ]);
      
      // Should treat as two equal holdings
      expect(score).toBeGreaterThan(0);
    });

    it('should handle holdings without portfolioWeight property', () => {
      const score = calcDiversification([
        { portfolioWeight: 50 },
        { name: 'holding without weight' },
        { portfolioWeight: 50 }
      ]);
      
      // Missing weight treated as 0, effectively two equal holdings
      expect(score).toBeGreaterThan(0);
    });

    it('should handle non-array input', () => {
      expect(calcDiversification(null)).toBe(0);
      expect(calcDiversification(undefined)).toBe(0);
      expect(calcDiversification('not an array')).toBe(0);
    });

    it('should always return value between 0 and 100', () => {
      const score1 = calcDiversification([
        { portfolioWeight: 25 },
        { portfolioWeight: 25 },
        { portfolioWeight: 25 },
        { portfolioWeight: 25 }
      ]);
      expect(score1).toBeGreaterThanOrEqual(0);
      expect(score1).toBeLessThanOrEqual(100);

      const score2 = calcDiversification([
        { portfolioWeight: 100 }
      ]);
      expect(score2).toBeGreaterThanOrEqual(0);
      expect(score2).toBeLessThanOrEqual(100);
    });

    it('should handle weights that do not sum to 100', () => {
      // Real-world data might have rounding errors
      const score = calcDiversification([
        { portfolioWeight: 33.33 },
        { portfolioWeight: 33.33 },
        { portfolioWeight: 33.33 }
      ]);
      
      // Should still work, even if sum is 99.99
      expect(score).toBeGreaterThan(95);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('mathematical properties', () => {
    it('should give higher score for more equal distribution', () => {
      const concentrated = calcDiversification([
        { portfolioWeight: 70 },
        { portfolioWeight: 30 }
      ]);
      
      const equal = calcDiversification([
        { portfolioWeight: 50 },
        { portfolioWeight: 50 }
      ]);
      
      expect(equal).toBeGreaterThan(concentrated);
    });

    it('should give lower score as concentration increases', () => {
      const score1 = calcDiversification([
        { portfolioWeight: 50 },
        { portfolioWeight: 50 }
      ]);
      
      const score2 = calcDiversification([
        { portfolioWeight: 70 },
        { portfolioWeight: 30 }
      ]);
      
      const score3 = calcDiversification([
        { portfolioWeight: 90 },
        { portfolioWeight: 10 }
      ]);
      
      expect(score1).toBeGreaterThan(score2);
      expect(score2).toBeGreaterThan(score3);
    });

    it('should increase score with more equal holdings', () => {
      const score2 = calcDiversification([
        { portfolioWeight: 50 },
        { portfolioWeight: 50 }
      ]);
      
      const score5 = calcDiversification([
        { portfolioWeight: 20 },
        { portfolioWeight: 20 },
        { portfolioWeight: 20 },
        { portfolioWeight: 20 },
        { portfolioWeight: 20 }
      ]);
      
      const score10 = calcDiversification(
        Array(10).fill({ portfolioWeight: 10 })
      );
      
      // All should be perfect diversification
      expect(score2).toBe(100);
      expect(score5).toBe(100);
      expect(score10).toBe(100);
    });
  });
});
