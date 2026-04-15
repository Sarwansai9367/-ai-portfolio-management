import os
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv

if __name__ == "__main__":
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    print(f"Connecting to: {mongo_uri}")
    try:
        # certifi is often needed on Windows to connect to MongoDB Atlas
        client = MongoClient(mongo_uri, tlsCAFile=certifi.where(), tlsAllowInvalidCertificates=True, serverSelectionTimeoutMS=5000)
        info = client.server_info()
        print("SUCCESS! Connected to MongoDB cluster.")
        print("MongoDB Version:", info.get('version'))
    except Exception as e:
        print("FAILED to connect!")
        print("Error details:", str(e))
