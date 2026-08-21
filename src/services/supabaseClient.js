import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * -----------------------------------------
 * Data Normalizers (Transforms Postgres Views -> Legacy GAS UI Payload)
 * -----------------------------------------
 */
function normalizeStock(item, index, totalValue = 0) {
  const currentVal = Number(item.current_value || 0);
  const investedVal = Number(item.invested_value || 0);
  const weight = totalValue > 0 ? (currentVal / totalValue) * 100 : Number(item.allocation_pct || 0);

  return {
    srNo: index + 1,
    assetId: item.asset_id,
    symbol: item.symbol,
    name: item.name,
    quantity: Number(item.total_quantity || 0),
    buyPrice: Number(item.avg_price || 0),
    invested: investedVal,
    investedValue: investedVal,
    confidence: item.confidence || 'Medium',
    badge: item.trade_type || item.badge || 'Trade',
    tradeType: item.trade_type || item.badge || 'Trade',
    currentPrice: Number(item.current_price || 0),
    currentValue: currentVal,
    pnl: Number(item.return_pct || 0),
    returnPct: Number(item.return_pct || 0),
    returnAbs: Number(item.return_abs || 0),
    dayChange: Number(item.day_change_abs || 0),
    dayChangePercent: Number(item.day_change_pct || 0),
    weightage: Number(weight.toFixed(2)),
    sector: item.sector || ''
  };
}

function normalizeETF(item, index, totalValue = 0) {
  const currentVal = Number(item.current_value || 0);
  const investedVal = Number(item.invested_value || 0);
  const weight = totalValue > 0 ? (currentVal / totalValue) * 100 : Number(item.allocation_pct || 0);

  return {
    srNo: index + 1,
    assetId: item.asset_id,
    symbol: item.symbol,
    name: item.name,
    quantity: Number(item.total_quantity || 0),
    buyPrice: Number(item.avg_price || 0),
    invested: investedVal,
    investedValue: investedVal,
    confidence: item.confidence || 'High',
    badge: item.trade_type || item.badge || 'Longterm',
    tradeType: item.trade_type || item.badge || 'Longterm',
    currentPrice: Number(item.current_price || 0),
    currentValue: currentVal,
    pnl: Number(item.return_pct || 0),
    returnPct: Number(item.return_pct || 0),
    returnAbs: Number(item.return_abs || 0),
    dayChange: Number(item.day_change_abs || 0),
    dayChangePercent: Number(item.day_change_pct || 0),
    weightage: Number(weight.toFixed(2))
  };
}

function normalizeMF(item, index, totalValue = 0) {
  const currentVal = Number(item.current_value || 0);
  const investedVal = Number(item.invested_value || 0);
  const weight = totalValue > 0 ? (currentVal / totalValue) * 100 : Number(item.allocation_pct || 0);

  return {
    srNo: index + 1,
    assetId: item.asset_id,
    name: item.name,
    quantity: Number(item.total_quantity || 0),
    price: Number(item.avg_price || 0),
    invested: investedVal,
    investedValue: investedVal,
    confidence: item.confidence || 'High',
    currentNAV: Number(item.current_price || 0),
    currentValue: currentVal,
    pnl: Number(item.return_pct || 0),
    returnPct: Number(item.return_pct || 0),
    returnAbs: Number(item.return_abs || 0),
    dayChange: Number(item.day_change_abs || 0),
    dayChangePercent: Number(item.day_change_pct || 0),
    weightage: Number(weight.toFixed(2)),
    fundCode: item.symbol || '',
    sipEnabled: Boolean(item.sip_enabled),
    sipDay: item.sip_day ? Number(item.sip_day) : null,
    sipAmount: item.sip_amount ? Number(item.sip_amount) : null,
    lastSipDate: item.last_sip_date || null
  };
}

