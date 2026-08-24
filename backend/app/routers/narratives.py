from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Dict, Any, Optional
from app.db import get_session
from app.services.replay import replay_manager
from app.models import NarrativeEventRecord, EventRecord, TrendScoreRecord

router = APIRouter(prefix="/api/narratives", tags=["Narratives"])

@router.get("")
def get_all_narratives(session: Session = Depends(get_session)):
    """Retrieve all active narratives with lifecycle status, mutation, and innovation flags."""
    current_tick = replay_manager.current_tick
    topics = session.exec(
        select(EventRecord.topic).where(EventRecord.tick <= current_tick).distinct()
    ).all()

    results = []
    for topic in topics:
        latest_score = session.exec(
            select(TrendScoreRecord).where(
                TrendScoreRecord.topic == topic,
                TrendScoreRecord.tick <= current_tick
            ).order_by(TrendScoreRecord.tick.desc())
        ).first()

        events = session.exec(
            select(NarrativeEventRecord).where(
                NarrativeEventRecord.topic == topic,
                NarrativeEventRecord.tick <= current_tick
            ).order_by(NarrativeEventRecord.tick)
        ).all()

        mutation_event = next((e for e in events if e.event_type == "MUTATION_DETECTED"), None)
        migration_event = next((e for e in events if e.event_type == "ATTENTION_MIGRATION"), None)
        weak_signal_event = next((e for e in events if e.event_type == "WEAK_SIGNAL"), None)

        post_count = len(session.exec(
            select(EventRecord).where(
                EventRecord.topic == topic,
                EventRecord.tick <= current_tick
            )
        ).all())

        results.append({
            "topic": topic,
            "lifecycle_stage": latest_score.lifecycle_stage if latest_score else "SEED",
            "trend_score": latest_score.composite_score if latest_score else 0.0,
            "event_count": post_count,
            "mutation_detected": mutation_event is not None,
            "mutation_data": mutation_event.meta_data if mutation_event else None,
            "attention_migration": migration_event is not None,
            "migration_data": migration_event.meta_data if migration_event else None,
            "is_weak_signal": weak_signal_event is not None,
            "narrative_events_count": len(events),
            "tick": current_tick
        })

    return results

@router.get("/{topic}")
def get_narrative_detail(topic: str, session: Session = Depends(get_session)):
    """Retrieve comprehensive details of a specific narrative."""
    current_tick = replay_manager.current_tick
    latest_score = session.exec(
        select(TrendScoreRecord).where(
            TrendScoreRecord.topic == topic,
            TrendScoreRecord.tick <= current_tick
        ).order_by(TrendScoreRecord.tick.desc())
    ).first()

    if not latest_score:
        raise HTTPException(status_code=404, detail=f"Narrative '{topic}' not found")

    events = session.exec(
        select(NarrativeEventRecord).where(
            NarrativeEventRecord.topic == topic,
            NarrativeEventRecord.tick <= current_tick
        ).order_by(NarrativeEventRecord.tick)
    ).all()

    all_posts = session.exec(
        select(EventRecord).where(
            EventRecord.topic == topic,
            EventRecord.tick <= current_tick
        )
    ).all()

    return {
        "topic": topic,
        "lifecycle_stage": latest_score.lifecycle_stage,
        "trend_score": latest_score.composite_score,
        "breakdown": {
            "volume_growth": latest_score.volume_growth,
            "engagement_velocity": latest_score.engagement_velocity,
            "acceleration": latest_score.acceleration,
            "anomaly": latest_score.anomaly,
            "sentiment_shift": latest_score.sentiment_shift,
            "network_propagation": latest_score.network_propagation
        },
        "total_posts": len(all_posts),
        "events_timeline": events,
        "last_updated": latest_score.timestamp,
        "tick": current_tick
    }

@router.get("/{topic}/timeline", response_model=List[NarrativeEventRecord])
def get_narrative_timeline(topic: str, session: Session = Depends(get_session)):
    """Chronological list of all narrative lifecycle, mutation, migration, and weak signal events."""
    current_tick = replay_manager.current_tick
    events = session.exec(
        select(NarrativeEventRecord).where(
            NarrativeEventRecord.topic == topic,
            NarrativeEventRecord.tick <= current_tick
        ).order_by(NarrativeEventRecord.tick)
    ).all()
    return events

@router.get("/{topic}/evidence")
def get_narrative_evidence(topic: str, session: Session = Depends(get_session)):
    """Retrieve supporting evidence posts with citations and engagement metrics."""
    current_tick = replay_manager.current_tick
    posts = session.exec(
        select(EventRecord).where(
            EventRecord.topic == topic,
            EventRecord.tick <= current_tick
        ).order_by(EventRecord.likes.desc())
    ).all()

    return {
        "topic": topic,
        "total_evidence_count": len(posts),
        "evidence_posts": posts,
        "confidence_score": 0.89 if len(posts) > 10 else 0.76
    }
