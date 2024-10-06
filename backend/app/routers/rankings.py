from fastapi import APIRouter, Depends, Request, HTTPException

from backend.app.services.ranking import RankingService
from backend.app.db.repositories.team import TeamRepository
from backend.app.db.repositories.match import MatchRepository
from backend.app.models.team import TeamModel
from backend.app.exceptions import RankingProcessingError

router = APIRouter(prefix="/rankings")


def _get_ranking_service(request: Request) -> RankingService:
    db = request.app.state.db
    team_repo = TeamRepository(db)
    match_repo = MatchRepository(db)
    return RankingService(team_repo, match_repo)


@router.get("/")
async def get_rankings(ranking_service: RankingService = Depends(_get_ranking_service)):
    try:
        return await ranking_service.get_rankings()
    except RankingProcessingError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
