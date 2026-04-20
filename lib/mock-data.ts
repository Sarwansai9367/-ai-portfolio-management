export interface Asset {
  id: string;
  symbol: string;
  name: string;
  value: number;
  quantity: number;
  price: number;
  change24h: number;
  allocation: number;
}

export interface Portfolio {
  id: string;
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  ytdReturn: number;
  volatility: number;
  sharpeRatio: number;
  assets: Asset[];
  riskLevel: 'low' | 'moderate' | 'high';
}

export interface Decision {
  id: string;
  timestamp: Date;
  action: 'buy' | 'sell' | 'rebalance' | 'hold';
  asset: string;
  quantity: number;
  reason: string;
  impact: number;
}

// Mock portfolio data
export const mockPortfolio: Portfolio = {
  id: 'portfolio-001',
  totalValue: 125420.50,
  dailyChange: 2145.20,
  dailyChangePercent: 1.73,
  ytdReturn: 18.5,
  volatility: 12.3,
  sharpeRatio: 1.45,
  riskLevel: 'moderate',
  assets: [
    {
      id: 'asset-1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      value: 28500,
      quantity: 150,
      price: 190,
      change24h: 2.3,
      allocation: 22.7,
    },
    {
      id: 'asset-2',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      value: 24300,
      quantity: 75,
      price: 324,
      change24h: 1.8,
      allocation: 19.4,
    },
    {
      id: 'asset-3',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      value: 18200,
      quantity: 50,
      price: 364,
      change24h: -0.5,
      allocation: 14.5,
    },
    {
      id: 'asset-4',
      symbol: 'BND',
      name: 'Bond ETF',
      value: 32000,
      quantity: 320,
      price: 100,
      change24h: 0.1,
      allocation: 25.5,
    },
    {
      id: 'asset-5',
      symbol: 'VGK',
      name: 'Vanguard FTSE Europe',
      value: 22420.50,
      quantity: 180,
      price: 124.56,
      change24h: 1.2,
      allocation: 17.9,
    },
  ],
};

// Mock decisions/events
export const mockDecisions: Decision[] = [
  {
    id: 'decision-1',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    action: 'rebalance',
    asset: 'AAPL',
    quantity: 10,
    reason: 'Portfolio allocation drift detected. AAPL exceeded target weight by 2.3%',
    impact: 1890,
  },
  {
    id: 'decision-2',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    action: 'buy',
    asset: 'BND',
    quantity: 30,
    reason: 'Market volatility increased. Bonds provide stabilization.',
    impact: 3000,
  },
  {
    id: 'decision-3',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    action: 'sell',
    asset: 'TSLA',
    quantity: 5,
    reason: 'Risk-adjusted return optimization. Shifted to lower volatility assets.',
    impact: -1820,
  },
  {
    id: 'decision-4',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    action: 'hold',
    asset: 'MSFT',
    quantity: 0,
    reason: 'Current allocation aligns with target. No action needed.',
    impact: 0,
  },
];

// Time series data for charts
export const mockChartData = [
  { date: '2024-01-01', value: 105000, benchmark: 105000 },
  { date: '2024-01-08', value: 106500, benchmark: 105800 },
  { date: '2024-01-15', value: 108200, benchmark: 106200 },
  { date: '2024-01-22', value: 107800, benchmark: 107000 },
  { date: '2024-01-29', value: 109500, benchmark: 108500 },
  { date: '2024-02-05', value: 111200, benchmark: 109800 },
  { date: '2024-02-12', value: 113000, benchmark: 111200 },
  { date: '2024-02-19', value: 115500, benchmark: 112500 },
  { date: '2024-02-26', value: 118200, benchmark: 114000 },
  { date: '2024-03-04', value: 120800, benchmark: 115500 },
  { date: '2024-03-11', value: 125420.50, benchmark: 117200 },
];

// Agent visualization data
export const mockAgents = [
  {
    name: 'Data Agent',
    status: 'active',
    color: '#00D9FF',
    connections: ['Predict Agent'],
  },
  {
    name: 'Predict Agent',
    status: 'active',
    color: '#00D9FF',
    connections: ['Data Agent', 'Optimize Agent'],
  },
  {
    name: 'Optimize Agent',
    status: 'active',
    color: '#00D9FF',
    connections: ['Predict Agent', 'Rebalance Agent'],
  },
  {
    name: 'Rebalance Agent',
    status: 'idle',
    color: '#666',
    connections: ['Optimize Agent'],
  },
];

// Prediction data
export const mockPredictions = [
  { date: '2024-03-11', predicted: 125420, actual: 125420, low: 122000, high: 128000 },
  { date: '2024-03-18', predicted: 127800, actual: null, low: 124500, high: 131200 },
  { date: '2024-03-25', predicted: 129500, actual: null, low: 125800, high: 133300 },
  { date: '2024-04-01', predicted: 131200, actual: null, low: 127200, high: 135500 },
  { date: '2024-04-08', predicted: 133000, actual: null, low: 128800, high: 137500 },
];

// Asset correlation matrix
export const mockCorrelationMatrix = [
  { asset1: 'AAPL', asset2: 'MSFT', correlation: 0.72 },
  { asset1: 'AAPL', asset2: 'TSLA', correlation: 0.45 },
  { asset1: 'AAPL', asset2: 'BND', correlation: -0.15 },
  { asset1: 'AAPL', asset2: 'VGK', correlation: 0.68 },
  { asset1: 'MSFT', asset2: 'TSLA', correlation: 0.52 },
  { asset1: 'MSFT', asset2: 'BND', correlation: -0.12 },
  { asset1: 'MSFT', asset2: 'VGK', correlation: 0.71 },
  { asset1: 'TSLA', asset2: 'BND', correlation: -0.25 },
  { asset1: 'TSLA', asset2: 'VGK', correlation: 0.38 },
  { asset1: 'BND', asset2: 'VGK', correlation: -0.08 },
];
