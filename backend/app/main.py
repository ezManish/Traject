from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import init_db
from app.routers import replay, trends, narratives, ai

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database schema
    init_db()
    yield

app = FastAPI(
    title="TRAJECT — Narrative Intelligence Platform API",
    description="Backend API powering TRAJECT (SIH 2026 PS26152 / NTRO)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(replay.router)
app.include_router(trends.router)
app.include_router(narratives.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {
        "system": "TRAJECT Narrative Intelligence Platform",
        "mode": "Historical Dataset Replay Mode",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "mode": "Historical Dataset Replay Mode"}
