from backend.app.models.team import Team
from backend.app.models.match import Match
from backend.app.db.repositories.team import TeamRepository
from backend.app.db.repositories.match import MatchRepository


async def has_valid_team_name(team: Team, team_repo: TeamRepository) -> bool:
    """
    Check if the team name is unique
    """
    existing_team = await team_repo.get_team_by_name(team.name)
    if existing_team and existing_team.id != team.id:
        return False
    return True


def has_previous_match(team1: Team, team2: Team, match_id: str) -> bool:
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


def has_valid_grouping(teams: list[Team]) -> bool:
    """
    Check if there are exactly 6 teams in each group
    """
    group1_count = sum(1 for team in teams if team.group == 1)
    group2_count = sum(1 for team in teams if team.group == 2)
    return group1_count == 6 and group2_count == 6


async def get_team_changes(team_id: str, new_data: Team, team_repo: TeamRepository) -> str:
    """
    Identify changes in the team data
    """
    changes = {}
    prev_team = await team_repo.get_team_by_id(team_id)
    for field, new_value in new_data.model_dump(by_alias=True).items():
        old_value = getattr(prev_team, field)
        if old_value != new_value:
            changes[field] = {
                "previous": getattr(prev_team, field),
                "new": new_value
            }
    return changes


async def get_match_changes(match_id: str, new_data: Match, match_repo: MatchRepository) -> str:
    """
    Identify changes in the match data
    """
    changes = {}
    prev_match = await match_repo.get_match_by_id(match_id)
    for field, new_value in new_data.model_dump(by_alias=True).items():
        old_value = getattr(prev_match, field)
        if old_value != new_value:
            changes[field] = {
                "previous": getattr(prev_match, field),
                "new": new_value
            }
    return changes
