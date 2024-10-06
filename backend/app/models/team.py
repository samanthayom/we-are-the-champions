
from datetime import datetime
from pydantic import BaseModel, Field, field_validator
from uuid import uuid4


class TeamModel(BaseModel):
    """
    Represents a particpating team
    """
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str = Field(..., description="Team name")
    registration_date: datetime = Field(..., description="Date of registration")
    group: int = Field(..., description="Group number")
    matches: list[str] = Field(default_factory=list, description="List of IDs of matches played")
    
    points: int = Field(0, description="Points calculated based on: W 3 points, D 1 point, L 0 points")
    alt_points: int = Field(0, description="Points calculated based on: W 5 points, D 3 point, L 1 point")
    wins: int = Field(0, description="Number of wins")
    draws: int = Field(0, description="Number of draws")
    losses: int = Field(0, description="Number of losses")
    goals: int = Field(0, description="Number of goals scored")


    @field_validator("group")
    @classmethod
    def check_group(cls, group: int) -> int:
        if group not in {1, 2}:
            raise ValueError("Group must be either 1 or 2")
        return group


    def update_stats(self, team_score: int, opponent_score: int):
        """
        Update the stats of the team based on the match result
        """
        if team_score > opponent_score:
            self.points += 3
            self.alt_points += 5
            self.wins += 1
        elif team_score == opponent_score:
            self.points += 1
            self.alt_points += 3
            self.draws += 1
        else:
            self.points += 0
            self.alt_points += 1
            self.losses += 1
        
        self.goals += team_score
