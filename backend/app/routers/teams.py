import logging
from fastapi import APIRouter, Depends, Request, HTTPException

from backend.app.services.team import TeamService
from backend.app.db.repositories.team import TeamRepository
from backend.app.models.team import Team
from backend.app.exceptions import TeamCreationError, TeamNotFoundError, TeamUpdateError
from backend.app.logger import get_logger

router = APIRouter(prefix="/teams")


logger = get_logger(__name__)


def _get_team_service(request: Request) -> TeamService:
    db = request.app.state.db
    team_repo = TeamRepository(db)
    return TeamService(team_repo)


@router.get("/", response_model=list[Team])
async def get_teams(team_service: TeamService = Depends(_get_team_service)):
    try:
        teams = await team_service.get_all_teams()
        logger.success(f"Successfully retreived {len(teams)} teams")
        return teams
    except Exception as e:
        logger.error(f"Error retrieving teams: str{e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=list[Team])
async def create_teams(teams: list[Team], team_service: TeamService = Depends(_get_team_service)):
    try: 
        created_teams = await team_service.create_teams(teams)
        logger.success(f"Successfully created {len(created_teams)} teams")
        return created_teams
    except TeamCreationError as e:
        logger.error(str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating teams: str{e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/")
async def delete_all_teams(team_service: TeamService = Depends(_get_team_service)):
    try:
        await team_service.delete_all_teams()
        logger.success("Successfully deleted all teams")
        return {"message": "All teams have been deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting all teams: str{e}")
        raise HTTPException(status_code=500, detail=str(e))
    


@router.get("/{team_id}", response_model=Team)
async def get_team(team_id: str, team_service: TeamService = Depends(_get_team_service)):
    try:
        team = await team_service.get_team(team_id)
        logger.success(f"Successfully retrieved team {team.name}")
        return team
    except TeamNotFoundError as e:
        logger.error(str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving team {team_id}: str{e}")
        raise HTTPException(status_code=500, detail=str(e))
    

@router.put("/{team_id}", response_model=Team)
async def update_team(team_id: str, team: Team, team_service: TeamService = Depends(_get_team_service)):
    try:
        updated_team = await team_service.update_team(team_id, team)
        logger.success(f"Successfully updated team {updated_team.name}")
        return updated_team
    except TeamUpdateError as e:
        logger.error(str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating team {team_id}: str{e}")
        raise HTTPException(status_code=500, detail=str(e))

