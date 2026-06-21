import { describe, expect, it } from 'vitest';
import { isIndianMarketOpen } from './marketHours';

describe('isIndianMarketOpen', () => {
  it('opens at 9:15 AM IST on a weekday', () => {
    expect(isIndianMarketOpen(new Date('2026-06-22T03:45:00Z'))).toBe(true);
  });

  it('does not poll before the market opens', () => {
    expect(isIndianMarketOpen(new Date('2026-06-22T03:44:00Z'))).toBe(false);
  });

  it('stops polling at 3:30 PM IST', () => {
    expect(isIndianMarketOpen(new Date('2026-06-22T10:00:00Z'))).toBe(false);
  });

  it('does not poll on weekends', () => {
    expect(isIndianMarketOpen(new Date('2026-06-21T06:30:00Z'))).toBe(false);
  });
});
