/**
 * Mock API Client
 * 
 * Returns mock data with artificial delay to simulate network latency.
 * Updates local in-memory arrays so additions/edits persist during the session.
 */

import stocksData from './mockData/stocks.json';
import etfsData from './mockData/etfs.json';
import mutualfundsData from './mockData/mutualfunds.json';
import fdsData from './mockData/fds.json';

// In-memory data store initialized from JSON files
let stocks = [...stocksData];
let etfs = [...etfsData];
let mutualFunds = [...mutualfundsData];
let fds = [...fdsData];

let mockNseStocks = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', isin: 'INE002A01018', sector: 'Energy', series: 'EQ' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', isin: 'INE467B01029', sector: 'Technology', series: 'EQ' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', isin: 'INE040A01034', sector: 'Financial Services', series: 'EQ' },
  { symbol: 'INFY', name: 'Infosys Ltd', isin: 'INE009A01021', sector: 'Technology', series: 'EQ' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', isin: 'INE090A01021', sector: 'Financial Services', series: 'EQ' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', isin: 'INE155A01022', sector: 'Automobile and Auto Components', series: 'EQ' },
  { symbol: 'ITC', name: 'ITC Ltd', isin: 'INE154A01025', sector: 'Fast Moving Consumer Goods', series: 'EQ' },
  { symbol: 'SBIN', name: 'State Bank of India', isin: 'INE062A01020', sector: 'Financial Services', series: 'EQ' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', isin: 'INE397D01024', sector: 'Telecommunication', series: 'EQ' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', isin: 'INE018A01030', sector: 'Construction', series: 'EQ' }
];

let mockWatchlist = [
  {
    watchlistId: 'mock-wl-1',
    symbol: 'TATAMOTORS',
    isin: 'INE155A01022',
    name: 'Tata Motors Ltd',
    sector: 'Automobile and Auto Components',
    confidence: 'High',
    badge: 'Trade',
    addedPrice: 980.00,
    targetPrice: 1150.00,
    notes: 'Electric vehicle market share expansion',
    addedAt: '2026-08-01T10:00:00.000Z',
    currentPrice: 1020.50,
    prevClose: 1005.00,
    returnSinceAddedPct: 4.13,
    returnSinceAddedAbs: 40.50,
    dayChangePercent: 1.54,
    dayChangeAbs: 15.50,
    inPortfolio: true
  },
  {
    watchlistId: 'mock-wl-2',
    symbol: 'BHARTIARTL',
    isin: 'INE397D01024',
    name: 'Bharti Airtel Ltd',
    sector: 'Telecommunication',
    confidence: 'Medium',
    badge: 'Longterm',
    addedPrice: 1450.00,
    targetPrice: 1650.00,
    notes: 'ARPU growth and 5G monetization',
    addedAt: '2026-08-10T12:00:00.000Z',
    currentPrice: 1510.00,
    prevClose: 1495.00,
    returnSinceAddedPct: 4.14,
    returnSinceAddedAbs: 60.00,
    dayChangePercent: 1.00,
    dayChangeAbs: 15.00,
    inPortfolio: false
  }
];

let mockPaperConfig = {
  initialCapital: 5000000,
  currentCash: 4500000,
  realizedPnl: 25000
};

let mockPaperHoldings = [
  {
    srNo: 1,
    assetId: 'mock-paper-1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    sector: 'Energy',
    confidence: 'Very High',
    badge: 'Longterm',
    quantity: 100,
    buyPrice: 2850.00,
    investedValue: 285000.00,
    currentPrice: 2980.00,
    prevClose: 2950.00,
    currentValue: 298000.00,
    returnAbs: 13000.00,
    returnPct: 4.56,
    dayChangeAbs: 3000.00,
    dayChangePercent: 1.02
  },
  {
    srNo: 2,
    assetId: 'mock-paper-2',
    symbol: 'INFY',
    name: 'Infosys Ltd',
    sector: 'Technology',
    confidence: 'High',
    badge: 'Trade',
    quantity: 150,
    buyPrice: 1420.00,
    investedValue: 213000.00,
    currentPrice: 1465.00,
    prevClose: 1450.00,
    currentValue: 219750.00,
    returnAbs: 6750.00,
    returnPct: 3.17,
    dayChangeAbs: 2250.00,
    dayChangePercent: 1.03
  }
];

let mockIpos = [
  {
    id: 101,
    name: 'Premier Energies Ltd',
    category: 'IPO',
    status: 'Open',
    statusBadge: 'Open',
    gmpAmount: 425,
    gmpPercent: 94.44,
    gmpTrend: '400 - 450',
    ratingFlames: 5,
    priceStr: '450',
    priceNum: 450,
    ipoSize: '₹2,830 Cr',
    lotSize: 33,
    peRatio: '24.5',
    subscription: '15.2x',
    openDate: '27 Aug 2026',
    closeDate: '29 Aug 2026',
    boaDate: '30 Aug 2026',
    listingDate: '03 Sep 2026',
    sortOpen: '2026-08-27',
    sortClose: '2026-08-29',
    sortBoa: '2026-08-30',
    sortListing: '2026-09-03',
    updatedOn: '28 Aug 2026, 17:30',
    anchorAvailable: true,
    investorGainUrl: 'https://www.investorgain.com',
    allotmentUrl: null,
    expectedProfit: 14025,
    minInvestment: 14850
  },
  {
    id: 102,
    name: 'Bajaj Housing Finance Ltd',
    category: 'IPO',
    status: 'Upcoming',
    statusBadge: 'Upcoming',
    gmpAmount: 65,
    gmpPercent: 92.86,
    gmpTrend: '60 - 70',
    ratingFlames: 5,
    priceStr: '70',
    priceNum: 70,
    ipoSize: '₹6,560 Cr',
    lotSize: 214,
    peRatio: '18.2',
    subscription: '-',
    openDate: '09 Sep 2026',
    closeDate: '11 Sep 2026',
    boaDate: '12 Sep 2026',
    listingDate: '16 Sep 2026',
    sortOpen: '2026-09-09',
    sortClose: '2026-09-11',
    sortBoa: '2026-09-12',
    sortListing: '2026-09-16',
    updatedOn: '28 Aug 2026, 18:00',
    anchorAvailable: true,
    investorGainUrl: 'https://www.investorgain.com',
    allotmentUrl: null,
    expectedProfit: 13910,
    minInvestment: 14980
  },
  {
    id: 103,
    name: 'Unicommerce eSolutions Ltd',
    category: 'IPO',
    status: 'Listed',
    statusBadge: 'L@235',
    gmpAmount: 110,
    gmpPercent: 101.85,
    gmpTrend: '100 - 115',
    ratingFlames: 4,
    priceStr: '108',
    priceNum: 108,
    ipoSize: '₹276 Cr',
    lotSize: 138,
    peRatio: '32.1',
    subscription: '168.3x',
    openDate: '06 Aug 2026',
    closeDate: '08 Aug 2026',
    boaDate: '09 Aug 2026',
    listingDate: '13 Aug 2026',
    sortOpen: '2026-08-06',
    sortClose: '2026-08-08',
    sortBoa: '2026-08-09',
    sortListing: '2026-08-13',
    updatedOn: '13 Aug 2026, 10:00',
    anchorAvailable: true,
    investorGainUrl: 'https://www.investorgain.com',
    allotmentUrl: 'https://linkintime.co.in',
    expectedProfit: 15180,
    minInvestment: 14904
  }
];

