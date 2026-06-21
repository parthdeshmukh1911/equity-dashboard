/**
 * Calculate portfolio diversification score using the Herfindahl-Hirschman Index (HHI)
 * 
 * The HHI is calculated as the sum of squared portfolio weights.
 * A perfectly diversified portfolio (equal weights) has low HHI, while
 * a concentrated portfolio (one dominant holding) has high HHI.
 * 
 * The diversification score is normalized to [0, 100] where:
 * - 100 = perfectly diversified (all holdings have equal weight)
 * - 0 = completely concentrated (one holding has 100% weight)
 * 
 * @param {Array<Object>} holdings - Array of holding objects
 * @param {number} holdings[].portfolioWeight - Weight of holding as percentage (0-100)
 * @returns {number} Diversification score between 0 and 100
 * 
 * @example
 * // Two equal holdings (perfectly diversified)
 * calcDiversification([
 *   { portfolioWeight: 50 },
 *   { portfolioWeight: 50 }
 * ]) // 100
 * 
 * // One concentrated holding
 * calcDiversification([
 *   { portfolioWeight: 100 }
 * ]) // 0
 * 
 * // Mixed portfolio
 * calcDiversification([
 *   { portfolioWeight: 40 },
 *   { portfolioWeight: 30 },
 *   { portfolioWeight: 20 },
 *   { portfolioWeight: 10 }
 * ]) // ~72
 */
export function calcDiversification(holdings) {
  // Handle edge cases
  if (!Array.isArray(holdings) || holdings.length === 0) {
    return 0;
  }

  // Single holding is completely concentrated
  if (holdings.length === 1) {
    return 0;
  }

  // Calculate HHI as sum of squared weights
  // Convert portfolio weights from percentage (0-100) to decimal (0-1)
  const hhi = holdings.reduce((sum, holding) => {
    const weight = (holding.portfolioWeight || 0) / 100;
    return sum + (weight * weight);
  }, 0);

  // Calculate ideal HHI for perfectly diversified portfolio
  // (equal weights across n holdings)
  const n = holdings.length;
  const idealHHI = 1 / n;

  // Worst case HHI is 1 (all weight in one holding)
  const worstHHI = 1;

  // Normalize to 0-100 scale
  // Score = 100 when HHI = idealHHI (best diversification)
  // Score = 0 when HHI = 1 (worst diversification)
  const score = ((worstHHI - hhi) / (worstHHI - idealHHI)) * 100;

  // Clamp to [0, 100] and round to 2 decimal places
  return Math.max(0, Math.min(100, Math.round(score * 100) / 100));
}
