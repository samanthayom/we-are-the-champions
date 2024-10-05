from backend.app.db.repositories.match import MatchRepository
from backend.app.db.repositories.team import TeamRepository
from backend.app.models.match import MatchModel
from backend.app.exceptions import MatchCreationError, MatchNotFoundError, TeamNotFoundError, MatchUpdateError
from backend.app.services.helpers import get_invalid_match_teams, get_previous_matches


class MatchService:
    def __init__(self, match_repository: MatchRepository, team_repository: TeamRepository):
        self.team_repo = team_repository
        self.match_repo = match_repository


    async def get_all_matches(self) -> list[MatchModel]:
        """
        Get all matches
        """
        return await self.match_repo.get_all_matches()


    async def create_matches(self, matches: list[MatchModel]) -> list[MatchModel]:
        """
        Create multiple matches
        """
        all_teams = await self.team_repo.get_all_teams()
        team_lookup = {team.name: team for team in all_teams}

        for match in matches:
            # Check if the match is valid
            invalid_teams = get_invalid_match_teams(match, set(team_lookup.keys()))
            if invalid_teams:
                raise MatchCreationError(f"Invalid match team(s): {", ".join(invalid_teams)}")
            
            prev_match_ids = get_previous_matches(match, team_lookup)
            if prev_match_ids:
                raise MatchCreationError(f"Duplicate match found between teams {match.teams[0].name} and {match.teams[1].name}")

            for team in match.teams:
                team_lookup[team.name].matches.append(match.id)

        # Create matches
        await self.match_repo.create_matches(matches)

        # Update matches for each team
        for team in team_lookup.values():
            await self.team_repo.update_team(team.id, team)
            
        return matches
    

    async def delete_all_matches(self) -> None:
        """
        Delete all matches
        """
        for team in await self.team_repo.get_all_teams():
            team.matches = []
            await self.team_repo.update_team(team.id, team)
        return await self.match_repo.delete_all_matches()
    

    async def get_match(self, match_id: str) -> MatchModel:
        """
        Get a match by its id
        """
        match = await self.match_repo.get_match_by_id(match_id)
        if match:
            return match    
        else:
            raise MatchNotFoundError(match_id)
        
    
    async def get_matches_by_team_id(self, team_id: str) -> list[MatchModel]:
        """
        Get all matches played by a team
        """
        team = await self.team_repo.get_team_by_id(team_id)
        if not team:
            raise TeamNotFoundError(team_id)
        return await self.match_repo.get_matches_by_ids(team.matches)
    

    async def update_match(self, match_id: str, match: MatchModel) -> MatchModel:
        """
        Update a match
        """
        existing_match = await self.match_repo.get_match_by_id(match_id)
        if not existing_match:
            raise MatchNotFoundError(match_id)
        
        # Check if match data is valid
        all_teams = await self.team_repo.get_all_teams()
        team_lookup = {team.name: team for team in all_teams}
        invalid_teams = get_invalid_match_teams(match, team_lookup)
        if invalid_teams:
            raise MatchUpdateError(f"Invalid match team(s): {", ".join(invalid_teams)}")
        
        prev_match_ids = get_previous_matches(match, team_lookup)
        if not(len(prev_match_ids) == 1 and prev_match_ids.pop() == match_id):
            raise MatchUpdateError(f"Teams {match.teams[0].name} and {match.teams[1].name} have already played")
        
        return await self.match_repo.update_match(match_id, match)

