import pandas as pd
import numpy as np

class AnalysisAgent:
    def calculate_simple_moving_average(self, data, window=20):
        return data.rolling(window=window).mean()

    def calculate_rsi(self, data, window=14):
        delta = data.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
        rs = gain / loss
        return 100 - (100 / (1 + rs))
    
    def calculate_macd(self, data, fast=12, slow=26, signal=9):
        exp1 = data.ewm(span=fast, adjust=False).mean()
        exp2 = data.ewm(span=slow, adjust=False).mean()
        macd = exp1 - exp2
        signal_line = macd.ewm(span=signal, adjust=False).mean()
        return macd, signal_line

    def calculate_bollinger_bands(self, data, window=20, num_std=2):
        sma = self.calculate_simple_moving_average(data, window)
        std = data.rolling(window=window).std()
        upper_band = sma + (std * num_std)
        lower_band = sma - (std * num_std)
        return upper_band, lower_band

if __name__ == "__main__":
    # Test with dummy data
    dates = pd.date_range(start='2023-01-01', periods=100)
    data = pd.Series(np.random.randn(100).cumsum() + 100, index=dates)
    agent = AnalysisAgent()
    print(f"RSI: {agent.calculate_rsi(data).tail()}")
