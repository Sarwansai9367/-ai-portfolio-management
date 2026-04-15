import os
from pymongo import MongoClient

_db_instance = None

def get_db():
    global _db_instance
    if _db_instance is None:
        mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        
        # We need to ensure we use the correct PyMongo driver arguments for +srv clusters
        client = MongoClient(mongo_uri)
        _db_instance = client.get_database("portfolio_db")
        
        # Ensure fast geospatial/lookup indices on Boot
        _db_instance.price_cache.create_index([("ticker", 1), ("date", 1)], unique=True)
        _db_instance.portfolio_items.create_index("user_id")
        _db_instance.settings.create_index([("user_id", 1), ("key", 1)], unique=True)
        print("[MongoDB] Connected to Atlas Cluster & Verified Indices.")
        
    return _db_instance
