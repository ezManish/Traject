from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session
from app.db import get_session
from app.services.replay import replay_manager
from app.services.ai_analyst import generate_narrative_briefing, answer_analyst_query

router = APIRouter(prefix="/api/ai", tags=["AI Analyst"])

class NarrativeBriefingRequest(BaseModel):
    topic: str

class AnalystQueryRequest(BaseModel):
    topic: str
    question: str

@router.post("/narrative-briefing")
async def get_briefing(body: NarrativeBriefingRequest, session: Session = Depends(get_session)):
    """Generate evidence-grounded 'Why is this trending?' briefing."""
    current_tick = replay_manager.current_tick
    return await generate_narrative_briefing(session, body.topic, current_tick)

@router.post("/query")
async def query_analyst(body: AnalystQueryRequest, session: Session = Depends(get_session)):
    """Answer an analyst inquiry strictly grounded in structured SQLite evidence."""
    current_tick = replay_manager.current_tick
    return await answer_analyst_query(session, body.topic, current_tick, body.question)
