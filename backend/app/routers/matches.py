from fastapi import APIRouter, Depends, Request, HTTPException

from backend.app.services.match import MatchService
from backend.app.db.repositories.match import MatchRepository
from backend.app.db.repositories.team import TeamRepository
from backend.app.models.match import Match
from backend.app.exceptions import MatchCreationError, MatchNotFoundError, TeamNotFoundError
from backend.app.logger import get_logger


router = APIRouter(prefix="/matches")

logger = get_logger(__name__)


def _get_match_service(request: Request) -> MatchService:
    db = request.app.state.db
    match_repo = MatchRepository(db)
    team_repo = TeamRepository(db)
    return MatchService(match_repo, team_repo)


@router.get("/", response_model=list[Match])
async def get_matches(match_service: MatchService = Depends(_get_match_service)):
    try:
        matches = await match_service.get_all_matches()
        logger.success(f"Successfully retrieved {len(matches)} matches")
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=list[Match])
async def create_matches(matches: list[Match], match_service: MatchService = Depends(_get_match_service)):
    try:
        created_matches = await match_service.create_matches(matches)
        logger.success(f"Successfully created {len(created_matches)} matches")
        return created_matches
    except MatchCreationError as e:
        logger.error(str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating matches: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/")
async def delete_all_matches(match_service: MatchService = Depends(_get_match_service)):
    try:
        await match_service.delete_all_matches()
        logger.success("Successfully deleted all matches")
        return {"message": "All matches have been deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting all matches: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{team_id}", response_model=list[Match])
async def get_matches_by_team_id(team_id: str, match_service: MatchService = Depends(_get_match_service)):
    try:
        matches = await match_service.get_matches_by_team_id(team_id)
        logger.success(f"Successfully retrieved {len(matches)} matches for team {team_id}")
        return matches
    except TeamNotFoundError as e:
        logger.error(str(e))
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving matches for team {team_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{match_id}", response_model=Match)
async def update_match(match_id: str, match: Match, match_service: MatchService = Depends(_get_match_service)):
    try:
        updated_match = await match_service.update_match(match_id, match)
        logger.success(f"Successfully updated match {match_id}")
        return updated_match
    except MatchNotFoundError as e:
        logger.error(str(e))
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating match {match_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