// ── Mock News Data ─────────────────────────────────────────────────────────────
const MOCK_NEWS = [
  {
    guid: 'mock-news-001',
    symbol: 'HDFCBANK',
    company: 'HDFC Bank',
    title: 'HDFC Bank Penalizes MD, CFO in MSRDC Case',
    source: 'Rediff MoneyWiz',
    publishedAt: '2026-07-27T14:32:18',
    publishedDate: '2026-07-27',
    publishedTime: '14:32:18',
    link: 'https://economictimes.indiatimes.com/markets/stocks/news/hdfc-bank',
    retrievedAt: '2026-07-27T14:35:07',
    retrievedDate: '2026-07-27',
    retrievedTime: '14:35:07',
    isRead: false,
    category: 'Regulatory',
  },
  {
    guid: 'mock-news-002',
    symbol: 'HDFCBANK',
    company: 'HDFC Bank',
    title: 'HDFC Bank Q1 FY27 Net Profit Rises 12% YoY to ₹17,200 Crore',
    source: 'Mint',
    publishedAt: '2026-07-26T10:15:00',
    publishedDate: '2026-07-26',
    publishedTime: '10:15:00',
    link: 'https://livemint.com/market/stock-market-news/hdfc-bank-q1',
    retrievedAt: '2026-07-26T10:20:00',
    retrievedDate: '2026-07-26',
    retrievedTime: '10:20:00',
    isRead: true,
    category: 'Earnings',
  },
  {
    guid: 'mock-news-003',
    symbol: 'TCS',
    company: 'Tata Consultancy Services',
    title: 'TCS Bags $1.5 Billion Deal from European Banking Consortium',
    source: 'Economic Times',
    publishedAt: '2026-07-27T11:45:00',
    publishedDate: '2026-07-27',
    publishedTime: '11:45:00',
    link: 'https://economictimes.indiatimes.com/tech/tcs-deal',
    retrievedAt: '2026-07-27T11:50:00',
    retrievedDate: '2026-07-27',
    retrievedTime: '11:50:00',
    isRead: false,
    category: 'Deal',
  },
  {
    guid: 'mock-news-004',
    symbol: 'TCS',
    company: 'Tata Consultancy Services',
    title: 'TCS Hiring 40,000 Freshers in FY27; Campus Recruitment Drive Begins',
    source: 'Business Standard',
    publishedAt: '2026-07-25T09:00:00',
    publishedDate: '2026-07-25',
    publishedTime: '09:00:00',
    link: 'https://business-standard.com/companies/news/tcs-hiring',
    retrievedAt: '2026-07-25T09:05:00',
    retrievedDate: '2026-07-25',
    retrievedTime: '09:05:00',
    isRead: true,
    category: 'HR',
  },
  {
    guid: 'mock-news-005',
    symbol: 'RELIANCE',
    company: 'Reliance Industries',
    title: 'Reliance Jio Launches 6G Trials in Mumbai, Delhi and Bengaluru',
    source: 'NDTV Profit',
    publishedAt: '2026-07-27T08:30:00',
    publishedDate: '2026-07-27',
    publishedTime: '08:30:00',
    link: 'https://ndtvprofit.com/business/reliance-jio-6g',
    retrievedAt: '2026-07-27T08:35:00',
    retrievedDate: '2026-07-27',
    retrievedTime: '08:35:00',
    isRead: false,
    category: 'Technology',
  },
  {
    guid: 'mock-news-006',
    symbol: 'RELIANCE',
    company: 'Reliance Industries',
    title: 'Reliance Retail Posts Record Revenue of ₹3.2 Lakh Crore in FY27',
    source: 'Moneycontrol',
    publishedAt: '2026-07-24T16:00:00',
    publishedDate: '2026-07-24',
    publishedTime: '16:00:00',
    link: 'https://moneycontrol.com/news/business/reliance-retail',
    retrievedAt: '2026-07-24T16:05:00',
    retrievedDate: '2026-07-24',
    retrievedTime: '16:05:00',
    isRead: true,
    category: 'Earnings',
  },
  {
    guid: 'mock-news-007',
    symbol: 'INFY',
    company: 'Infosys',
    title: 'Infosys Raises FY27 Revenue Guidance to 8-10% in Constant Currency',
    source: 'Reuters India',
    publishedAt: '2026-07-27T13:00:00',
    publishedDate: '2026-07-27',
    publishedTime: '13:00:00',
    link: 'https://reuters.com/business/infosys-guidance',
    retrievedAt: '2026-07-27T13:05:00',
    retrievedDate: '2026-07-27',
    retrievedTime: '13:05:00',
    isRead: false,
    category: 'Guidance',
  },
  {
    guid: 'mock-news-008',
    symbol: 'WIPRO',
    company: 'Wipro',
    title: 'Wipro Acquires AI Startup Neuron Labs for $280 Million',
    source: 'Financial Express',
    publishedAt: '2026-07-26T14:20:00',
    publishedDate: '2026-07-26',
    publishedTime: '14:20:00',
    link: 'https://financialexpress.com/market/wipro-acquisition',
    retrievedAt: '2026-07-26T14:25:00',
    retrievedDate: '2026-07-26',
    retrievedTime: '14:25:00',
    isRead: false,
    category: 'Acquisition',
  },
  {
    guid: 'mock-news-009',
    symbol: 'ICICIBANK',
    company: 'ICICI Bank',
    title: 'ICICI Bank Expands Digital Lending Platform; Eyes 20 Million New Customers',
    source: 'The Hindu BusinessLine',
    publishedAt: '2026-07-27T09:45:00',
    publishedDate: '2026-07-27',
    publishedTime: '09:45:00',
    link: 'https://thehindubusinessline.com/icici-bank-digital',
    retrievedAt: '2026-07-27T09:50:00',
    retrievedDate: '2026-07-27',
    retrievedTime: '09:50:00',
    isRead: false,
    category: '',
  },
  {
    guid: 'mock-news-010',
    symbol: 'AXISBANK',
    company: 'Axis Bank',
    title: 'Axis Bank to Raise ₹12,000 Crore Via QIP; Board Approves Resolution',
    source: 'Mint',
    publishedAt: '2026-07-26T17:30:00',
    publishedDate: '2026-07-26',
    publishedTime: '17:30:00',
    link: 'https://livemint.com/market/axis-bank-qip',
    retrievedAt: '2026-07-26T17:35:00',
    retrievedDate: '2026-07-26',
    retrievedTime: '17:35:00',
    isRead: true,
    category: 'Capital',
  },
  {
    guid: 'mock-news-011',
    symbol: 'SBIN',
    company: 'State Bank of India',
    title: 'SBI to Launch Next-Gen UPI Platform with Real-Time Cross-Border Payments',
    source: 'ET Markets',
    publishedAt: '2026-07-27T07:00:00',
    publishedDate: '2026-07-27',
    publishedTime: '07:00:00',
    link: 'https://etmarkets.com/sbin-upi-platform',
    retrievedAt: '2026-07-27T07:05:00',
    retrievedDate: '2026-07-27',
    retrievedTime: '07:05:00',
    isRead: false,
    category: 'Technology',
  },
  {
    guid: 'mock-news-012',
    symbol: 'BAJFINANCE',
    company: 'Bajaj Finance',
    title: 'Bajaj Finance AUM Crosses ₹4 Lakh Crore; EMI Book Grows 28% YoY',
    source: 'CNBC-TV18',
    publishedAt: '2026-07-25T12:00:00',
    publishedDate: '2026-07-25',
    publishedTime: '12:00:00',
    link: 'https://cnbctv18.com/market/bajaj-finance-aum',
    retrievedAt: '2026-07-25T12:05:00',
    retrievedDate: '2026-07-25',
    retrievedTime: '12:05:00',
    isRead: true,
    category: 'Business',
  },
  {
    guid: 'mock-news-013',
    symbol: 'MARUTI',
    company: 'Maruti Suzuki India',
    title: 'Maruti Suzuki EVs to Hit Showrooms by Diwali 2026; Bookings Open Next Month',
    source: 'Auto Car India',
    publishedAt: '2026-07-23T10:00:00',
    publishedDate: '2026-07-23',
    publishedTime: '10:00:00',
    link: 'https://autocarindia.com/news/maruti-ev-launch',
    retrievedAt: '2026-07-23T10:05:00',
    retrievedDate: '2026-07-23',
    retrievedTime: '10:05:00',
    isRead: true,
    category: 'Product',
  },
  {
    guid: 'mock-news-014',
    symbol: 'TATAMOTORS',
    company: 'Tata Motors',
    title: 'Tata Motors JLR Delivers Record 1.2 Lakh Vehicles in Q1 FY27',
    source: 'Business Today',
    publishedAt: '2026-07-22T15:00:00',
    publishedDate: '2026-07-22',
    publishedTime: '15:00:00',
    link: 'https://businesstoday.in/tata-motors-jlr',
    retrievedAt: '2026-07-22T15:05:00',
    retrievedDate: '2026-07-22',
    retrievedTime: '15:05:00',
    isRead: true,
    category: 'Sales',
  },
  {
    guid: 'mock-news-015',
    symbol: 'HDFCBANK',
    company: 'HDFC Bank',
    title: 'HDFC Bank Unveils "SmartSave" - AI-Powered Savings Account for Gen-Z',
    source: 'Your Story',
    publishedAt: '2026-07-21T11:00:00',
    publishedDate: '2026-07-21',
    publishedTime: '11:00:00',
    link: 'https://yourstory.com/hdfc-bank-smartsave',
    retrievedAt: '2026-07-21T11:05:00',
    retrievedDate: '2026-07-21',
    retrievedTime: '11:05:00',
    isRead: true,
    category: 'Product',
  },
];

