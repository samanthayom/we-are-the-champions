from fastapi import HTTPException

from backend.app.db.repositories.team import TeamRepository
from backend.app.models.team import TeamModel
from backend.app.exceptions import TeamCreationError, TeamNotFoundError, TeamUpdateError
from backend.app.services.utils import is_valid_grouping, has_valid_team_name

class TeamService:
    def __init__(self, team_repository: TeamRepository):
        self.team_repo = team_repository

    
    async def create_teams(self, teams: list[TeamModel]) -> list[TeamModel]:
        """
        Create multiple teams
        """
        # Check that there are 12 teams
        if len(teams) != 12:
            raise TeamCreationError("There must be 12 teams")

        # Check that team names are unique
        team_names = [team.name for team in teams]
        if len(team_names) != len(set(team_names)):
            raise TeamCreationError("Team names must be unique")
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
            raise TeamNotFoundError(team_id=team_id)
    

    async def get_all_teams(self) -> list[TeamModel]:
        """
        Get all teams
        """
        return await self.team_repo.get_all_teams()


    async def update_team(self, team_id: str, team: TeamModel) -> TeamModel:
        """
        Update a team by its id
        """
        # Check if the team data is valid
        existing_team = await self.team_repo.get_team_by_id(team_id)
        if not existing_team:
            raise TeamNotFoundError(team_id=team_id)
        
        if not await has_valid_team_name(team, self.team_repo):
            raise TeamUpdateError(f"Team with name {team.name} already exists")
    
        return await self.team_repo.update_team(team_id, team)
