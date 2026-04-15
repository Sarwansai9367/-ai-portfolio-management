from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, join_room
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv
import threading
import os
import json
import pandas as pd
import numpy as np

# Load environment variables
load_dotenv()

# Import Agents
from agents.data_agent import DataAgent
from agents.analysis_agent import AnalysisAgent
from agents.dl_predict_agent import DeepLearningAgent
from agents.risk_agent import RiskAgent
from agents.optimize_agent import OptimizationAgent
from agents.rebalance_agent import RebalanceAgent
from agents.reporting_agent import ReportingAgent
from agents.brokerage_agent import BrokerageAgent
from agents.sentiment_agent import SentimentAgent

# DB and Models
from database.mongo import get_db
from werkzeug.security import generate_password_hash, check_password_hash
from auth import create_token, require_auth

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

@socketio.on('join')
def on_join(data):
    token = data.get('token')
    if token:
        from auth import verify_token
        user_id = verify_token(token)
        if user_id:
            join_room(user_id)
            print(f"User {user_id} joined their room")

# Initialize Agents
data_agent = DataAgent() 
analysis_agent = AnalysisAgent()
predict_agent = DeepLearningAgent(epochs=50)
risk_agent = RiskAgent()
optimize_agent = OptimizationAgent()
rebalance_agent = RebalanceAgent()
reporting_agent = ReportingAgent()
brokerage_agent = BrokerageAgent()
sentiment_agent = SentimentAgent()

current_tickers = ['AAPL', 'MSFT', 'GOOGL', 'BTC-USD', 'ETH-USD', 'TLT'] # Default universe with Alternative Assets
loop_lock = threading.Lock()
is_loop_running = False

def get_portfolio_state_from_db(user_id="default_user"):
    db = get_db()
    total_val_setting = db.settings.find_one({"user_id": user_id, "key": "total_value"})
    cash_setting = db.settings.find_one({"user_id": user_id, "key": "cash"})

    if not total_val_setting:
        db.settings.insert_many([
            {"user_id": user_id, "key": "total_value", "value": "100000.0"},
            {"user_id": user_id, "key": "cash", "value": "100000.0"}
        ])
        total_val_setting = {"value": "100000.0"}
        cash_setting = {"value": "100000.0"}

    total_value = float(total_val_setting["value"])
    cash = float(cash_setting["value"])

    holdings = {}
    items = db.portfolio_items.find({"user_id": user_id})
    for item in items:
        holdings[item["ticker"]] = {
            "quantity": item["quantity"],
            "value": item["value"],
            "last_price": item["last_price"]
        }

    return {
        "total_value": total_value,
        "cash": cash,
        "holdings": holdings
    }

def update_portfolio_state_in_db(user_id, new_holdings_dict, new_cash, new_total_val):
    db = get_db()
    db.settings.update_one({"user_id": user_id, "key": "total_value"}, {"$set": {"value": str(new_total_val)}}, upsert=True)
    db.settings.update_one({"user_id": user_id, "key": "cash"}, {"$set": {"value": str(new_cash)}}, upsert=True)

    db.portfolio_items.delete_many({"user_id": user_id})
    if new_holdings_dict:
        docs = []
        for ticker, info in new_holdings_dict.items():
            docs.append({
                "user_id": user_id,
                "ticker": ticker,
                "quantity": info["quantity"],
                "value": info["value"],
                "last_price": info["last_price"]
            })
        if docs:
            db.portfolio_items.insert_many(docs)

