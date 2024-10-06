from backend.app.db.repositories.team import TeamRepository
from backend.app.db.repositories.match import MatchRepository
from backend.app.models.team import TeamModel
from backend.app.services.helpers import is_valid_grouping, rank_teams
from backend.app.exceptions import RankingProcessingError

class RankingService:
    def __init__(self, team_repository: TeamRepository, match_repository: MatchRepository):
        self.team_repo = team_repository
        self.match_repo = match_repository


    async def get_rankings(self) -> dict[str, list[TeamModel]]:
        """
        Get rankings of teams based on matches played
        """
        # Check if the number of teams in each group is valid
        teams = {team.name: team for team in await self.team_repo.get_all_teams()}  
        if not is_valid_grouping(teams.values()):
            raise RankingProcessingError("Each group must have exactly 6 teams")


        matches = await self.match_repo.get_all_matches()
        for match in matches:
            team1, team2 = teams[match.teams[0].name], teams[match.teams[1].name]
            team1_score, team2_score = match.teams[0].score, match.teams[1].score

            # Update points based on match result
            team1.update_stats(team1_score, team2_score)
            team2.update_stats(team2_score, team1_score)
        

        # Sort teams by points, goals, alternate points, and registration date
        group1_teams = [team for team in teams.values() if team.group == 1]
        group2_teams = [team for team in teams.values() if team.group == 2]

        return {
            "group1": rank_teams(group1_teams),
            "group2": rank_teams(group2_teams)
        }