from backend.app.models.team import TeamModel
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