from backend.app.models.team import TeamModel
from backend.app.models.match import MatchModel
from backend.app.db.repositories.team import TeamRepository
from backend.app.db.repositories.match import MatchRepository
from backend.app.exceptions import TeamNotFoundError, MatchCreationError


def is_valid_group(team: TeamModel) -> bool:
    """
    Check if the group number is either 1 or 2
    """
    return team.group in [1, 2]


async def is_unique_name(team: TeamModel, team_repo: TeamRepository) -> bool:
    """
    Check if the team name is unique
    """
    existing_team = await team_repo.get_team_by_name(team.name)
    if existing_team and existing_team.id != team.id:
        return False
    return True


def get_invalid_match_teams(match: MatchModel, all_team_names: set[str]) -> list[str]:
    """
    Validate that all teams in the match exist
    """
    return [team.name for team in match.teams if team.name not in all_team_names]
    

def get_previous_matches(match: MatchModel, team_lookup: dict[str, TeamModel]) -> list[str]:
    """
    Check if the teams have already played each other
    """
    team1, team2 = match.teams[0].name, match.teams[1].name
    team1_matches, team2_matches = set(team_lookup[team1].matches), set(team_lookup[team2].matches)   
    prev_match_ids = team1_matches.intersection(team2_matches)
    return prev_match_ids
