from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class SentimentAgent:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()
        
    def mock_fetch_news(self, ticker):
        """
        In production, this would hit Finnhub or NewsCatcher API.
        For now, we mock recent headlines for top tech stocks and crypto to test the logic.
        """
        mock_news = {
            "AAPL": "Apple releases new incredibly popular iPhone, sales skyrocket. Amazing revenue.",
            "MSFT": "Microsoft Azure cloud faces massive global outage, stock plummets, investors panic.",
            "GOOGL": "Google announces impressive new AI model, beats competitors easily.",
            "BTC-USD": "Bitcoin ETF inflows shatter records as institutional adoption goes mainstream.",
            "ETH-USD": "Ethereum network fees plummet after successful scaling upgrade, adoption rises.",
            "TLT": "Federal Reserve signals aggressive rate cuts, Treasury bond yields fall rapidly."
        }
        return mock_news.get(ticker, f"Normal trading day for {ticker}, no major news.")

    def get_sentiment_multiplier(self, ticker):
        """
        Returns a (multiplier, news_headline) tuple. Multiplier is between 0.8 to 1.2
        to adjust the expected return based on news sentiment.
        """
        news_text = self.mock_fetch_news(ticker)
        scores = self.analyzer.polarity_scores(news_text)
        
        # Compound score is between -1 (most negative) and +1 (most positive)
        compound = scores['compound']
        
        multiplier = 1.0 + (compound * 0.2)
        
        print(f"[SentimentAgent] {ticker} Sentiment: {compound:.2f} -> Adjusted Return Multiplier: {multiplier:.2f}")
        return multiplier, news_text

if __name__ == "__main__":
    agent = SentimentAgent()
    print("AAPL Multiplier:", agent.get_sentiment_multiplier("AAPL"))
    print("MSFT Multiplier:", agent.get_sentiment_multiplier("MSFT"))
    print("TSLA Multiplier:", agent.get_sentiment_multiplier("TSLA"))
