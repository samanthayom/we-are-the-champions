from backend.app.models.team import TeamModel
from backend.app.db.config import Database

class TeamRepository:
    def __init__(self, db: Database):
        self.collection = db.get_collection("teams")


    async def get_team_by_id(self, team_id: str) -> TeamModel:
        """
        Get a team by its id
        """
        team = await self.collection.find_one({"id": team_id})
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
        teams = await self.collection.find().to_list(length=50)
        return [TeamModel(**team) for team in teams]


    async def create_teams(self, teams: list[TeamModel]) -> list[TeamModel]:
        """
        Create multiple teams
        """
        team_data = [team.model_dump(by_alias=True) for team in teams]
        await self.collection.insert_many(team_data)
        return teams


    async def update_team(self, team_id: str, team: TeamModel) -> TeamModel:
        """
        Update a team
        """
        team_data = team.model_dump(by_alias=True)
        await self.collection.update_one(
            {"id": team_id},
            {"$set": team_data}
        )
        return team
    
    
    async def delete_all_teams(self) -> None:
        """
        Delete all teams from the database
        """
        await self.collection.delete_many({})
