import yfinance as yf
import pandas as pd
import datetime

class DataAgent:
    def fetch_data(self, tickers, start_date=None, end_date=None):
        """
        Fetches historical data for a list of tickers.
        If no dates provided, fetches last 2 years.
        """
        if not start_date:
            start_date = (datetime.datetime.now() - datetime.timedelta(days=730)).strftime('%Y-%m-%d')
        if not end_date:
            end_date = datetime.datetime.now().strftime('%Y-%m-%d')
            
        print(f"Fetching data for {tickers} from {start_date} to {end_date}...")
        try:
            data = yf.download(tickers, start=start_date, end=end_date, progress=False)
            if data.empty:
                print("Error: yfinance returned empty DataFrame.")
                return pd.DataFrame()

            # Handle MultiIndex columns (common in new yfinance)
            if isinstance(data.columns, pd.MultiIndex):
                try:
                    # Try Adj Close first
                    res = data['Adj Close']
                except KeyError:
                    try:
                        # Fallback to Close (if auto_adjust=True)
                        print("Adj Close not found, using Close...")
                        res = data['Close']
                    except KeyError:
                         print("Error: Neither Adj Close nor Close found in MultiIndex.")
                         return pd.DataFrame()
            else:
                # Single Index
                if 'Adj Close' in data.columns:
                    res = data['Adj Close']
                elif 'Close' in data.columns:
                     res = data['Close']
                else:
                    print("Error: Neither Adj Close nor Close found in columns.")
                    return pd.DataFrame()

            if res.empty:
                 print("Error: Resulting price data is empty.")
                 return pd.DataFrame()

            return res.ffill().bfill()
        except Exception as e:
            print(f"Error fetching data: {e}")
            import traceback
            traceback.print_exc()
            return pd.DataFrame()

    def get_latest_price(self, tickers):
        """Returns the most recent price for tickers"""
        try:
            # Efficiently fetch just the last day's data
            data = yf.download(tickers, period="1d", progress=False)
            if not data.empty:
                # Handle MultiIndex
                if isinstance(data.columns, pd.MultiIndex):
                    try:
                         return data['Adj Close'].iloc[-1]
                    except KeyError:
                         return data['Close'].iloc[-1]
                else:
                    return data['Adj Close'].iloc[-1] if 'Adj Close' in data.columns else data['Close'].iloc[-1]
            return None
        except Exception as e:
            print(f"Error fetching latest price: {e}")
            return None

    def get_company_info(self, ticker):
        """Fetches fundamental data for a single ticker."""
        try:
            t = yf.Ticker(ticker)
            info = t.info
            return {
                "symbol": ticker,
                "name": info.get("shortName", ticker),
                "sector": info.get("sector", "N/A"),
                "industry": info.get("industry", "N/A"),
                "description": info.get("longBusinessSummary", "No description available."),
                "marketCap": info.get("marketCap", 0),
                "peRatio": info.get("trailingPE", 0),
                "dividendYield": info.get("dividendYield", 0),
                "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh", 0),
                "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow", 0),
            }
        except Exception as e:
            print(f"Error fetching info for {ticker}: {e}")
            return {
                "symbol": ticker,
                "error": str(e)
            }

if __name__ == "__main__":
    agent = DataAgent()
    print(agent.fetch_data(['AAPL', 'MSFT', 'GOOGL']).tail())
