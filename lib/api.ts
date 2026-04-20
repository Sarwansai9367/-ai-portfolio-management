const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface Holding {
    quantity: number;
    value: number;
    last_price: number;
}

export interface CompanyInfo {
    symbol: string;
    name: string;
    sector: string;
    industry: string;
    description: string;
    marketCap: number;
    peRatio: number;
    dividendYield: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
}

export interface PortfolioData {
    summary: {
        totalValue: number;
        cash: number;
        holdings: Record<string, Holding | number>; // Support both for backward comaptibility during transition
    };
    risk: {
        volatility: number;
        sharpeRatio: number;
        var: number;
        maxDrawdown: number;
    };
    recentDecisions: Array<{
        timestamp: string;
        rebalance_needed: boolean;
        reason: string;
        optimal_weights: Record<string, number>;
    }>;
}

export const api = {
    getPortfolio: async (token: string): Promise<PortfolioData> => {
        const res = await fetch(`${API_BASE_URL}/portfolio`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch portfolio');
        return res.json();
    },

    getAssetDetails: async (ticker: string): Promise<CompanyInfo> => {
        const res = await fetch(`${API_BASE_URL}/assets/${ticker}`);
        if (!res.ok) throw new Error('Failed to fetch asset details');
        return res.json();
    },

    startAutonomousLoop: async (token: string) => {
        const res = await fetch(`${API_BASE_URL}/control/start`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to start autonomous loop: ${errorText}`);
        }
        return res.json();
    }
};
