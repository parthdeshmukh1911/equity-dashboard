/**
 * Real API Client
 * 
 * Fetches data from Google Apps Script deployment URL with query parameters.
 * Implements timeout handling and structured error responses.
 * 
 * All errors are thrown as structured ApiError objects:
 * { endpoint: string, status: number | 'timeout' | 'network', message: string }
 */

import { mockApi } from './mockClient.js';

// Base URL from Vite environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Request timeout in milliseconds
const TIMEOUT_MS = 10_000;

/**
 * Fetches data from the API with timeout handling
 * @param {string} action - The action parameter for the API endpoint
 * @returns {Promise<Object>} The parsed JSON response
 * @throws {ApiError} Structured error object with endpoint, status, and message
 */
async function apiFetch(action) {
  const url = `${BASE_URL}?action=${action}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Ensure CORS mode and follow redirects explicitly
    const res = await fetch(url, { signal: controller.signal, mode: 'cors', redirect: 'follow' });
    clearTimeout(timer);

    // If the response is JSON (even after redirects), parse and return it.
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await res.json();
      // If server returned an error status code, surface it as an ApiError with the JSON payload if available
      if (!res.ok) {
        throw { endpoint: action, status: res.status, message: res.statusText, payload: json };
      }
      // Normalize Apps Script envelope: extract json.data if present
      let data = json && typeof json === 'object' && 'data' in json ? json.data : json;

      return data;
    }

    // If the response is not JSON, read text and include a snippet in the error to help debugging
    const txt = await res.text().catch(() => '');
    const snippet = txt.slice(0, 1000);
    throw { endpoint: action, status: res.status, message: `Expected JSON but got '${contentType || 'unknown'}'. Response snippet: ${snippet}` };
  } catch (err) {
    clearTimeout(timer);

    // Handle abort/timeout errors
    if (err && err.name === 'AbortError') {
      throw { endpoint: action, status: 'timeout', message: 'Request timed out' };
    }

    // If already structured as ApiError, re-throw as-is
    if (err && err.endpoint) {
      throw err;
    }

    // Handle network errors and other unexpected errors
    throw { endpoint: action, status: 'network', message: err?.message || String(err) };
  }
}

/**
 * Real API client implementation
 */
const realApi = {
  getOverallInvestments: () => apiFetch('overallInvestments'),
  getAssetAllocation: () => apiFetch('assetAllocation'),
  getOverallSectorAllocation: () => apiFetch('overallSectorAllocation'),
  getStocksAllocation: () => apiFetch('stocksAllocation'),
  getStocks: () => apiFetch('stocks'),
  getEtfs: () => apiFetch('etfs'),
  getMutualFunds: () => apiFetch('mutualFunds'),
};

/**
 * Exported API client
 * Switches between mock and real implementation based on VITE_USE_MOCK env variable
 */
export const api = import.meta.env.VITE_USE_MOCK === 'true' ? mockApi : realApi;
