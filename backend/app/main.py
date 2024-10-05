import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routers.teams import router as teams_router
from backend.app.routers.matches import router as matches_router
from backend.app.db.config import Database


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

# Include routers
app.include_router(teams_router)
app.include_router(matches_router)


@app.get("/")
async def root():
    return {"message": "The GovTech Football Championship Tracker is running."}


# TODO: Remove this for production
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
 
