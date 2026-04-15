import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from torch.utils.data import DataLoader, TensorDataset

class LSTMModel(nn.Module):
    def __init__(self, input_size=1, hidden_layer_size=50, output_size=1):
        super(LSTMModel, self).__init__()
        self.hidden_layer_size = hidden_layer_size
        self.lstm = nn.LSTM(input_size, hidden_layer_size, batch_first=True)
        self.linear = nn.Linear(hidden_layer_size, output_size)

    def forward(self, input_seq):
        lstm_out, _ = self.lstm(input_seq)
        predictions = self.linear(lstm_out[:, -1, :])
        return predictions

class DeepLearningAgent:
    def __init__(self, seq_length=10, epochs=100, lr=0.01):
        self.seq_length = seq_length
        self.epochs = epochs
        self.lr = lr
        self.model = LSTMModel()
        self.loss_function = nn.MSELoss()
        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=self.lr)
        self.is_trained = False

    def create_sequences(self, data):
        xs = []
        ys = []
        for i in range(len(data)-self.seq_length-1):
            x = data[i:(i+self.seq_length)]
            y = data[i+self.seq_length]
            xs.append(x)
            ys.append(y)
        return torch.tensor(np.array(xs), dtype=torch.float32).unsqueeze(-1), torch.tensor(np.array(ys), dtype=torch.float32).unsqueeze(-1)

    def train_model(self, prices):
        """
        Trains the LSTM model on standard pct returns.
        """
        returns = prices.pct_change().dropna().values
        
        # We need at least double the sequence length to train anything meaningful
        if len(returns) < self.seq_length * 2:
             print("DeepLearningAgent: Insufficient data to train.")
             return
             
        X, y = self.create_sequences(returns)
        
        # Simple training loop
        self.model.train()
        for i in range(self.epochs):
            self.optimizer.zero_grad()
            y_pred = self.model(X)
            single_loss = self.loss_function(y_pred, y)
            single_loss.backward()
            self.optimizer.step()
            
        print(f"DeepLearningAgent: Model trained. Final loss: {single_loss.item():.6f}")
        self.is_trained = True

    def predict_next_return(self, recent_prices):
        if not self.is_trained:
            self.train_model(recent_prices)
            
        returns = recent_prices.pct_change().dropna().values
        if len(returns) < self.seq_length:
            return 0.0
            
        # Grab the last seq_length entries
        last_seq = returns[-self.seq_length:]
        x = torch.tensor(last_seq, dtype=torch.float32).view(1, self.seq_length, 1)
        
        self.model.eval()
        with torch.no_grad():
            pred = self.model(x)
            
        return pred.item()

if __name__ == "__main__":
    dates = pd.date_range(start='2023-01-01', periods=200)
    prices = pd.Series(np.random.normal(100, 5, 200).cumsum() + 1000, index=dates)
    agent = DeepLearningAgent(epochs=20)
    agent.train_model(prices)
    print(f"Next Predicted Return (LSTM): {agent.predict_next_return(prices)}")
