import os
from copy import deepcopy
from pymongo import MongoClient

_db_instance = None


class _InMemoryInsertResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id


class _InMemoryCollection:
    def __init__(self):
        self._docs = []
        self._next_id = 1

    def create_index(self, *args, **kwargs):
        return None

    def _matches(self, doc, query):
        for key, value in query.items():
            if doc.get(key) != value:
                return False
        return True

    def _apply_projection(self, doc, projection):
        if not projection:
            return deepcopy(doc)

        include_keys = [key for key, value in projection.items() if value and key != "_id"]
        if include_keys:
            projected = {key: doc[key] for key in include_keys if key in doc}
        else:
            projected = deepcopy(doc)
            for key, value in projection.items():
                if not value and key in projected:
                    projected.pop(key, None)

        if projection.get("_id") == 0:
            projected.pop("_id", None)

        return projected

    def find_one(self, query=None, projection=None, sort=None):
        matches = self.find(query, projection=projection, sort=sort)
        return matches[0] if matches else None

    def find(self, query=None, projection=None, sort=None):
        query = query or {}
        matches = [doc for doc in self._docs if self._matches(doc, query)]

        if sort:
            for field, direction in reversed(sort):
                matches.sort(key=lambda doc: doc.get(field), reverse=direction < 0)

        return [self._apply_projection(doc, projection) for doc in matches]

    def insert_one(self, doc):
        stored_doc = deepcopy(doc)
        stored_doc.setdefault("_id", str(self._next_id))
        self._next_id += 1
        self._docs.append(stored_doc)
        return _InMemoryInsertResult(stored_doc["_id"])

    def insert_many(self, docs):
        inserted_ids = []
        for doc in docs:
            result = self.insert_one(doc)
            inserted_ids.append(result.inserted_id)
        return inserted_ids

    def update_one(self, query, update, upsert=False):
        for doc in self._docs:
            if self._matches(doc, query):
                if "$set" in update:
                    doc.update(update["$set"])
                else:
                    doc.update(update)
                return True

        if upsert:
            new_doc = deepcopy(query)
            if "$set" in update:
                new_doc.update(update["$set"])
            else:
                new_doc.update(update)
            self.insert_one(new_doc)
            return True

        return False

    def delete_many(self, query):
        self._docs = [doc for doc in self._docs if not self._matches(doc, query)]


class _InMemoryDatabase:
    def __init__(self):
        self._collections = {}

    def __getattr__(self, name):
        if name.startswith("_"):
            raise AttributeError(name)
        if name not in self._collections:
            self._collections[name] = _InMemoryCollection()
        return self._collections[name]

def get_db():
    global _db_instance
    if _db_instance is None:
        mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        try:
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            client.admin.command("ping")
            _db_instance = client.get_database("portfolio_db")

            # Ensure fast geospatial/lookup indices on Boot
            _db_instance.price_cache.create_index([("ticker", 1), ("date", 1)], unique=True)
            _db_instance.portfolio_items.create_index("user_id")
            _db_instance.settings.create_index([("user_id", 1), ("key", 1)], unique=True)
            _db_instance.users.create_index("email", unique=True)
            print("[MongoDB] Connected to Atlas Cluster & Verified Indices.")
        except Exception as e:
            print(f"[MongoDB] Connection unavailable, using in-memory fallback: {e}")
            _db_instance = _InMemoryDatabase()
        
    return _db_instance
