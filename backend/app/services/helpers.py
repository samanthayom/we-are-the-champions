from backend.app.models.team import TeamModel
from backend.app.models.match import MatchModel
from backend.app.db.repositories.team import TeamRepository


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
    

def has_previous_match(team1: TeamModel, team2: TeamModel) -> bool:
    """
    Check if the teams have already played each other
    """
    team1_matches, team2_matches = set(team1.matches), set(team2.matches)   
    return bool(team1_matches.intersection(team2_matches))


def is_valid_grouping(teams: list[TeamModel]) -> bool:
    """
    Check if there are exactly 6 teams in each group
    """
    group1_count = sum(1 for team in teams if team.group == 1)
    group2_count = sum(1 for team in teams if team.group == 2)
    return group1_count == 6 and group2_count == 6


def rank_teams(teams: list[TeamModel]) -> list[TeamModel]:
    """
    Rank teams based on points, goals, alternate points, and registration date
    """
    return sorted(
        teams,
        key=lambda team: (
            -team.points,
            -team.goals,
            -team.alt_points,
            team.registration_date
        )
    )