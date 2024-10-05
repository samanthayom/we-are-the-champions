from fastapi import APIRouter, Depends, Request, HTTPException

from backend.app.db.config import Database
from backend.app.services.team import TeamService
from backend.app.db.repositories.team import TeamRepository
from backend.app.models.team import TeamModel


router = APIRouter(prefix="/teams")


def _get_team_service(request: Request) -> TeamService:
    db = request.app.state.db
    team_repo = TeamRepository(db)
    return TeamService(team_repo)


@router.post("/", response_model=list[TeamModel])
async def create_teams(teams: list[TeamModel], team_service: TeamService = Depends(_get_team_service)):
    try: 
        return await team_service.create_teams(teams)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/")
async def delete_all_teams(team_service: TeamService = Depends(_get_team_service)):
    try:
        await team_service.delete_all_teams()
        return {"message": "All teams have been deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@router.get("/{team_id}", response_model=TeamModel)
async def get_team(team_id: str, team_service: TeamService = Depends(_get_team_service)):
    try:
        return await team_service.get_team(team_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.put("/{team_id}", response_model=TeamModel)
async def update_team(team_id: str, team: TeamModel, team_service: TeamService = Depends(_get_team_service)):
    try:
        return await team_service.update_team(team_id, team)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

