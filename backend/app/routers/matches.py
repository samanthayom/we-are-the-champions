from fastapi import APIRouter, Depends, Request, HTTPException

from backend.app.services.match import MatchService
from backend.app.db.repositories.match import MatchRepository
from backend.app.db.repositories.team import TeamRepository
from backend.app.models.match import MatchModel
from backend.app.exceptions import MatchCreationError, MatchNotFoundError, TeamNotFoundError

router = APIRouter(prefix="/matches")

def _get_match_service(request: Request) -> MatchService:
    db = request.app.state.db
    match_repo = MatchRepository(db)
    team_repo = TeamRepository(db)
    return MatchService(match_repo, team_repo)


@router.get("/", response_model=list[MatchModel])
async def get_matches(match_service: MatchService = Depends(_get_match_service)):
    try:
        return await match_service.get_all_matches()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=list[MatchModel])
async def create_matches(matches: list[MatchModel], match_service: MatchService = Depends(_get_match_service)):
    try:
        return await match_service.create_matches(matches)
    except MatchCreationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/")
async def delete_all_matches(match_service: MatchService = Depends(_get_match_service)):
    try:
        await match_service.delete_all_matches()
        return {"message": "All matches have been deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{team_id}", response_model=list[MatchModel])
async def get_matches_by_team_id(team_id: str, match_service: MatchService = Depends(_get_match_service)):
    try:
        return await match_service.get_matches_by_team_id(team_id)
    except TeamNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{match_id}", response_model=MatchModel)
async def update_match(match_id: str, match: MatchModel, match_service: MatchService = Depends(_get_match_service)):
    try:
        return await match_service.update_match(match_id, match)
    except MatchNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

