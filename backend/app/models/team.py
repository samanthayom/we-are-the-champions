
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

    @field_validator("group")
    @classmethod
    def check_group(cls, group: int) -> int:
        if group not in {1, 2}:
            raise ValueError("Group must be either 1 or 2")
        return group
