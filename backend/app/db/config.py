import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()


class Database:
    def __init__(self):
        self.uri = os.getenv("MONGODB_URI")
        self.db_name = os.getenv("MONGODB_DB_NAME")

    def connect_db(self):
        self.client = AsyncIOMotorClient(self.uri)
        self.db = self.client[self.db_name]

    def close_db(self):
        self.client.close()
    
    def get_collection(self, collection_name: str):
        return self.db[collection_name]
