import os
from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce

class BrokerageAgent:
    def __init__(self):
        self.api_key = os.getenv("ALPACA_API_KEY")
        self.api_secret = os.getenv("ALPACA_SECRET_KEY")
        self.paper = True # Always use paper trading for safety
        
        self.client = None
        if self.api_key and self.api_secret:
            try:
                self.client = TradingClient(self.api_key, self.api_secret, paper=self.paper)
                print("BrokerageAgent: connected to Alpaca (Paper)")
            except Exception as e:
                print(f"Failed to initialize Alpaca Trading Client: {e}")
        else:
            print("BrokerageAgent: No API keys found, operating in MOCK mode")

    def is_connected(self):
        return self.client is not None

    def get_account_summary(self):
        if not self.is_connected():
            return None
        
        try:
            account = self.client.get_account()
            return {
                "equity": float(account.equity),
                "cash": float(account.cash),
                "buying_power": float(account.buying_power),
                "currency": account.currency
            }
        except Exception as e:
            print(f"Error fetching account info: {e}")
            return None

    def execute_market_order(self, ticker, quantity, side="buy"):
        if quantity <= 0:
            return True
            
        if not self.is_connected():
            print(f"Mock Order: {side.upper()} {quantity:.4f} shares of {ticker}")
            return True
            
        try:
            order_side = OrderSide.BUY if side.lower() == "buy" else OrderSide.SELL
            market_order_data = MarketOrderRequest(
                symbol=ticker,
                qty=quantity,
                side=order_side,
                time_in_force=TimeInForce.DAY
            )
            
            market_order = self.client.submit_order(order_data=market_order_data)
            print(f"Executed {side.upper()} order for {quantity:.4f} shares of {ticker}. Order ID: {market_order.id}")
            return True
        except Exception as e:
            print(f"Failed to execute order for {ticker}: {e}")
            return False

    def close_all_positions(self):
        if not self.is_connected():
             print("Mock Order: Closed all positions to prepare for rebalance.")
             return True
        
        try:
             self.client.close_all_positions(cancel_orders=True)
             return True
        except Exception as e:
             print(f"Failed to close all positions: {e}")
             return False
