import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.stubEnv('VITE_USE_MOCK', 'false');
vi.stubEnv('VITE_API_BASE_URL', 'https://script.google.com/test/exec');

describe('API Client', () => {
  let fetchMock;
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    fetchMock = vi.fn();
    global.fetch = fetchMock;
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  describe('URL Construction', () => {
    it('should construct correct URL for overallInvestments action', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ([]),
      });

      const { api } = await import('./apiClient.js');
      await api.getOverallInvestments();

      expect(fetchMock).toHaveBeenCalledWith(
        'https://script.google.com/test/exec?action=overallInvestments',
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });

    it('should construct correct URL for assetAllocation action', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ([]),
      });

      const { api } = await import('./apiClient.js');
      await api.getAssetAllocation();

      expect(fetchMock).toHaveBeenCalledWith(
        'https://script.google.com/test/exec?action=assetAllocation',
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });
  });

  describe('Error Handling', () => {
    it('should throw structured ApiError for non-2xx status', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        headers: new Headers({ 'content-type': 'application/json' }),
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}),
      });

      const { api } = await import('./apiClient.js');

      await expect(api.getStocks()).rejects.toEqual({
        endpoint: 'stocks',
        status: 500,
        message: 'Internal Server Error',
        payload: {},
      });
    });
  });
});
