import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { api } from '../services/apiClient';

function emptySlice() {
  return { data: null, loading: false, error: null };
}

const initialState = {
  overallInvestments: emptySlice(),
  assetAllocation: emptySlice(),
  overallSectorAllocation: emptySlice(),
  stocksAllocation: emptySlice(),
  stocks: emptySlice(),
  etfs: emptySlice(),
  mutualFunds: emptySlice(),
  lastUpdated: null,
};

const ENDPOINT_TO_KEY = {
  overallInvestments: 'overallInvestments',
  assetAllocation: 'assetAllocation',
  overallSectorAllocation: 'overallSectorAllocation',
  stocksAllocation: 'stocksAllocation',
  stocks: 'stocks',
  etfs: 'etfs',
  mutualFunds: 'mutualFunds',
};

function portfolioReducer(state, action) {
  const key = ENDPOINT_TO_KEY[action.endpoint];

  switch (action.type) {
    case 'FETCH_START':
      if (!key) return state;
      return {
        ...state,
        [key]: { ...state[key], loading: true, error: null },
      };

    case 'FETCH_SUCCESS':
      if (!key) return state;
      return {
        ...state,
        [key]: { data: action.data, loading: false, error: null },
        lastUpdated: new Date(),
      };

    case 'FETCH_ERROR':
      if (!key) return state;
      return {
        ...state,
        [key]: { ...state[key], loading: false, error: action.error },
      };

    default:
      return state;
  }
}

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  const fetchEndpoint = useCallback(async (endpoint, apiFn) => {
    dispatch({ type: 'FETCH_START', endpoint });
    try {
      const data = await apiFn();
      console.log(`[API] ${endpoint} ->`, data);
      dispatch({ type: 'FETCH_SUCCESS', endpoint, data });
    } catch (error) {
      console.error(`[API ERROR] ${endpoint} ->`, error);
      dispatch({ type: 'FETCH_ERROR', endpoint, error });
    }
  }, []);

  const fetchOverallInvestments = useCallback(() => fetchEndpoint('overallInvestments', api.getOverallInvestments), [fetchEndpoint]);
  const fetchAssetAllocation = useCallback(() => fetchEndpoint('assetAllocation', api.getAssetAllocation), [fetchEndpoint]);
  const fetchOverallSectorAllocation = useCallback(() => fetchEndpoint('overallSectorAllocation', api.getOverallSectorAllocation), [fetchEndpoint]);
  const fetchStocksAllocation = useCallback(() => fetchEndpoint('stocksAllocation', api.getStocksAllocation), [fetchEndpoint]);
  
  const fetchStocks = useCallback(() => fetchEndpoint('stocks', api.getStocks), [fetchEndpoint]);
  const fetchEtfs = useCallback(() => fetchEndpoint('etfs', api.getEtfs), [fetchEndpoint]);
  const fetchMutualFunds = useCallback(() => fetchEndpoint('mutualFunds', api.getMutualFunds), [fetchEndpoint]);

  const refreshAll = useCallback(async () => {
    const endpoints = [
      { endpoint: 'overallInvestments', apiFn: api.getOverallInvestments },
      { endpoint: 'assetAllocation', apiFn: api.getAssetAllocation },
      { endpoint: 'overallSectorAllocation', apiFn: api.getOverallSectorAllocation },
      { endpoint: 'stocksAllocation', apiFn: api.getStocksAllocation },
      { endpoint: 'stocks', apiFn: api.getStocks },
      { endpoint: 'etfs', apiFn: api.getEtfs },
      { endpoint: 'mutualFunds', apiFn: api.getMutualFunds },
    ];

    endpoints.forEach(({ endpoint }) =>
      dispatch({ type: 'FETCH_START', endpoint })
    );

    const results = await Promise.allSettled(
      endpoints.map(({ apiFn }) => apiFn())
    );

    results.forEach((result, i) => {
      const { endpoint } = endpoints[i];
      if (result.status === 'fulfilled') {
        dispatch({ type: 'FETCH_SUCCESS', endpoint, data: result.value });
      } else {
        dispatch({ type: 'FETCH_ERROR', endpoint, error: result.reason });
      }
    });
  }, []);

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const value = {
    state,
    fetchOverallInvestments,
    fetchAssetAllocation,
    fetchOverallSectorAllocation,
    fetchStocksAllocation,
    fetchStocks,
    fetchEtfs,
    fetchMutualFunds,
    refreshAll,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