def autonomous_task(user_id="default_user"):
    global is_loop_running
    
    with app.app_context(): # We need app context for db access in thread
        try:
            socketio.emit('progress_update', {'step': 1, 'message': 'Fetching Data (Checking Cache, room=user_id)...'})
            print("Step 1: Fetching Data...")
            
            # Check Cache First
            all_cached_data = {}
            db = get_db()
            for ticker in current_tickers:
                records = list(db.price_cache.find({"ticker": ticker}).sort("date", 1))
                if len(records) > 100: # Ensure we have sufficient data built up
                    all_cached_data[ticker] = pd.Series({pd.to_datetime(r["date"]): r["price"] for r in records})
                    
            if len(all_cached_data) == len(current_tickers):
               raw_data = pd.DataFrame(all_cached_data)
               print("Loaded historical data from local PriceCache.")
            else:
               print("Cache miss or insufficient. Fetching from yfinance...")
               raw_data = data_agent.fetch_data(current_tickers)
               
            if raw_data.empty:
                socketio.emit('progress_update', {'step': 1, 'error': 'No data fetched'}, room=user_id)
                return

            socketio.emit('progress_update', {'step': 2, 'message': 'Predicting Returns & Analyzing Sentiment...'}, room=user_id)
            print("Step 2: Predicting Returns & Sentiment...")
            expected_returns = []
            for ticker in current_tickers:
                prices = raw_data[ticker]
                pred = predict_agent.predict_next_return(prices)
                
                # Apply Sentiment Multiplier & Emit News Feed
                sentiment_mult, news_text = sentiment_agent.get_sentiment_multiplier(ticker)
                socketio.emit('news_event', {'ticker': ticker, 'headline': news_text, 'sentiment': float(sentiment_mult, room=user_id)})
                adjusted_pred = pred * sentiment_mult
                
                expected_returns.append(adjusted_pred)
            
            exp_returns_annual = np.array(expected_returns) * 252 
            returns_df = raw_data.pct_change().dropna()
            cov_matrix = returns_df.cov() * 252
            
            socketio.emit('progress_update', {'step': 3, 'message': 'Analyzing Risk...'}, room=user_id)
            print("Step 3: Analyzing Risk...")
            port_returns = returns_df.mean(axis=1)
            risk_metrics = {
                "volatility": risk_agent.calculate_volatility(port_returns),
                "sharpe_ratio": risk_agent.calculate_sharpe_ratio(port_returns),
                "var": risk_agent.calculate_var(port_returns),
                "max_drawdown": risk_agent.calculate_max_drawdown(raw_data.sum(axis=1))
            }
            
            # Store Risk Metrics in MongoDB
            db.risk_metrics.update_one(
                {"user_id": user_id},
                {"$set": risk_metrics},
                upsert=True
            )
            
            socketio.emit('progress_update', {'step': 4, 'message': 'Optimizing...'}, room=user_id)
            print("Step 4: Optimizing...")
            optimal_weights = optimize_agent.optimize_portfolio(exp_returns_annual, cov_matrix.values, current_tickers)
            
            socketio.emit('progress_update', {'step': 5, 'message': 'Deciding Rebalance...'}, room=user_id)
            print("Step 5: Deciding Rebalance...")
            
            portfolio_state = get_portfolio_state_from_db(user_id)
            current_weights = {}
            total_val = portfolio_state['total_value']
            
            if total_val > 0:
                for t, val in portfolio_state['holdings'].items():
                    # Support both dict and float for fallback
                    if isinstance(val, dict):
                        current_weights[t] = val['value'] / total_val
                    else:
                        current_weights[t] = val / total_val
                    
            rebalance_needed, reason = rebalance_agent.check_rebalance_needed(current_weights, optimal_weights, portfolio_value=total_val)
            
            decision = {
                "user_id": user_id,
                "timestamp": pd.Timestamp.now().isoformat(),
                "rebalance_needed": rebalance_needed,
                "reason": reason,
                "optimal_weights": {k: float(v) for k, v in optimal_weights.items()}
            }
            db.decisions.insert_one(decision)
            
            if rebalance_needed or not portfolio_state['holdings']:
                socketio.emit('progress_update', {'step': 6, 'message': 'Rebalancing via Broker...'}, room=user_id)
                print("Step 6: Rebalancing...")
                
                # Clear existing positions
                brokerage_agent.close_all_positions()
                
                current_prices = data_agent.get_latest_price(current_tickers)
                if current_prices is None or current_prices.empty:
                    current_prices = raw_data.iloc[-1]
                     
                new_holdings = {}
                for ticker, weight in optimal_weights.items():
                    allocation_value = total_val * weight
                    price = current_prices[ticker]
                    if price > 0:
                        quantity = allocation_value / price
                        
                        # Execute buy order on broker
                        brokerage_agent.execute_market_order(ticker, quantity, side="buy")
                        
                        new_holdings[ticker] = {
                            "quantity": quantity,
                            "value": allocation_value,
                            "last_price": price
                        }
                    
                update_portfolio_state_in_db(user_id, new_holdings, 0.0, total_val)
            
            # Finally emit completion along with the new portfolio state
            socketio.emit('progress_update', {
                'step': 7, 
                'message': 'Autonomous loop completed', 
                'decision': {
                     "timestamp": decision["timestamp"],
                     "rebalance_needed": decision["rebalance_needed"],
                     "reason": decision["reason"],
                     "optimal_weights": decision["optimal_weights"]
                },
                'new_portfolio': get_portfolio_state_from_db(user_id)
            }, room=user_id)
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            socketio.emit('progress_update', {'step': 'error', 'message': str(e)}, room=user_id)
        finally:
            with loop_lock:
                is_loop_running = False

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "running", "agent_status": "running" if is_loop_running else "idle"})