function normalizeFD(item, index, totalValue = 0) {
  const principal = Number(item.invested_value || item.avg_price || 0);
  const curVal = Number(item.current_value || principal);
  const retAbs = Number(item.return_abs || (curVal - principal));
  const retPct = principal > 0 ? (retAbs / principal) * 100 : 0;
  const weight = totalValue > 0 ? (curVal / totalValue) * 100 : 0;

  return {
    assetType: "fds",
    srNo: index + 1,
    assetId: item.asset_id,
    name: item.name || 'Bank FD',
    bankName: item.name || 'Bank FD',
    principal: principal,
    interestRate: Number(item.fd_rate || 7.0),
    startDate: item.start_date || '',
    maturityDate: item.maturity_date || '',
    currentValue: curVal,
    maturityValue: curVal + Math.max(0, retAbs),
    interestEarned: Math.max(0, retAbs),
    returns: retAbs,
    returnPercent: retPct,
    weightage: Number(weight.toFixed(2))
  };
}

function normalizeWatchlistItem(item) {
  const curPrice = Number(item.current_price ?? item.added_price ?? 0);
  const addedPrice = Number(item.added_price ?? 0);
  const prevClose = Number(item.prev_close ?? curPrice);
  const retPct = Number(item.return_since_added_pct ?? (addedPrice > 0 ? ((curPrice - addedPrice) / addedPrice) * 100 : 0));
  const retAbs = Number(item.return_since_added_abs ?? (curPrice - addedPrice));
  const dayPct = Number(item.day_change_pct ?? (prevClose > 0 ? ((curPrice - prevClose) / prevClose) * 100 : 0));
  const dayAbs = Number(item.day_change_abs ?? (curPrice - prevClose));

  return {
    watchlistId: item.watchlist_id,
    symbol: item.symbol,
    isin: item.isin || '',
    name: item.name || item.symbol,
    sector: item.sector || '',
    confidence: item.confidence || 'Medium',
    badge: item.badge || 'Trade',
    addedPrice,
    targetPrice: item.target_price != null ? Number(item.target_price) : null,
    notes: item.notes || '',
    addedAt: item.added_at,
    currentPrice: curPrice,
    prevClose,
    returnSinceAddedPct: retPct,
    returnSinceAddedAbs: retAbs,
    dayChangePercent: dayPct,
    dayChangeAbs: dayAbs,
    inPortfolio: Boolean(item.in_portfolio)
  };
}

function normalizePaperHolding(item, index) {
  const curVal = Number(item.current_value || 0);
  const invVal = Number(item.invested_value || 0);
  const retAbs = Number(item.return_abs ?? (curVal - invVal));
  const retPct = Number(item.return_pct ?? (invVal > 0 ? (retAbs / invVal) * 100 : 0));
  const dayAbs = Number(item.day_change_abs || 0);
  const dayPct = Number(item.day_change_pct || 0);

  return {
    srNo: index + 1,
    assetId: item.asset_id,
    symbol: item.symbol,
    name: item.name || item.symbol,
    sector: item.sector || '',
    confidence: item.confidence || 'Medium',
    badge: item.badge || item.trade_type || 'Trade',
    quantity: Number(item.total_quantity || 0),
    buyPrice: Number(item.avg_price || 0),
    investedValue: invVal,
    currentPrice: Number(item.current_price ?? item.avg_price ?? 0),
    prevClose: Number(item.prev_close ?? item.current_price ?? item.avg_price ?? 0),
    currentValue: curVal,
    returnAbs: retAbs,
    returnPct: retPct,
    dayChangeAbs: dayAbs,
    dayChangePercent: dayPct
  };
}

