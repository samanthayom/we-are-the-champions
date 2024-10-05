
from datetime import datetime
from pydantic import BaseModel, Field
from pydantic.functional_validators import BeforeValidator
from uuid import UUID, uuid4
from typing import Optional
from typing_extensions import Annotated


# Represents an ObjectId field in the database as a string
PyObjectId = Annotated[str, BeforeValidator(str)]

class TeamModel(BaseModel):
    """
    Represents a particpating team
    """
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str = Field(..., description="Team name")
    registration_date: datetime = Field(..., description="Date of registration")
    group: int = Field(..., description="Group number")