// ── Mock Company Documents Data ─────────────────────────────────────────────
const MOCK_DOCUMENTS = [
  // ── HDFCBANK quarterly results ──
  {
    attachmentId: 'hdfc-q1-fy27.pdf',
    symbol: 'HDFCBANK',
    company: 'HDFC Bank Ltd',
    announcementDate: '2026-07-18',
    announcementTime: '14:59:18',
    reportingPeriod: 'Q1 FY27',
    documentType: 'RESULTS',
    title: 'Unaudited Standalone And Consolidated Financial Results for Q1 FY2026-27',
    originalTitle: 'Unaudited Standalone And Consolidated Financial Results for Q1 FY2026-27',
    pdfUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachHis/hdfc-q1-fy27.pdf',
    attachmentName: 'HDFC Bank Q1 FY27 Financial Results.pdf',
    retrievedOn: '2026-07-18T15:30:00Z',
  },
  {
    attachmentId: 'hdfc-q1-fy27-pres.pdf',
    symbol: 'HDFCBANK',
    company: 'HDFC Bank Ltd',
    announcementDate: '2026-07-18',
    announcementTime: '16:00:00',
    reportingPeriod: 'Q1 FY27',
    documentType: 'PRESENTATION',
    title: 'Investor Presentation - Q1 FY 2026-27',
    originalTitle: 'Investor Presentation - Q1 FY 2026-27',
    pdfUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachHis/hdfc-q1-fy27-pres.pdf',
    attachmentName: 'HDFC Bank Q1 FY27 Investor Presentation.pdf',
    retrievedOn: '2026-07-18T16:15:00Z',
  },
  {
    attachmentId: 'hdfc-q1-fy27-trans.pdf',
    symbol: 'HDFCBANK',
    company: 'HDFC Bank Ltd',
    announcementDate: '2026-07-19',
    announcementTime: '11:00:00',
    reportingPeriod: 'Q1 FY27',
    documentType: 'TRANSCRIPT',
    title: 'Earnings Call Transcript - Q1 FY 2026-27',
    originalTitle: 'Earnings Call Transcript - Q1 FY 2026-27',
    pdfUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachHis/hdfc-q1-fy27-trans.pdf',
    attachmentName: 'HDFC Bank Q1 FY27 Earnings Call Transcript.pdf',
    retrievedOn: '2026-07-19T11:30:00Z',
  },
  {
    attachmentId: 'hdfc-q4-fy26.pdf',
    symbol: 'HDFCBANK',
    company: 'HDFC Bank Ltd',
    announcementDate: '2026-04-19',
    announcementTime: '15:30:00',
    reportingPeriod: 'Q4 FY26',
    documentType: 'RESULTS',
    title: 'Audited Standalone And Consolidated Financial Results for Q4 & FY2025-26',
    originalTitle: 'Audited Standalone And Consolidated Financial Results for Q4 & FY2025-26',
    pdfUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachHis/hdfc-q4-fy26.pdf',
    attachmentName: 'HDFC Bank Q4 FY26 Annual Results.pdf',
    retrievedOn: '2026-04-19T16:00:00Z',
  },
  {
    attachmentId: 'hdfc-q3-fy26.pdf',
    symbol: 'HDFCBANK',
    company: 'HDFC Bank Ltd',
    announcementDate: '2026-01-17',
    announcementTime: '14:00:00',
    reportingPeriod: 'Q3 FY26',
    documentType: 'RESULTS',
    title: 'Unaudited Standalone And Consolidated Financial Results for Q3 FY2025-26',
    originalTitle: 'Unaudited Standalone And Consolidated Financial Results for Q3 FY2025-26',
    pdfUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachHis/hdfc-q3-fy26.pdf',
    attachmentName: 'HDFC Bank Q3 FY26 Financial Results.pdf',
    retrievedOn: '2026-01-17T14:30:00Z',
  },
  {
    attachmentId: 'hdfc-q2-fy26.pdf',
    symbol: 'HDFCBANK',
    company: 'HDFC Bank Ltd',
    announcementDate: '2025-10-19',
    announcementTime: '15:00:00',
    reportingPeriod: 'Q2 FY26',
    documentType: 'RESULTS',
    title: 'Unaudited Standalone And Consolidated Financial Results for Q2 FY2025-26',
    originalTitle: 'Unaudited Standalone And Consolidated Financial Results for Q2 FY2025-26',
    pdfUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachHis/hdfc-q2-fy26.pdf',
    attachmentName: 'HDFC Bank Q2 FY26 Financial Results.pdf',
    retrievedOn: '2025-10-19T15:30:00Z',
  },
  // ── HDFCBANK other documents (blank reportingPeriod) ──
  {
    attachmentId: 'hdfc-agm-2026.pdf',
    symbol: 'HDFCBANK',
    company: 'HDFC Bank Ltd',
    announcementDate: '2026-06-15',
    announcementTime: '10:00:00',
    reportingPeriod: '',
    documentType: 'AGM',
    title: 'Notice of Annual General Meeting 2026',
    originalTitle: 'Notice of Annual General Meeting 2026',
    pdfUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachHis/hdfc-agm-2026.pdf',
    attachmentName: 'HDFC Bank AGM Notice 2026.pdf',
    retrievedOn: '2026-06-15T10:30:00Z',
  },
  {
    attachmentId: 'hdfc-annual-report-fy26.pdf',
    symbol: 'HDFCBANK',
    company: 'HDFC Bank Ltd',
    announcementDate: '2026-06-01',
    announcementTime: '09:00:00',
    reportingPeriod: 'FY26',
    documentType: 'ANNUAL_REPORT',
    title: 'Annual Report FY 2025-26',
    originalTitle: 'Annual Report FY 2025-26',
    pdfUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachHis/hdfc-annual-report-fy26.pdf',
    attachmentName: 'HDFC Bank Annual Report FY26.pdf',
    retrievedOn: '2026-06-01T09:30:00Z',
  },
  {
    attachmentId: 'hdfc-dividend-2026.pdf',
    symbol: 'HDFCBANK',
    company: 'HDFC Bank Ltd',
    announcementDate: '2026-05-10',
    announcementTime: '11:30:00',
    reportingPeriod: '',
    documentType: 'DIVIDEND',
    title: 'Dividend Declaration and Record Date Announcement',
    originalTitle: 'Dividend Declaration and Record Date Announcement',
    pdfUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachHis/hdfc-dividend-2026.pdf',
    attachmentName: 'HDFC Bank Dividend Announcement 2026.pdf',
    retrievedOn: '2026-05-10T12:00:00Z',
  },
  // ── TCS quarterly results ──
  {
    attachmentId: 'tcs-q1-fy27.pdf',
    symbol: 'TCS',
    company: 'Tata Consultancy Services Ltd',
    announcementDate: '2026-07-10',
    announcementTime: '15:45:00',
    reportingPeriod: 'Q1 FY27',
    documentType: 'RESULTS',
    title: 'Audited Standalone And Consolidated Financial Results for Q1 FY2026-27',
    originalTitle: 'Audited Standalone And Consolidated Financial Results for Q1 FY2026-27',
    pdfUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachHis/tcs-q1-fy27.pdf',
    attachmentName: 'TCS Q1 FY27 Financial Results.pdf',
    retrievedOn: '2026-07-10T16:00:00Z',
  },
  {
    attachmentId: 'tcs-q4-fy26.pdf',
    symbol: 'TCS',
    company: 'Tata Consultancy Services Ltd',
    announcementDate: '2026-04-09',
    announcementTime: '16:00:00',
    reportingPeriod: 'Q4 FY26',
    documentType: 'RESULTS',
    title: 'Audited Standalone And Consolidated Financial Results for Q4 & FY2025-26',
    originalTitle: 'Audited Standalone And Consolidated Financial Results for Q4 & FY2025-26',
    pdfUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachHis/tcs-q4-fy26.pdf',
    attachmentName: 'TCS Q4 FY26 Annual Results.pdf',
    retrievedOn: '2026-04-09T16:30:00Z',
  },
  {
    attachmentId: 'tcs-agm-2026.pdf',
    symbol: 'TCS',
    company: 'Tata Consultancy Services Ltd',
    announcementDate: '2026-06-20',
    announcementTime: '10:30:00',
    reportingPeriod: '',
    documentType: 'AGM',
    title: 'Notice of 31st Annual General Meeting',
    originalTitle: 'Notice of 31st Annual General Meeting',
    pdfUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachHis/tcs-agm-2026.pdf',
    attachmentName: 'TCS AGM Notice 2026.pdf',
    retrievedOn: '2026-06-20T11:00:00Z',
  },
];

