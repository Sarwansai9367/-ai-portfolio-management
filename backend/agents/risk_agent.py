import numpy as np
import pandas as pd

class RiskAgent:
    def calculate_volatility(self, returns):
        """Annualized volatility"""
        return np.std(returns) * np.sqrt(252)

    def calculate_sharpe_ratio(self, returns, risk_free_rate=0.02):
        """Annualized Sharpe Ratio"""
        excess_returns = returns - risk_free_rate/252
        if np.std(excess_returns) == 0:
            return 0
        return np.mean(excess_returns) / np.std(excess_returns) * np.sqrt(252)
    
    def calculate_var(self, returns, confidence_level=0.95):
        """Value at Risk (VaR)"""
        if isinstance(returns, pd.Series):
            returns = returns.values
        return np.percentile(returns, 100 * (1 - confidence_level))
        
    def calculate_max_drawdown(self, prices):
        """Max Drawdown from peak"""
        cumulative = (1 + prices.pct_change().fillna(0)).cumprod()
        peak = cumulative.cummax()
        drawdown = (cumulative - peak) / peak
        return drawdown.min()

if __name__ == "__main__":
    dummy_returns = pd.Series(np.random.normal(0.001, 0.02, 252))
    dummy_prices = (1 + dummy_returns).cumprod() * 100
    
    agent = RiskAgent()
    print(f"Volatility: {agent.calculate_volatility(dummy_returns):.4f}")
    print(f"Sharpe Ratio: {agent.calculate_sharpe_ratio(dummy_returns):.4f}")
    print(f"VaR (95%): {agent.calculate_var(dummy_returns):.4f}")
    print(f"Max Drawdown: {agent.calculate_max_drawdown(dummy_prices):.4f}")