function normalizePaperSummary(item) {
  if (!item) {
    return {
      initialCapital: 5000000,
      currentCash: 5000000,
      realizedPnl: 0,
      totalInvested: 0,
      totalCurrent: 0,
      unrealizedPnl: 0,
      totalDayChange: 0,
      portfolioValue: 5000000,
      totalPnl: 0,
      totalPnlPct: 0
    };
  }

  const initCap = Number(item.initial_capital ?? 5000000);
  const cash = Number(item.current_cash ?? 5000000);
  const realPnl = Number(item.realized_pnl ?? 0);
  const totInv = Number(item.total_invested ?? 0);
  const totCur = Number(item.total_current ?? 0);
  const unrealPnl = Number(item.unrealized_pnl ?? (totCur - totInv));
  const dayChg = Number(item.total_day_change ?? 0);
  const portVal = Number(item.portfolio_value ?? (totCur + cash));
  const totPnl = Number(item.total_pnl ?? (unrealPnl + realPnl));
  const totPnlPct = Number(item.total_pnl_pct ?? (initCap > 0 ? (totPnl / initCap) * 100 : 0));

  return {
    initialCapital: initCap,
    currentCash: cash,
    realizedPnl: realPnl,
    totalInvested: totInv,
    totalCurrent: totCur,
    unrealizedPnl: unrealPnl,
    totalDayChange: dayChg,
    portfolioValue: portVal,
    totalPnl: totPnl,
    totalPnlPct: totPnlPct
  };
}

function normalizeIpo(item) {
  if (!item) return null;
  const priceNum = Number(item.price_num || 0);
  const lotSize = Number(item.lot_size || 1);
  const gmpAmount = Number(item.gmp_amount || 0);
  const gmpPercent = Number(item.gmp_percent || 0);
  const expectedProfit = gmpAmount * lotSize;
  const minInvestment = priceNum * lotSize;

  return {
    id: item.id,
    name: item.ipo_name,
    category: item.category || 'IPO',
    status: item.status || 'Upcoming',
    statusBadge: item.status_badge || item.status || 'Upcoming',
    gmpAmount,
    gmpPercent,
    gmpTrend: item.gmp_trend || '',
    ratingFlames: Number(item.rating_flames || 0),
    priceStr: item.price_str || String(priceNum),
    priceNum,
    ipoSize: item.ipo_size || 'N/A',
    lotSize,
    peRatio: item.pe_ratio || '--',
    subscription: item.subscription || '-',
    openDate: item.open_date || '',
    closeDate: item.close_date || '',
    boaDate: item.boa_date || '',
    listingDate: item.listing_date || '',
    sortOpen: item.sort_open || null,
    sortClose: item.sort_close || null,
    sortBoa: item.sort_boa || null,
    sortListing: item.sort_listing || null,
    updatedOn: item.updated_on_text || '',
    anchorAvailable: Boolean(item.anchor_available),
    investorGainUrl: item.investorgain_url || '',
    allotmentUrl: item.allotment_url || null,
    expectedProfit,
    minInvestment
  };
}

const requestCache = {};
function dedupeRequest(key, fetcher) {
  if (!requestCache[key]) {
    requestCache[key] = fetcher().finally(() => {
      // Clear cache shortly after it resolves so subsequent refreshAll calls hit the network again
      setTimeout(() => { delete requestCache[key]; }, 50);
    });
  }
  return requestCache[key];
}

