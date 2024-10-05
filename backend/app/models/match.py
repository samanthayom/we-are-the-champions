from pydantic import BaseModel, field_validator, Field
from uuid import uuid4

from backend.app.models.team import TeamModel
from backend.app.exceptions import TeamNotFoundError

class MatchTeamModel(BaseModel):
    """
    Represents a team in a match
    """
    name: str
    score: int


class MatchModel(BaseModel):
    """
    Represents a match between exactly two teams
    """
    id: str = Field(default_factory=lambda: str(uuid4()))
    teams: list[MatchTeamModel]

    
    @field_validator("teams")
    def has_two_teams(cls, teams: list[MatchTeamModel]) -> list[MatchTeamModel]:
        """
        Check if there are two teams involved in the match and that they are not the same
        """
        if len(teams) != 2:
            raise ValueError("There must be exactly two teams in a match")
        elif teams[0].name == teams[1].name:
            raise ValueError("Team cannot play against itself")
        return teams