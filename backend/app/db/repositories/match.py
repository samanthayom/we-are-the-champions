from backend.app.models.match import MatchModel
from backend.app.db.config import Database

class MatchRepository:
    def __init__(self, db: Database):
        self.collection = db.get_collection("matches")

    async def get_all_matches(self) -> list[MatchModel]:
        """
        Get all matches
        """
        matches = await self.collection.find().to_list(length=50)
        return [MatchModel(**match) for match in matches]


    async def create_matches(self, matches: list[MatchModel]) -> list[MatchModel]: 
        """
        Create multiple matches
        """
        match_data = [match.model_dump(by_alias=True) for match in matches]
        await self.collection.insert_many(match_data)
        return matches
    
    async def delete_all_matches(self) -> None:
        """
        Delete all matches from the database
        """
        return await self.collection.delete_many({})


    async def get_match_by_id(self, match_id: str) -> MatchModel:
        """
        Get a match by its id
        """
        match = await self.collection.find_one({"id": match_id})
        return MatchModel(**match) if match else None
    
    
    async def get_matches_by_ids(self, match_ids: list[str]) -> list[MatchModel]:
        """
        Get matches by their ids
        """
        matches = await self.collection.find({"id": {"$in": match_ids}}).to_list(length=50)
        return [MatchModel(**match) for match in matches]

    
    async def update_match(self, match_id: str, match: MatchModel) -> MatchModel:
        """
        Update a match
        """
        match_data = match.model_dump(by_alias=True)
        await self.collection.update_one(
            {"id": match_id},
            {"$set": match_data}
        )
        return match

