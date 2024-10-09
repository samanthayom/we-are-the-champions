from fastapi import APIRouter, Depends, Request, HTTPException

from ..services.ranking import RankingService
from ..db.repositories.team import TeamRepository
from ..db.repositories.match import MatchRepository
from ..exceptions import RankingProcessingError
from ..logger import get_logger


router = APIRouter(prefix="/rankings")

logger = get_logger(__name__)


def _get_ranking_service(request: Request) -> RankingService:
    db = request.app.state.db
    team_repo = TeamRepository(db)
    match_repo = MatchRepository(db)
    return RankingService(team_repo, match_repo)


@router.get("/")
async def get_rankings(ranking_service: RankingService = Depends(_get_ranking_service)):
    try:
        rankings = await ranking_service.get_rankings()
        logger.success(f"Successfully retrieved rankings")
        return rankings
    except RankingProcessingError as e:
        logger.error(str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving rankings: {e}")
        raise HTTPException(status_code=500, detail=str(e))
