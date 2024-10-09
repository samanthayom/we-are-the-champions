import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv


load_dotenv()


class Database:
    def __init__(self):
        self.name = os.getenv("DB_NAME")
        self.username = os.getenv("DB_USERNAME")
        self.password = os.getenv("DB_PASSWORD")
        self.host = os.getenv("DB_HOST")
        self.uri = f"mongodb://{self.username}:{self.password}@{self.host}:27017/{self.name}?authSource=admin"


    def connect_db(self):
        self.client = AsyncIOMotorClient(self.uri)
        self.db = self.client[self.name]

    def close_db(self):
        self.client.close()
    
    def get_collection(self, collection_name: str):
        return self.db[collection_name]
