from backend.app.models.team import TeamModel
from backend.app.models.match import MatchModel
from backend.app.db.repositories.team import TeamRepository


async def has_valid_team_name(team: TeamModel, team_repo: TeamRepository) -> bool:
    """
    Check if the team name is unique
    """
    existing_team = await team_repo.get_team_by_name(team.name)
    if existing_team and existing_team.id != team.id:
        return False
    return True


def has_previous_match(team1: TeamModel, team2: TeamModel, match_id: str) -> bool:
    """
    Check if the teams have already played each other
    """
    team1_matches, team2_matches = set(team1.matches), set(team2.matches) 
    prev_matches = team1_matches.intersection(team2_matches)
    if len(prev_matches) > 1:
        return True
    elif prev_matches and prev_matches.pop() != match_id:
        return True
    return False


def has_valid_grouping(teams: list[TeamModel]) -> bool:
    """
    Check if there are exactly 6 teams in each group
    """
    group1_count = sum(1 for team in teams if team.group == 1)
    group2_count = sum(1 for team in teams if team.group == 2)
    return group1_count == 6 and group2_count == 6
