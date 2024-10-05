from fastapi import HTTPException

from backend.app.db.repositories.team import TeamRepository
from backend.app.models.team import TeamModel
from backend.app.services.helpers import is_valid_group, is_unique_name

class TeamService:
    def __init__(self, team_repository: TeamRepository):
        self.team_repo = team_repository

    
    async def create_teams(self, teams: list[TeamModel]) -> list[TeamModel]:
        """
        Create multiple teams
        """
        # Check that team names are unique
        team_names = [team.name for team in teams]
        if len(team_names) != len(set(team_names)):
            raise HTTPException(status_code=400, detail="Team names must be unique")
        return await self.team_repo.create_teams(teams)
    
    async def delete_all_teams(self) -> None:
        """
        Delete all teams
        """
        return await self.team_repo.delete_all_teams()
    
   
    async def get_team(self, team_id: str) -> TeamModel:
        """
        Get a team by its id
        """
        team = await self.team_repo.get_team_by_id(team_id)
        if team:
            return team
        else:
            raise HTTPException(status_code=404, detail=f"Team not found")


    async def update_team(self, team_id: str, team: TeamModel) -> TeamModel:
        """
        Update a team by its id
        """
        # Check if the team data is valid
        if not is_valid_group(team):
            raise HTTPException(status_code=400, detail="Invalid group number provided")
        
        if not await is_unique_name(team, self.team_repo):
            raise HTTPException(status_code=400, detail="A team with this name already exists")
    
        return await self.team_repo.update_team(team_id, team)