export const supabaseApi = {
  // -----------------------------------------
  // Asset Holdings APIs
  // -----------------------------------------
  getStocks: () => dedupeRequest('STOCK', async () => {
    const { data, error } = await supabase
      .from('vw_holdings')
      .select('*')
      .eq('asset_type', 'STOCK')
      .order('current_value', { ascending: false });

    if (error) throw error;
    const totalVal = (data || []).reduce((acc, x) => acc + Number(x.current_value || 0), 0);
    return (data || []).map((s, idx) => normalizeStock(s, idx, totalVal));
  }),

  getEtfs: () => dedupeRequest('ETF', async () => {
    const { data, error } = await supabase
      .from('vw_holdings')
      .select('*')
      .eq('asset_type', 'ETF')
      .order('current_value', { ascending: false });

    if (error) throw error;
    const totalVal = (data || []).reduce((acc, x) => acc + Number(x.current_value || 0), 0);
    return (data || []).map((e, idx) => normalizeETF(e, idx, totalVal));
  }),

  getMutualFunds: () => dedupeRequest('MF', async () => {
    const { data, error } = await supabase
      .from('vw_holdings')
      .select('*')
      .eq('asset_type', 'MF')
      .order('current_value', { ascending: false });

    if (error) throw error;
    const totalVal = (data || []).reduce((acc, x) => acc + Number(x.current_value || 0), 0);
    return (data || []).map((m, idx) => normalizeMF(m, idx, totalVal));
  }),

  getFDs: () => dedupeRequest('FD', async () => {
    const { data, error } = await supabase
      .from('vw_holdings')
      .select('*')
      .eq('asset_type', 'FD');

    if (error) throw error;
    
    // Note: for FDs the view calculates current_value dynamically based on principal and rate
    const totalVal = (data || []).reduce((acc, x) => acc + Number(x.current_value || x.avg_price || 0), 0);
    return (data || []).map((f, idx) => normalizeFD(f, idx, totalVal));
  }),

  // -----------------------------------------
  // Summary & Allocation APIs
  // -----------------------------------------
  getOverallInvestments: async (prefetchedData) => {
    let s, e, m, f;
    if (prefetchedData) {
      [s, e, m, f] = prefetchedData;
    } else {
      [s, e, m, f] = await Promise.all([
        supabaseApi.getStocks(),
        supabaseApi.getEtfs(),
        supabaseApi.getMutualFunds(),
        supabaseApi.getFDs()
      ]);
    }

    const sumInvested = (arr, valKey = 'invested') => arr.reduce((acc, x) => acc + Number(x[valKey] || 0), 0);
    const sumCurrent = (arr, valKey = 'currentValue') => arr.reduce((acc, x) => acc + Number(x[valKey] || 0), 0);

    const sInv = sumInvested(s);
    const sCur = sumCurrent(s);
    const sPnl = sCur - sInv;

    const eInv = sumInvested(e);
    const eCur = sumCurrent(e);
    const ePnl = eCur - eInv;

    const mInv = sumInvested(m);
    const mCur = sumCurrent(m);
    const mPnl = mCur - mInv;

    const fInv = sumInvested(f, 'principal');
    const fCur = sumCurrent(f);
    const fPnl = fCur - fInv;

    const totalInv = sInv + eInv + mInv + fInv;
    const totalCur = sCur + eCur + mCur + fCur;
    const totalPnl = totalCur - totalInv;

    return [
      { 
        assetClass: "Stocks", 
        invested: Number(sInv.toFixed(2)), 
        current: Number(sCur.toFixed(2)), 
        profit: Number(sPnl.toFixed(2)), 
        returnPercentage: Number((sInv > 0 ? (sPnl / sInv) * 100 : 0).toFixed(2)), 
        weightage: Number((totalCur > 0 ? (sCur / totalCur) * 100 : 0).toFixed(2)) 
      },
      { 
        assetClass: "Mutual Funds", 
        invested: Number(mInv.toFixed(2)), 
        current: Number(mCur.toFixed(2)), 
        profit: Number(mPnl.toFixed(2)), 
        returnPercentage: Number((mInv > 0 ? (mPnl / mInv) * 100 : 0).toFixed(2)), 
        weightage: Number((totalCur > 0 ? (mCur / totalCur) * 100 : 0).toFixed(2)) 
      },
      { 
        assetClass: "ETFs", 
        invested: Number(eInv.toFixed(2)), 
        current: Number(eCur.toFixed(2)), 
        profit: Number(ePnl.toFixed(2)), 
        returnPercentage: Number((eInv > 0 ? (ePnl / eInv) * 100 : 0).toFixed(2)), 
        weightage: Number((totalCur > 0 ? (eCur / totalCur) * 100 : 0).toFixed(2)) 
      },
      { 
        assetClass: "Fixed Deposits", 
        invested: Number(fInv.toFixed(2)), 
        current: Number(fCur.toFixed(2)), 
        profit: Number(fPnl.toFixed(2)), 
        returnPercentage: Number((fInv > 0 ? (fPnl / fInv) * 100 : 0).toFixed(2)), 
        weightage: Number((totalCur > 0 ? (fCur / totalCur) * 100 : 0).toFixed(2)) 
      },
      { 
        assetClass: "Total", 
        invested: Number(totalInv.toFixed(2)), 
        current: Number(totalCur.toFixed(2)), 
        profit: Number(totalPnl.toFixed(2)), 
        returnPercentage: Number((totalInv > 0 ? (totalPnl / totalInv) * 100 : 0).toFixed(2)), 
        weightage: 100 
      }
    ];
  },

  getAssetAllocation: async (prefetchedData) => {
    let s, e, m, f;
    if (prefetchedData) {
      [s, e, m, f] = prefetchedData;
    } else {
      [s, e, m, f] = await Promise.all([
        supabaseApi.getStocks(),
        supabaseApi.getEtfs(),
        supabaseApi.getMutualFunds(),
        supabaseApi.getFDs()
      ]);
    }

    const sumCurrent = (arr, valKey = 'currentValue') => arr.reduce((acc, x) => acc + Number(x[valKey] || 0), 0);
    const sCur = sumCurrent(s);
    const eCur = sumCurrent(e);
    const mCur = sumCurrent(m);
    const fCur = sumCurrent(f, 'principal');

    const totalEquity = Number((sCur + eCur + mCur).toFixed(2));
    const totalCashDebt = Number(fCur.toFixed(2));
    const total = Number((totalEquity + totalCashDebt).toFixed(2));

    return [
      { asset: 'Equity', allocation: totalEquity },
      { asset: 'FD', allocation: totalCashDebt },
      { asset: 'Cash', allocation: 0 },
      { asset: 'Total', allocation: total }
    ];
  },

  getOverallSectorAllocation: async () => {
    const { data, error } = await supabase
      .from('vw_global_sector_allocation')
      .select('*')
      .order('total_exposure', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(s => ({
        sector: s.sector_name,
        exposure: Number(Number(s.total_exposure || 0).toFixed(2)),
        allocation: Number(Number(s.allocation_pct || 0).toFixed(2))
      }));
    }

    // Direct fallback from stocks
    const stocks = await supabaseApi.getStocks();
    const sectorMap = {};
    let total = 0;
    stocks.forEach(s => {
      const sec = s.sector || 'Other';
      const cur = s.currentValue || 0;
      sectorMap[sec] = (sectorMap[sec] || 0) + cur;
      total += cur;
    });

    return Object.entries(sectorMap).map(([sector, exposure]) => ({
      sector,
      exposure: Number(exposure.toFixed(2)),
      allocation: Number((total > 0 ? (exposure / total) * 100 : 0).toFixed(2))
    })).sort((a, b) => b.exposure - a.exposure);
  },

  getStocksAllocation: async () => {
    // Try the combined view first (direct stocks + ETF/MF indirect exposure)
    const { data, error } = await supabase
      .from('vw_global_stock_allocation')
      .select('*')
      .order('total_exposure', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(s => ({
        name: s.stock_name,
        exposure: Number(Number(s.total_exposure || 0).toFixed(2)),
        allocation: Number(Number(s.allocation_pct || 0).toFixed(2))
      }));
    }

    // Fallback: direct stocks only
    const stocks = await supabaseApi.getStocks();
    const totalCur = stocks.reduce((acc, x) => acc + (x.currentValue || 0), 0);
    return stocks.map(s => ({
      name: s.name,
      exposure: Number((s.currentValue || 0).toFixed(2)),
      allocation: totalCur > 0 ? Number(((s.currentValue / totalCur) * 100).toFixed(2)) : 0
    })).sort((a, b) => b.exposure - a.exposure);
  },


  // -----------------------------------------
  // Dashboard Combined API (Required by DashboardPage)
  // -----------------------------------------
  getDashboard: async () => {
    const [overallSectorAllocation, stocksAllocation, s, e, m, f] = await Promise.all([
      supabaseApi.getOverallSectorAllocation(),
      supabaseApi.getStocksAllocation(),
      supabaseApi.getStocks(),
      supabaseApi.getEtfs(),
      supabaseApi.getMutualFunds(),
      supabaseApi.getFDs()
    ]);

    const prefetched = [s, e, m, f];
    const overallInvestments = await supabaseApi.getOverallInvestments(prefetched);
    const assetAllocation = await supabaseApi.getAssetAllocation(prefetched);

    const sumDayChange = (arr) => arr.reduce((acc, x) => acc + Number(x.dayChange || 0), 0);
    const sumCurrentVal = (arr, valKey = 'currentValue') => arr.reduce((acc, x) => acc + Number(x[valKey] || 0), 0);
    const sumInvestedVal = (arr, valKey = 'invested') => arr.reduce((acc, x) => acc + Number(x[valKey] || 0), 0);

    const stocksGain = sumDayChange(s);
    const sCurVal = sumCurrentVal(s);
    const stocksGainPercent = (sCurVal - stocksGain) > 0 ? (stocksGain / (sCurVal - stocksGain)) * 100 : 0;

    const etfsGain = sumDayChange(e);
    const eCurVal = sumCurrentVal(e);
    const etfsGainPercent = (eCurVal - etfsGain) > 0 ? (etfsGain / (eCurVal - etfsGain)) * 100 : 0;

    const mutualFundsGain = sumDayChange(m);
    const mCurVal = sumCurrentVal(m);
    const mutualFundsGainPercent = (mCurVal - mutualFundsGain) > 0 ? (mutualFundsGain / (mCurVal - mutualFundsGain)) * 100 : 0;

    const totalGain = stocksGain + etfsGain + mutualFundsGain;
    const totalCurrentVal = sCurVal + eCurVal + mCurVal + sumCurrentVal(f, 'currentValue');
    const totalInvVal = sumInvestedVal(s) + sumInvestedVal(e) + sumInvestedVal(m) + sumInvestedVal(f, 'principal');
    const gainPercent = (totalCurrentVal - totalGain) > 0 ? (totalGain / (totalCurrentVal - totalGain)) * 100 : 0;

    return {
      overallInvestments,
      assetAllocation,
      overallSectorAllocation,
      stocksAllocation,
      todayPerformance: {
        data: {
          gain: Number(totalGain.toFixed(2)),
          gainPercent: Number(gainPercent.toFixed(2)),
          stocksGain: Number(stocksGain.toFixed(2)),
          stocksGainPercent: Number(stocksGainPercent.toFixed(2)),
          etfsGain: Number(etfsGain.toFixed(2)),
          etfsGainPercent: Number(etfsGainPercent.toFixed(2)),
          mutualFundsGain: Number(mutualFundsGain.toFixed(2)),
          mutualFundsGainPercent: Number(mutualFundsGainPercent.toFixed(2)),
          totalCurrentValue: Number(totalCurrentVal.toFixed(2)),
          totalInvestedValue: Number(totalInvVal.toFixed(2))
        }
      }
    };
  },

  // -----------------------------------------
  // Combined Portfolio API (Required by PortfolioPage)
  // -----------------------------------------
  getPortfolio: async () => {
    const [stocks, etfs, mutualFunds, fds] = await Promise.all([
      supabaseApi.getStocks(),
      supabaseApi.getEtfs(),
      supabaseApi.getMutualFunds(),
      supabaseApi.getFDs()
    ]);

    return {
      stocks,
      etfs,
      mutualFunds,
      fds
    };
  },

  // -----------------------------------------
  // News APIs
  // -----------------------------------------
  getNews: async (limit) => {
    let query = supabase
      .from('news')
      .select('guid, title, source, category, published_at, url, is_read, assets(symbol, name)')
      .order('published_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(n => ({
      guid: n.guid,
      title: n.title,
      source: n.source,
      category: n.category,
      publishedAt: n.published_at,
      link: n.url,
      url: n.url,
      isRead: n.is_read,
      company: n.assets?.name || n.assets?.symbol || '',
      symbol: n.assets?.symbol || ''
    }));
  },

  getStockNews: async (symbol, limit) => {
    let query = supabase
      .from('news')
      .select('guid, title, source, category, published_at, url, is_read, assets!inner(symbol, name)')
      .ilike('assets.symbol', `%${symbol}%`)
      .order('published_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(n => ({
      guid: n.guid,
      title: n.title,
      source: n.source,
      category: n.category,
      publishedAt: n.published_at,
      link: n.url,
      url: n.url,
      isRead: n.is_read,
      company: n.assets?.name || n.assets?.symbol || symbol,
      symbol: n.assets?.symbol || symbol
    }));
  },

  // -----------------------------------------
  // Company Documents APIs
  // -----------------------------------------
  getCompanyDocuments: async (symbol) => {
    let query = supabase
      .from('company_documents')
      .select('attachment_id, symbol, scrip_code, company, announcement_date, announcement_time, reporting_period, document_type, title, original_title, pdf_url, attachment_name, retrieved_on, ai_summary_json, ai_status, ai_model, ai_generated_on')
      .order('announcement_date', { ascending: false });

    if (symbol) {
      const cleanSym = String(symbol).replace(/^(NSE:|BSE:)/i, '').replace(/(\.NS|\.BO)$/i, '');
      query = query.ilike('symbol', `%${cleanSym}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(doc => {
      const dateStr = doc.announcement_date || '';
      const timeStr = doc.announcement_time || '';

      return {
        attachmentId: doc.attachment_id,
        id: doc.attachment_id,
        symbol: doc.symbol || symbol,
        company: doc.company || '',
        scripCode: doc.scrip_code || '',
        title: doc.title,
        headline: doc.title,
        originalTitle: doc.original_title || doc.title,
        documentType: doc.document_type,
        category: doc.document_type,
        reportingPeriod: doc.reporting_period,
        pdfUrl: doc.pdf_url,
        announcementDate: dateStr,
        announcementTime: timeStr,
        date: dateStr,
        aiSummary: doc.ai_summary_json,
        aiStatus: doc.ai_status,
        analysis: doc.ai_summary_json || {}
      };
    });
  },

  summarizeDocument: async (documentId) => {
    const { data, error } = await supabase.functions.invoke('generate-ai-summary', {
      body: { documentId }
    });
    if (error) throw error;
    return data;
  },

  sendVoiceQuery: async (query) => {
    const { data, error } = await supabase.functions.invoke('process-voice-query', {
      body: { query }
    });
    if (error) throw error;
    return data;
  },

  markNewsRead: async (guid) => {
    const { data, error } = await supabase
      .from('news')
      .update({ is_read: true })
      .eq('guid', guid)
      .select();
    if (error) throw error;
    return data;
  },

  // -----------------------------------------
  // Fund Holdings & Analysis APIs
  // -----------------------------------------
  getFundHoldings: async (fundCode) => {
    const { data, error } = await supabase
      .from('fund_holdings')
      .select('holding_type, holding_name, weight_percentage, assets!inner(symbol)')
      .eq('assets.symbol', fundCode);

    if (error) throw error;

    const sectors = [];
    const stocks = [];

    (data || []).forEach(h => {
      if (h.holding_type === 'SECTOR') {
        sectors.push({ sector: h.holding_name, weight: Number(h.weight_percentage) });
      } else if (h.holding_type === 'STOCK') {
        stocks.push({ stock: h.holding_name, weight: Number(h.weight_percentage) });
      }
    });

    return { sectors, stocks };
  },

  // -----------------------------------------
  // Mutations via Edge Function (execute-trade)
  // -----------------------------------------
  executeTrade: async (payload) => {
    const { data, error } = await supabase.functions.invoke('execute-trade', {
      body: payload
    });
    if (error) throw error;
    return data;
  },

  buyMore: async (payload) => {
    return supabaseApi.executeTrade({ action: 'buyMore', ...payload });
  },

  updateHolding: async (payload) => {
    return supabaseApi.executeTrade({ action: 'updateHolding', ...payload });
  },

  sellHolding: async (payload) => {
    return supabaseApi.executeTrade({ action: 'sellHolding', ...payload });
  },

  addHolding: async (payload) => {
    return supabaseApi.executeTrade({ action: 'addHolding', ...payload });
  },

  updateFD: async (payload) => {
    return supabaseApi.executeTrade({ action: 'updateFD', ...payload });
  },

  deleteFD: async (payload) => {
    return supabaseApi.executeTrade({ action: 'deleteFD', ...payload });
  },

  // -----------------------------------------
  // Master NSE Stocks Search API
  // -----------------------------------------
  searchNseStocks: async (query) => {
    if (!query || !query.trim()) return [];
    const trimmed = query.trim();
    const { data, error } = await supabase
      .from('nse_stocks')
      .select('symbol, name, isin, sector, series')
      .or(`symbol.ilike.%${trimmed}%,name.ilike.%${trimmed}%,isin.ilike.%${trimmed}%`)
      .limit(15);

    if (error) {
      console.warn('[Supabase] searchNseStocks error:', error);
      return [];
    }

    return (data || []).map(item => ({
      symbol: item.symbol,
      name: item.name,
      isin: item.isin,
      sector: item.sector || '',
      series: item.series || 'EQ'
    }));
  },

  // -----------------------------------------
  // Watchlist APIs
  // -----------------------------------------
  getWatchlist: () => dedupeRequest('WATCHLIST', async () => {
    const { data, error } = await supabase
      .from('vw_watchlist')
      .select('*')
      .order('added_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(normalizeWatchlistItem);
  }),

  addWatchlistItem: async (payload) => {
    return supabaseApi.executeTrade({ action: 'addWatchlistItem', ...payload });
  },

  removeWatchlistItem: async (payload) => {
    return supabaseApi.executeTrade({ action: 'removeWatchlistItem', ...payload });
  },

  // -----------------------------------------
  // Paper Trading APIs
  // -----------------------------------------
  getPaperPortfolio: () => dedupeRequest('PAPER_PORTFOLIO', async () => {
    const [{ data: summaryData, error: summaryErr }, { data: holdingsData, error: holdingsErr }] = await Promise.all([
      supabase.from('vw_paper_summary').select('*').maybeSingle(),
      supabase.from('vw_paper_holdings').select('*').order('current_value', { ascending: false })
    ]);

    if (summaryErr) console.warn('[Supabase] paper summary view error:', summaryErr);
    if (holdingsErr) console.warn('[Supabase] paper holdings view error:', holdingsErr);

    const summary = normalizePaperSummary(summaryData);
    const holdings = (holdingsData || []).map(normalizePaperHolding);

    return { summary, holdings };
  }),

  addPaperHolding: async (payload) => {
    return supabaseApi.executeTrade({ action: 'addPaperHolding', ...payload });
  },

  sellPaperHolding: async (payload) => {
    return supabaseApi.executeTrade({ action: 'sellPaperHolding', ...payload });
  },

  updatePaperCapital: async (payload) => {
    return supabaseApi.executeTrade({ action: 'updatePaperCapital', ...payload });
  },

  resetPaperPortfolio: async () => {
    return supabaseApi.executeTrade({ action: 'resetPaperPortfolio' });
  },

  // -----------------------------------------
  // Mainboard IPO APIs
  // -----------------------------------------
  getIpos: () => dedupeRequest('IPOS', async () => {
    const { data, error } = await supabase
      .from('mainboard_ipos')
      .select('*')
      .order('sort_close', { ascending: true, nullsFirst: false });

    if (error) throw error;
    return (data || []).map(normalizeIpo);
  }),

  getIpoById: async (id) => {
    if (!id) return null;
    const { data, error } = await supabase
      .from('mainboard_ipos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return normalizeIpo(data);
  }
};
