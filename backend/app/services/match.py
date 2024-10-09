from ..db.repositories.match import MatchRepository
from ..db.repositories.team import TeamRepository
from ..models.match import Match
from ..models.team import Team
from ..exceptions import MatchCreationError, MatchNotFoundError, TeamNotFoundError, MatchUpdateError
from ..services.utils import has_previous_match, get_match_changes
from ..logger import get_logger


logger = get_logger(__name__)

class MatchService:
    def __init__(self, match_repository: MatchRepository, team_repository: TeamRepository):
        self.team_repo = team_repository
        self.match_repo = match_repository


    async def get_all_matches(self) -> list[Match]:
        """
        Get all matches
        """
        return await self.match_repo.get_all_matches()
    

    async def get_team_lookup(self) -> dict[str, Team]:
        """
        Get all teams
        """
        return {team.name: team for team in await self.team_repo.get_all_teams()}



    async def create_matches(self, matches: list[Match]) -> list[Match]:
        """
        Create multiple matches
        """
        team_lookup = await self.get_team_lookup()

        for match in matches:
            # Check if the match is valid
            team1_name, team2_name = match.teams[0].name, match.teams[1].name
            if not team1_name in team_lookup or not team2_name in team_lookup:
                raise MatchCreationError(f"Match involves invalid team(s)")
            
            team1, team2  = team_lookup[team1_name], team_lookup[team2_name]
            if team1.group != team2.group:
                raise MatchCreationError(f"Match involves teams {team1.name} and {team2.name} from different groups")
            
            if has_previous_match(team1, team2, match.id):
                raise MatchCreationError(f"Match involves teams {team1.name} and {team2.name} that have already played each other")

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
    

    async def get_match(self, match_id: str) -> Match:
        """
        Get a match by its id
        """
        match = await self.match_repo.get_match_by_id(match_id)
        if match:
            return match    
        else:
            raise MatchNotFoundError(match_id)
        
    
    async def get_matches_by_team_id(self, team_id: str) -> list[Match]:
        """
        Get all matches played by a team
        """
        team = await self.team_repo.get_team_by_id(team_id)
        if not team:
            raise TeamNotFoundError()
        return await self.match_repo.get_matches_by_ids(team.matches)
    

    async def update_match(self, match_id: str, match: Match) -> Match:
        """
        Update a match
        """
        existing_match = await self.match_repo.get_match_by_id(match_id)
        if not existing_match:
            raise MatchNotFoundError(match_id)
        
        # Check if match data is valid
        team_lookup = await self.get_team_lookup()
        team1, team2  = team_lookup[match.teams[0].name], team_lookup[match.teams[1].name]
        if not team1.name in team_lookup or not team2.name in team_lookup:
            raise MatchUpdateError(f"Match involves invalid team(s)")
        
        elif team1.group != team2.group:
            raise MatchUpdateError(f"Match involves teams {team1.name} and {team2.name} from different groups")
        
        elif has_previous_match(team1, team2, match_id):
            raise MatchUpdateError(f"Match involves teams {team1.name} and {team2.name} that have already played each other")
        
        changes = await get_match_changes(match_id, match, self.match_repo)
        logger.info(f"Match {match_id} updated: {changes}")
        
        return await self.match_repo.update_match(match_id, match)