const MOCK_DELAY_MS = 300;

async function mockFetch(endpoint, data) {
  console.warn(`[MOCK DATA] Using mock data for endpoint: ${endpoint}`);
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
  return data;
}

const realMockApi = {
  // Authentication
  login: async (password) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    return { token: "mock-session-token-12345" };
  },

  // Read endpoints
  getStocks: () => mockFetch('stocks', stocks.map(item => ({
    ...item,
    currentPrice: item.currentPrice ?? (item.currentValue && item.quantity ? item.currentValue / item.quantity : undefined),
    dayChange: item.dayChange ?? ((item.quantity * 0.15) * (item.name.length % 2 === 0 ? 1 : -1)),
    dayChangePercent: item.dayChangePercent ?? (item.name.length % 2 === 0 ? 0.75 : -0.35),
  }))),

  getEtfs: () => mockFetch('etfs', etfs.map(item => ({
    ...item,
    currentPrice: item.currentPrice ?? (item.currentValue && item.quantity ? item.currentValue / item.quantity : undefined),
    dayChange: item.dayChange ?? ((item.quantity * 0.08) * (item.name.length % 2 === 0 ? 1 : -1)),
    dayChangePercent: item.dayChangePercent ?? (item.name.length % 2 === 0 ? 0.54 : -0.19),
  }))),

  getMutualFunds: () => mockFetch('mutualFunds', mutualFunds.map(item => ({
    ...item,
    currentNAV: item.currentNAV ?? (item.currentValue && item.quantity ? item.currentValue / item.quantity : undefined),
    dayChange: item.dayChange ?? ((item.quantity * 0.12) * (item.name.length % 2 === 0 ? 1 : -1)),
    dayChangePercent: item.dayChangePercent ?? (item.name.length % 2 === 0 ? 0.88 : -0.42),
  }))),

  getFDs: () => mockFetch('fds', fds),

  // News API mocks
  getNews: async (limit) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    // Sort by publishedAt descending (latest first)
    const sorted = [...MOCK_NEWS].sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );
    return limit ? sorted.slice(0, limit) : sorted;
  },

  getStockNews: async (symbol, limit) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    const filtered = MOCK_NEWS.filter(
      (n) => n.symbol.toUpperCase() === String(symbol).toUpperCase()
    ).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return limit ? filtered.slice(0, limit) : filtered;
  },

  // Company Documents API
  getCompanyDocuments: async (symbol) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const results = MOCK_DOCUMENTS.filter(
      (d) => d.symbol.toUpperCase() === symbol.toUpperCase()
    ).sort((a, b) => {
      const dateCmp = (b.announcementDate || '').localeCompare(a.announcementDate || '');
      if (dateCmp !== 0) return dateCmp;
      return (b.announcementTime || '').localeCompare(a.announcementTime || '');
    });
    return { success: true, data: results };
  },

  // AI Summary API
  summarizeDocument: async (documentId) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      data: {
        cached: false,
        aiSummary: {
          announcementType: "Quarterly Results Update",
          marketImpact: "Neutral",
          summary: "The company reported steady growth in Q1 with revenue up by 15% YoY.",
          keyTakeaways: [
            "Revenue increased 15% YoY.",
            "Operating margin expanded by 50 bps.",
            "Management remains confident in H2 outlook."
          ],
          financialHighlights: [],
          importantNumbers: [
            "Net Profit: ₹4,500 Cr",
            "Revenue: ₹35,000 Cr",
            "EPS: ₹12.5"
          ],
          positives: ["Strong retail growth", "Stable asset quality"],
          negatives: ["Slight increase in operational costs"],
          risks: ["Macroeconomic headwinds", "Regulatory changes"],
          managementCommentary: "We are pleased with our performance this quarter despite macro challenges.",
          futureOutlook: "We expect momentum to continue into the next fiscal.",
          sentiment: "Positive"
        }
      }
    };
  },

  getOverallInvestments: async () => {
    console.warn('[MOCK DATA] Using mock data for endpoint: overallInvestments');
    const s = await realMockApi.getStocks();
    const e = await realMockApi.getEtfs();
    const m = await realMockApi.getMutualFunds();
    const f = await realMockApi.getFDs();

    const sumInvested = (arr, valKey = 'investedValue') => arr.reduce((acc, x) => acc + (x[valKey] ?? x.invested ?? x.principal ?? 0), 0);
    const sumCurrent = (arr, valKey = 'currentValue') => arr.reduce((acc, x) => acc + (x[valKey] ?? x.current ?? 0), 0);

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
      { assetClass: "Stocks", invested: sInv, current: sCur, profit: sPnl, returnPercentage: sInv > 0 ? (sPnl / sInv) * 100 : 0, weightage: totalCur > 0 ? (sCur / totalCur) * 100 : 0 },
      { assetClass: "Mutual Funds", invested: mInv, current: mCur, profit: mPnl, returnPercentage: mInv > 0 ? (mPnl / mInv) * 100 : 0, weightage: totalCur > 0 ? (mCur / totalCur) * 100 : 0 },
      { assetClass: "ETFs", invested: eInv, current: eCur, profit: ePnl, returnPercentage: eInv > 0 ? (ePnl / eInv) * 100 : 0, weightage: totalCur > 0 ? (eCur / totalCur) * 100 : 0 },
      { assetClass: "Fixed Deposits", invested: fInv, current: fCur, profit: fPnl, returnPercentage: fInv > 0 ? (fPnl / fInv) * 100 : 0, weightage: totalCur > 0 ? (fCur / totalCur) * 100 : 0 },
      { assetClass: "Total", invested: totalInv, current: totalCur, profit: totalPnl, returnPercentage: totalInv > 0 ? (totalPnl / totalInv) * 100 : 0, weightage: 100 }
    ];
  },

  getAssetAllocation: async () => {
    console.warn('[MOCK DATA] Using mock data for endpoint: assetAllocation');
    const s = await realMockApi.getStocks();
    const e = await realMockApi.getEtfs();
    const m = await realMockApi.getMutualFunds();
    const f = await realMockApi.getFDs();

    const sumCurrent = (arr) => arr.reduce((acc, x) => acc + (x.currentValue ?? x.current ?? 0), 0);

    const sCur = sumCurrent(s);
    const eCur = sumCurrent(e);
    const mCur = sumCurrent(m);
    const fCur = sumCurrent(f);

    const totalEquity = sCur + eCur + mCur;
    const totalCashDebt = fCur;

    return [
      { asset: "Equity", allocation: totalEquity },
      { asset: "FD", allocation: fCur },
      { asset: "Cash", allocation: 12500 },
      { asset: "Total", allocation: totalEquity + fCur + 12500 }
    ];
  },

  getOverallSectorAllocation: async () => {
    console.warn('[MOCK DATA] Using mock data for endpoint: overallSectorAllocation');
    const s = await realMockApi.getStocks();
    const all = s;

    const sectorExposure = {};
    let totalExposure = 0;

    all.forEach(x => {
      const sec = x.sector ?? 'Other';
      const cur = x.currentValue ?? 0;
      sectorExposure[sec] = (sectorExposure[sec] ?? 0) + cur;
      totalExposure += cur;
    });

    const result = Object.entries(sectorExposure).map(([sector, exposure]) => ({
      sector,
      exposure,
      allocation: totalExposure > 0 ? (exposure / totalExposure) * 100 : 0
    }));

    return result.sort((a, b) => b.exposure - a.exposure).slice(0, 5);
  },

  getStocksAllocation: async () => {
    console.warn('[MOCK DATA] Using mock data for endpoint: stocksAllocation');
    const s = await realMockApi.getStocks();
    const totalCur = s.reduce((acc, x) => acc + (x.currentValue ?? 0), 0);

    const result = s.map(x => ({
      name: x.name,
      exposure: x.currentValue,
      allocation: totalCur > 0 ? (x.currentValue / totalCur) * 100 : 0
    }));

    return result.sort((a, b) => b.exposure - a.exposure);
  },

  getDashboard: async () => {
    const overallInvestments = await realMockApi.getOverallInvestments();
    const assetAllocation = await realMockApi.getAssetAllocation();
    const overallSectorAllocation = await realMockApi.getOverallSectorAllocation();
    const stocksAllocation = await realMockApi.getStocksAllocation();

    const s = await realMockApi.getStocks();
    const e = await realMockApi.getEtfs();
    const m = await realMockApi.getMutualFunds();
    const f = await realMockApi.getFDs();

    const sumDayChange = (arr) => arr.reduce((acc, x) => acc + (x.dayChange ?? 0), 0);
    const sumCurrentVal = (arr) => arr.reduce((acc, x) => acc + (x.currentValue ?? x.current ?? 0), 0);
    const sumInvestedVal = (arr, valKey = 'investedValue') => arr.reduce((acc, x) => acc + (x[valKey] ?? x.invested ?? x.principal ?? 0), 0);

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
    const totalCurrentVal = sCurVal + eCurVal + mCurVal + sumCurrentVal(f);
    const totalInvVal = sumInvestedVal(s) + sumInvestedVal(e) + sumInvestedVal(m) + sumInvestedVal(f, 'principal');
    const gainPercent = (totalCurrentVal - totalGain) > 0 ? (totalGain / (totalCurrentVal - totalGain)) * 100 : 0;

    return {
      overallInvestments,
      assetAllocation,
      overallSectorAllocation,
      stocksAllocation,
      todayPerformance: {
        data: {
          gain: totalGain,
          gainPercent: gainPercent,
          stocksGain,
          stocksGainPercent,
          etfsGain,
          etfsGainPercent,
          mutualFundsGain,
          mutualFundsGainPercent,
          totalCurrentValue: totalCurrentVal,
          totalInvestedValue: totalInvVal
        }
      }
    };
  },

  getPortfolio: async () => {
    const s = await realMockApi.getStocks();
    const e = await realMockApi.getEtfs();
    const m = await realMockApi.getMutualFunds();
    const f = await realMockApi.getFDs();

    return {
      stocks: s,
      etfs: e,
      mutualFunds: m,
      fds: f
    };
  },

  // Mutation endpoints updating the in-memory arrays
  buyMore: async (payload) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    if (payload.assetType === "stocks") {
      const idx = stocks.findIndex(x => x.symbol === payload.symbol);
      if (idx !== -1) {
        const h = stocks[idx];
        const newQty = h.quantity + payload.quantity;
        const newCost = (h.quantity * (h.avgPurchasePrice ?? 0)) + (payload.quantity * payload.price);
        h.avgPurchasePrice = newCost / newQty;
        h.quantity = newQty;
        h.investedValue = newCost;
        h.currentValue = newQty * (payload.price * 1.05);
        h.returnValue = h.currentValue - h.investedValue;
        h.returnPct = (h.returnValue / h.investedValue) * 100;
      }
    }
    return { success: true };
  },

  updateHolding: async (payload) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    const target = payload.assetType === "mutualFunds" ? mutualFunds : (payload.assetType === "etfs" ? etfs : stocks);
    const idx = target.findIndex(x => x.symbol === payload.symbol || x.name === payload.name);
    if (idx !== -1) {
      const h = target[idx];
      h.quantity = payload.quantity;
      h.avgPurchasePrice = payload.price;
      h.investedValue = payload.quantity * payload.price;
      h.currentValue = payload.quantity * (payload.price * 1.1);
      h.returnValue = h.currentValue - h.investedValue;
      h.returnPct = (h.returnValue / h.investedValue) * 100;
      if (payload.assetType === "mutualFunds" && payload.sipEnabled !== undefined) {
        h.sipEnabled = payload.sipEnabled;
        h.sipAmount = payload.sipAmount;
        h.sipDay = payload.sipDay;
      }
    }
    return { success: true };
  },

  sellHolding: async (payload) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    const target = payload.assetType === "mutualFunds" ? mutualFunds : (payload.assetType === "etfs" ? etfs : stocks);
    const idx = target.findIndex(x => x.symbol === payload.symbol || x.name === payload.name);
    if (idx !== -1) {
      const h = target[idx];
      if (payload.quantity >= h.quantity) {
        target.splice(idx, 1);
      } else {
        h.quantity -= payload.quantity;
        h.investedValue = h.quantity * (h.avgPurchasePrice ?? 0);
        h.currentValue = h.quantity * (payload.price);
        h.returnValue = h.currentValue - h.investedValue;
        h.returnPct = h.investedValue > 0 ? (h.returnValue / h.investedValue) * 100 : 0;
      }
    }
    return { success: true };
  },

  addHolding: async (payload) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    const newAsset = {
      id: `mock-${payload.assetType}-${Date.now()}`,
      name: payload.name,
      symbol: payload.symbol || payload.name.toUpperCase().replace(/\s+/g, ""),
      category: payload.assetType === "stocks" ? "stock" : (payload.assetType === "etfs" ? "ETF" : "Mutual Fund"),
      quantity: payload.quantity,
      avgPurchasePrice: payload.price,
      investedValue: payload.quantity * payload.price,
      currentValue: payload.quantity * payload.price * 1.02,
      returnValue: (payload.quantity * payload.price * 0.02),
      returnPct: 2.0,
      portfolioWeight: 2.0,
      confidenceLevel: payload.confidence || "High",
      sector: payload.sector || "Other"
    };

    if (payload.assetType === "mutualFunds") {
      newAsset.sipEnabled = payload.sipEnabled || false;
      newAsset.sipAmount = payload.sipAmount || 0;
      newAsset.sipDay = payload.sipDay || 0;
    }

    if (payload.assetType === "mutualFunds") {
      mutualFunds.push(newAsset);
    } else if (payload.assetType === "etfs") {
      etfs.push(newAsset);
    } else if (payload.assetType === "fds") {
      const newFd = {
        srNo: fds.length > 0 ? Math.max(...fds.map(x => x.srNo)) + 1 : 1,
        name: payload.name,
        principal: payload.quantity,
        interestRate: payload.interestRate || 7.0,
        currentValue: payload.quantity * 1.02,
        maturityValue: payload.quantity * (1 + (payload.interestRate || 7.0) / 100),
        interestEarned: payload.quantity * 0.02,
        startDate: payload.startDate || new Date().toISOString(),
        maturityDate: payload.maturityDate || new Date().toISOString(),
        weightage: 2.0
      };
      fds.push(newFd);
    } else {
      stocks.push(newAsset);
    }
    return { success: true };
  },

  updateFD: async (payload) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    const idx = fds.findIndex(x => x.srNo === payload.srNo);
    if (idx !== -1) {
      const f = fds[idx];
      f.name = payload.bankName;
      f.principal = payload.principal;
      f.interestRate = payload.interestRate;
      f.startDate = payload.startDate;
      f.maturityDate = payload.maturityDate;
      f.currentValue = payload.principal * 1.05;
      f.interestEarned = f.currentValue - payload.principal;
      f.maturityValue = payload.principal * (1 + (payload.interestRate / 100) * 2);
    }
    return { success: true };
  },

  deleteFD: async (payload) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    fds = fds.filter(x => x.srNo !== payload.srNo);
    return { success: true };
  },

  sendVoiceQuery: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const q = (query || "").toLowerCase();
    if (q.includes("profit") || q.includes("pnl") || q.includes("portfolio")) {
      return {
        success: true,
        intent: "PORTFOLIO_PNL",
        speechText: "Your total portfolio value is ₹12,50,000 with a total profit of ₹2,45,000 (24.4%).",
        data: { currentValue: 1250000, profit: 245000, returnPercentage: 24.4 }
      };
    }
    if (q.includes("tata") || q.includes("hdfc") || q.includes("tcs") || q.includes("reliance") || q.includes("stock") || q.includes("price")) {
      return {
        success: true,
        intent: "STOCK_PRICE",
        speechText: "Tata Motors is currently trading at ₹1,020.50, up 1.85% today. Your total gain on this holding is ₹14,200.",
        data: { symbol: "TATAMOTORS.NS", name: "Tata Motors", currentPrice: 1020.50, dayChangePercent: 1.85, pnl: 14200 }
      };
    }
    return {
      success: true,
      intent: "PORTFOLIO_PNL",
      speechText: "Your total portfolio is currently showing a net gain of ₹2,45,000 across all assets.",
      data: null
    };
  },

  // ── Master NSE Stock Search Mock ───────────────────────────────────────────
  searchNseStocks: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 50));
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    return mockNseStocks.filter(s =>
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.isin.toLowerCase().includes(q)
    );
  },

  // ── Watchlist Mock APIs ───────────────────────────────────────────────────
  getWatchlist: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...mockWatchlist];
  },

  addWatchlistItem: async (payload) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const sym = (payload.symbol || '').toUpperCase().trim();
    const existingIdx = mockWatchlist.findIndex(x => x.symbol === sym);
    const addedPrice = Number(payload.added_price || payload.addedPrice || payload.price || 1000);

    const newItem = {
      watchlistId: `mock-wl-${Date.now()}`,
      symbol: sym,
      isin: payload.isin || '',
      name: payload.name || sym,
      sector: payload.sector || 'Other',
      confidence: payload.confidence || 'Medium',
      badge: payload.badge || 'Trade',
      addedPrice,
      targetPrice: payload.target_price || payload.targetPrice ? Number(payload.target_price || payload.targetPrice) : null,
      notes: payload.notes || '',
      addedAt: new Date().toISOString(),
      currentPrice: addedPrice,
      prevClose: addedPrice,
      returnSinceAddedPct: 0,
      returnSinceAddedAbs: 0,
      dayChangePercent: 0,
      dayChangeAbs: 0,
      inPortfolio: stocks.some(s => s.symbol === sym)
    };

    if (existingIdx !== -1) {
      mockWatchlist[existingIdx] = { ...mockWatchlist[existingIdx], ...newItem };
    } else {
      mockWatchlist.unshift(newItem);
    }
    return { success: true, item: newItem };
  },

  removeWatchlistItem: async (payload) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const targetId = payload.watchlistId || payload.watchlist_id;
    const sym = payload.symbol;
    if (targetId) {
      mockWatchlist = mockWatchlist.filter(x => x.watchlistId !== targetId);
    } else if (sym) {
      mockWatchlist = mockWatchlist.filter(x => x.symbol !== sym);
    }
    return { success: true };
  },

  // ── Paper Trading Mock APIs ───────────────────────────────────────────────
  getPaperPortfolio: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const totCurrent = mockPaperHoldings.reduce((acc, h) => acc + (h.currentValue || 0), 0);
    const totInvested = mockPaperHoldings.reduce((acc, h) => acc + (h.investedValue || 0), 0);
    const unrealizedPnl = totCurrent - totInvested;
    const dayChange = mockPaperHoldings.reduce((acc, h) => acc + (h.dayChangeAbs || 0), 0);

    const summary = {
      initialCapital: mockPaperConfig.initialCapital,
      currentCash: mockPaperConfig.currentCash,
      realizedPnl: mockPaperConfig.realizedPnl,
      totalInvested: totInvested,
      totalCurrent: totCurrent,
      unrealizedPnl,
      totalDayChange: dayChange,
      portfolioValue: mockPaperConfig.currentCash + totCurrent,
      totalPnl: (mockPaperConfig.currentCash + totCurrent) - mockPaperConfig.initialCapital,
      totalPnlPct: mockPaperConfig.initialCapital > 0
        ? (((mockPaperConfig.currentCash + totCurrent) - mockPaperConfig.initialCapital) / mockPaperConfig.initialCapital) * 100
        : 0
    };

    return { summary, holdings: [...mockPaperHoldings] };
  },

  addPaperHolding: async (payload) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const qty = Number(payload.quantity);
    const price = Number(payload.price);
    const totalCost = qty * price;
    const sym = (payload.symbol || '').toUpperCase().trim();

    if (totalCost > mockPaperConfig.currentCash) {
      throw new Error(`Insufficient virtual cash balance. Required: ₹${totalCost}, Available: ₹${mockPaperConfig.currentCash}`);
    }

    mockPaperConfig.currentCash -= totalCost;

    const existingIdx = mockPaperHoldings.findIndex(x => x.symbol === sym);
    if (existingIdx !== -1) {
      const h = mockPaperHoldings[existingIdx];
      const newQty = h.quantity + qty;
      const newCost = (h.quantity * h.buyPrice) + totalCost;
      h.quantity = newQty;
      h.buyPrice = newCost / newQty;
      h.investedValue = newCost;
      h.currentValue = newQty * (price * 1.01);
      h.returnAbs = h.currentValue - h.investedValue;
      h.returnPct = (h.returnAbs / h.investedValue) * 100;
    } else {
      mockPaperHoldings.push({
        srNo: mockPaperHoldings.length + 1,
        assetId: `mock-paper-${Date.now()}`,
        symbol: sym,
        name: payload.name || sym,
        sector: payload.sector || 'Other',
        confidence: payload.confidence || 'Medium',
        badge: payload.badge || 'Trade',
        quantity: qty,
        buyPrice: price,
        investedValue: totalCost,
        currentPrice: price * 1.01,
        prevClose: price,
        currentValue: totalCost * 1.01,
        returnAbs: totalCost * 0.01,
        returnPct: 1.0,
        dayChangeAbs: totalCost * 0.01,
        dayChangePercent: 1.0
      });
    }

    return { success: true };
  },

  sellPaperHolding: async (payload) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const targetId = payload.assetId || payload.asset_id;
    const sellQty = Number(payload.quantity);
    const sellPrice = Number(payload.price);

    const idx = mockPaperHoldings.findIndex(x => x.assetId === targetId);
    if (idx !== -1) {
      const h = mockPaperHoldings[idx];
      const actualSellPrice = sellPrice > 0 ? sellPrice : h.currentPrice;
      const proceeds = sellQty * actualSellPrice;
      const gain = (actualSellPrice - h.buyPrice) * sellQty;

      mockPaperConfig.currentCash += proceeds;
      mockPaperConfig.realizedPnl += gain;

      if (sellQty >= h.quantity) {
        mockPaperHoldings.splice(idx, 1);
      } else {
        h.quantity -= sellQty;
        h.investedValue = h.quantity * h.buyPrice;
        h.currentValue = h.quantity * actualSellPrice;
        h.returnAbs = h.currentValue - h.investedValue;
        h.returnPct = h.investedValue > 0 ? (h.returnAbs / h.investedValue) * 100 : 0;
      }
    }

    return { success: true };
  },

  updatePaperCapital: async (payload) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newCap = Number(payload.newCapital || payload.initialCapital);
    const diff = newCap - mockPaperConfig.initialCapital;
    mockPaperConfig.initialCapital = newCap;
    mockPaperConfig.currentCash = Math.max(0, mockPaperConfig.currentCash + diff);
    return { success: true, config: mockPaperConfig };
  },

  resetPaperPortfolio: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    mockPaperHoldings = [];
    mockPaperConfig.currentCash = mockPaperConfig.initialCapital;
    mockPaperConfig.realizedPnl = 0;
    return { success: true };
  },

  // ── Mainboard IPO Mock APIs ───────────────────────────────────────────────
  getIpos: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...mockIpos];
  },

  getIpoById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return mockIpos.find(x => String(x.id) === String(id)) || null;
  }
};

export const mockApi = realMockApi;
