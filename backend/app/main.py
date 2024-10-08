import time
from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routers.teams import router as teams_router
from backend.app.routers.matches import router as matches_router
from backend.app.routers.rankings import router as rankings_router
from backend.app.db.config import Database
from backend.app.logger import get_logger


logger = get_logger(__name__)

# Connect to database on startup and close on shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db = Database()
    app.state.db.connect_db()
    yield
    app.state.db.close_db()

# Create app
app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Update this for production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time

    log_dict = {
        "method": request.method,
        "path": request.url.path,
        "status_code": response.status_code,
        "processing_time": f"{process_time:.4f}s",
    }

    logger.info(f"Request processed: {request.method} {request.url.path}", extra={"details": log_dict})
    
    return response


# Include routers
app.include_router(teams_router)
app.include_router(matches_router)
app.include_router(rankings_router)

@app.get("/")
async def root():
    return {"message": "The GovTech Football Championship Tracker is running."}


# TODO: Remove this for production
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True, access_log=False)
 