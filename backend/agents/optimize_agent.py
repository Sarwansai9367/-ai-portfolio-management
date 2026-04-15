import numpy as np
import pandas as pd
from scipy.optimize import minimize

class OptimizationAgent:
    def optimize_portfolio(self, expected_returns, covariance_matrix, tickers):
        num_assets = len(expected_returns)
        args = (expected_returns, covariance_matrix)
        constraints = ({'type': 'eq', 'fun': lambda x: np.sum(x) - 1}) # Sum of weights = 1
        bounds = tuple((0.0, 1.0) for asset in range(num_assets)) # No short selling
        
        init_guess = num_assets * [1. / num_assets,]
        
        def portfolio_volatility(weights, mean_returns, cov_matrix):
            return np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))

        result = minimize(portfolio_volatility, init_guess, args=(expected_returns, covariance_matrix),
                          method='SLSQP', bounds=bounds, constraints=constraints)
        
        optimized_weights = result.x
        return dict(zip(tickers, optimized_weights))

if __name__ == "__main__":
    tickers = ['AAPL', 'MSFT', 'GOOGL']
    exp_returns = np.array([0.1, 0.12, 0.08])
    cov_matrix = np.array([[0.1, 0.02, 0.01], [0.02, 0.1, 0.03], [0.01, 0.03, 0.1]])
    
    agent = OptimizationAgent()
    weights = agent.optimize_portfolio(exp_returns, cov_matrix, tickers)
    print(f"Optimized Weights: {weights}")