@app.route('/api/auth/register', methods=['POST'])
def register_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name', 'User')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    db = get_db()
    if db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    user_id = os.urandom(12).hex()
    hashed_password = generate_password_hash(password)
    
    db.users.insert_one({
        "user_id": user_id,
        "email": email,
        "name": name,
        "password": hashed_password
    })

    token = create_token(user_id)
    return jsonify({"message": "User registered successfully", "token": token, "user": {"id": user_id, "name": name, "email": email}})

@app.route('/api/auth/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    db = get_db()
    user = db.users.find_one({"email": email})

    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_token(user['user_id'])
    return jsonify({
        "message": "Login successful", 
        "token": token, 
        "user": {"id": user['user_id'], "name": user['name'], "email": user['email']}
    })

@app.route('/api/user/setup', methods=['POST'])
@require_auth
def setup_portfolio(user_id):
    data = request.json
    assets = data.get("assets", ['AAPL', 'MSFT', 'GOOGL'])
    initial_cash = data.get("initial_cash", 100000.0)
    risk_level = data.get("riskLevel", "moderate")
    constraints = data.get("constraints", {})

    # Save to MongoDB settings for this user
    db = get_db()
    db.settings.update_one({"user_id": user_id, "key": "total_value"}, {"$set": {"value": str(initial_cash)}}, upsert=True)
    db.settings.update_one({"user_id": user_id, "key": "cash"}, {"$set": {"value": str(initial_cash)}}, upsert=True)
    db.settings.update_one({"user_id": user_id, "key": "assets"}, {"$set": {"value": assets}}, upsert=True)
    db.settings.update_one({"user_id": user_id, "key": "risk_level"}, {"$set": {"value": risk_level}}, upsert=True)
    db.settings.update_one({"user_id": user_id, "key": "constraints"}, {"$set": {"value": constraints}}, upsert=True)

    # Clear old holdings if they are re-running setup
    db.portfolio_items.delete_many({"user_id": user_id})

    return jsonify({"message": "Portfolio setup initialized successfully"})

@app.route('/api/chat', methods=['POST'])
@require_auth
def chat_with_ai(user_id):
    data = request.json
    user_msg = data.get("message", "").lower()

    # Simple local introspection Rule-Based GenAI Mock
    if "why" in user_msg and "portfolio" in user_msg:
        state = get_portfolio_state_from_db(user_id)
        holdings = list(state['holdings'].keys())
        return jsonify({"reply": f"I mathematically optimized this portfolio using PyTorch LSTMs mapped across Tangency Weights. Based on my latest predictive analysis across {len(holdings)} assets, these vectors offered the highest Sharpe Ratio adjusted for VADER NLP sentiment. Slippage penalties dynamically constrained any excessive reallocation."})
        
    elif "news" in user_msg or "sentiment" in user_msg:
        return jsonify({"reply": "I continuously pull global news pipelines through VADER Natural Language Processing. If I detect hostile headlines, I penalize my Neural Network return-expectations by up to 20% before running optimization. I prioritize mathematically sound structural shifts."})

    elif "crypto" in user_msg or "bitcoin" in user_msg:
         return jsonify({"reply": "I recently expanded my optimization universe to include Alternative Assets like BTC-USD. Deep learning often finds highly uncorrelated volatility swings between crypto and traditional tech stocks, providing aggressive alpha generation opportunities."})
    
    return jsonify({"reply": "I am the PortfolioAI local introspection agent. Ask me why I structured your portfolio, how my sentiment engine works, or how I process crypto-asset volatility!"})

@app.route('/api/portfolio', methods=['GET'])
@require_auth
def get_portfolio(user_id):
    portfolio_state = get_portfolio_state_from_db(user_id)
    
    # Fetch risk metrics from MongoDB or use fallback
    db = get_db()
    risk_metrics = db.risk_metrics.find_one({"user_id": user_id}, {"_id": 0, "user_id": 0})
    if not risk_metrics:
        risk_metrics = {"volatility": 0.0, "sharpe_ratio": 0.0, "var": 0.0, "max_drawdown": 0.0}
    
    decisions_list = []
    db = get_db()
    last_dec = db.decisions.find_one({"user_id": user_id}, sort=[("timestamp", -1)])
    if last_dec:
        decisions_list.append({
             "timestamp": last_dec["timestamp"],
             "rebalance_needed": last_dec["rebalance_needed"],
             "reason": last_dec["reason"],
             "optimal_weights": last_dec["optimal_weights"]
        })
        
    return jsonify(reporting_agent.format_portfolio_for_frontend(portfolio_state, risk_metrics, decisions_list))

@app.route('/api/assets/<ticker>', methods=['GET'])
def get_asset_details(ticker):
    info = data_agent.get_company_info(ticker)
    return jsonify(info)

@app.route('/api/control/start', methods=['POST'])
@require_auth
def run_autonomous_loop_endpoint(user_id):
    global is_loop_running
    with loop_lock:
        if is_loop_running:
            return jsonify({"error": "Loop is already running"}), 400
        is_loop_running = True
        
    threading.Thread(target=autonomous_task, args=(user_id,)).start()
    return jsonify({"message": "Autonomous loop started"})

def initialize_database():
    # Ensure default state exists on Boot
    get_portfolio_state_from_db()

def scheduled_data_fetch():
    print("Running scheduled data fetch... (Syncing PriceCache)")
    try:
        # Download history to populate cache
        raw_data = data_agent.fetch_data(current_tickers)
        if raw_data.empty: 
            print("Failed to fetch data for cache.")
            return
        
        db = get_db()
        for ticker in current_tickers:
            if ticker in raw_data.columns:
                ticker_data = raw_data[ticker].dropna()
                for date, price in ticker_data.items():
                    py_date = str(date.date())
                    db.price_cache.update_one(
                        {"ticker": ticker, "date": py_date},
                        {"$set": {"price": float(price)}},
                        upsert=True
                    )
        print("PriceCache synced successfully.")
    except Exception as e:
        print(f"Error in scheduled fetch: {e}")

if __name__ == '__main__':
    initialize_database()
    
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=scheduled_data_fetch, trigger="cron", hour=0, minute=0)
    scheduler.start()
    
    # We use socketio.run instead of app.run
    socketio.run(app, debug=True, port=5001, allow_unsafe_werkzeug=True)
