import pytest
import pandas as pd
import numpy as np
import sys
import os

# Ensure backend can import agents
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from agents.risk_agent import RiskAgent
from agents.rebalance_agent import RebalanceAgent

def test_risk_agent_volatility():
    agent = RiskAgent()
    # Mock daily returns for 5 days: strictly positive to see if math resolves
    returns = pd.Series([0.01, -0.02, 0.015, -0.005, 0.03])
    
    vol = agent.calculate_volatility(returns)
    assert vol > 0.0
    assert isinstance(vol, float)

def test_rebalance_agent_bounds():
    agent = RebalanceAgent()
    
    current_weights = {'AAPL': 0.5, 'MSFT': 0.5}
    # Small deviation, shouldn't trigger rebalance if threshold is 0.05
    target_weights_no_change = {'AAPL': 0.48, 'MSFT': 0.52}
    
    needed, reason = agent.check_rebalance_needed(current_weights, target_weights_no_change, threshold=0.05)
    assert needed is False
    
    # Large deviation, should trigger rebalance
    target_weights_change = {'AAPL': 0.20, 'MSFT': 0.80}
    needed_yes, reason_yes = agent.check_rebalance_needed(current_weights, target_weights_change, threshold=0.05)
    
    assert needed_yes is True
    assert "AAPL deviation" in reason_yes
