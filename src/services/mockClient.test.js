import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockApi } from './mockClient.js';

describe('mockClient', () => {
  let consoleWarnSpy;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should return overallInvestments data with 300ms delay', async () => {
    const startTime = Date.now();
    const data = await mockApi.getOverallInvestments();
    const endTime = Date.now();

    expect(Array.isArray(data)).toBe(true);
    expect(endTime - startTime).toBeGreaterThanOrEqual(250); 
    expect(consoleWarnSpy).toHaveBeenCalledWith('[MOCK DATA] Using mock data for endpoint: overallInvestments');
  });

  it('should return assetAllocation data with 300ms delay', async () => {
    const startTime = Date.now();
    const data = await mockApi.getAssetAllocation();
    const endTime = Date.now();

    expect(Array.isArray(data)).toBe(true);
    expect(endTime - startTime).toBeGreaterThanOrEqual(250); 
    expect(consoleWarnSpy).toHaveBeenCalledWith('[MOCK DATA] Using mock data for endpoint: assetAllocation');
  });

  it('should return overallSectorAllocation data with 300ms delay', async () => {
    const startTime = Date.now();
    const data = await mockApi.getOverallSectorAllocation();
    const endTime = Date.now();

    expect(Array.isArray(data)).toBe(true);
    expect(endTime - startTime).toBeGreaterThanOrEqual(250); 
    expect(consoleWarnSpy).toHaveBeenCalledWith('[MOCK DATA] Using mock data for endpoint: overallSectorAllocation');
  });

  it('should return stocksAllocation data with 300ms delay', async () => {
    const startTime = Date.now();
    const data = await mockApi.getStocksAllocation();
    const endTime = Date.now();

    expect(Array.isArray(data)).toBe(true);
    expect(endTime - startTime).toBeGreaterThanOrEqual(250); 
    expect(consoleWarnSpy).toHaveBeenCalledWith('[MOCK DATA] Using mock data for endpoint: stocksAllocation');
  });
});
