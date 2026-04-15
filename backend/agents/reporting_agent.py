class ReportingAgent:
    def format_portfolio_for_frontend(self, portfolio_state, risk_metrics, rebalance_decisions):
        """
        Formats internal state into JSON structure expected by frontend.
        """
        return {
            "summary": {
                "totalValue": portfolio_state.get('total_value', 0),
                "cash": portfolio_state.get('cash', 0),
                "holdings": portfolio_state.get('holdings', {}),
            },
            "risk": {
                "volatility": risk_metrics.get('volatility', 0),
                "sharpeRatio": risk_metrics.get('sharpe_ratio', 0),
                "var": risk_metrics.get('var', 0),
                "maxDrawdown": risk_metrics.get('max_drawdown', 0)
            },
            "recentDecisions": rebalance_decisions
        }

if __name__ == "__main__":
    agent = ReportingAgent()
    print("Reporting Agent Initialized")
