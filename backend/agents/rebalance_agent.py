class RebalanceAgent:
    def check_rebalance_needed(self, current_weights, target_weights, portfolio_value=100000.0, threshold=0.05, trading_fee_bps=10):
        """
        Determines if rebalancing is needed based on weight deviation and frictional trading costs.
        """
        rebalance_needed = False
        reasons = []
        total_deviation = 0.0
        
        for ticker, target_w in target_weights.items():
            current_w = current_weights.get(ticker, 0.0)
            diff = abs(current_w - target_w)
            total_deviation += diff
            if diff > threshold:
                rebalance_needed = True
                reasons.append(f"{ticker} deviation {diff:.2%} > threshold {threshold:.2%}")
        
        # Calculate Frictional Costs
        # Actual traded turnover is total_deviation / 2
        turnover = total_deviation / 2.0
        estimated_fees = turnover * portfolio_value * (trading_fee_bps / 10000.0)
        
        # Tax Loss Harvesting / Excessive Fee Block check
        # If fees are excessively eating margins, we block the trade.
        max_fee_drag = portfolio_value * 0.005 # 0.5% max fee drag
        if rebalance_needed and estimated_fees > max_fee_drag:
            return False, f"Rebalance blocked. Trading fees (${estimated_fees:.2f}) exceed frictional threshold (${max_fee_drag:.2f})."
        
        if rebalance_needed:
             reasons.append(f"Estimated Fees: ${estimated_fees:.2f}")
             
        return rebalance_needed, "; ".join(reasons)

if __name__ == "__main__":
    agent = RebalanceAgent()
    curr = {'AAPL': 0.5, 'MSFT': 0.5}
    target = {'AAPL': 0.1, 'MSFT': 0.9}
    needed, reason = agent.check_rebalance_needed(curr, target, portfolio_value=1000.0) # Small port -> small fee
    print(f"Rebalance (Small Port): {needed} -> {reason}")
    
    needed_blocked, reason_blocked = agent.check_rebalance_needed(curr, target, portfolio_value=1000000.0, trading_fee_bps=200) 
    print(f"Rebalance (High Fee): {needed_blocked} -> {reason_blocked}")
