from fastapi import HTTPException
from uuid import UUID

from backend.app.models.team import TeamModel
from backend.app.db.config import Database

class TeamRepository:
    def __init__(self, db: Database):
        self.collection = db.get_collection("teams")


    async def get_team_by_id(self, team_uuid: UUID) -> TeamModel:
        """
        Get a team by its uuid
        """
        team = await self.collection.find_one({"id": str(team_uuid)})
        return TeamModel(**team) if team else None
    

    async def get_team_by_name(self, team_name: str) -> TeamModel:
        """
        Get a team by its name
        """
        team = await self.collection.find_one({"name": team_name})
        return TeamModel(**team) if team else None

    
    async def get_all_teams(self) -> list[TeamModel]:
        """
        Get all teams in the database
        """
        return await self.collection.find().to_list(length=100)


    async def create_team(self, team: TeamModel) -> TeamModel:
        """
        Create a new team
        """
        team_data = team.model_dump(by_alias=True)
        await self.collection.insert_one(team_data)
        return team


    async def create_teams(self, teams: list[TeamModel]) -> list[TeamModel]:
        """
        Create multiple teams
        """
        team_data = [team.model_dump(by_alias=True) for team in teams]
        await self.collection.insert_many(team_data)
        return teams


    async def update_team(self, team_uuid: UUID, team: TeamModel) -> TeamModel:
        """
        Update a team by its uuid
        """
        team_data = team.model_dump(by_alias=True)
        update_result = await self.collection.update_one(
            {"id": str(team_uuid)},
            {"$set": team_data}
        )
        if update_result.modified_count == 0:
            raise HTTPException(status_code=404, detail=f"Team not found")
        return team
    
    
    async def delete_all_teams(self) -> None:
        """
        Delete all teams in the database
        """
        await self.collection.delete_many({})
