import asyncio
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from sqlmodel import Session, select, delete
from app.config import settings
from app.db import engine
from app.models import EventRecord, TrendScoreRecord, NarrativeEventRecord, ReplayStateResponse
from app.services.trend import calculate_trend_score_for_topic
from app.services.narrative import evaluate_narrative_for_topic

DATASET_PATH = Path(__file__).resolve().parent.parent / "data" / "replay_dataset.json"

class ReplayManager:
    def __init__(self):
        self.is_running: bool = False
        self.is_completed: bool = False
        self.current_tick: int = 0
        self.tick_seconds: float = settings.replay_tick_seconds
        self.current_timestamp: Optional[str] = None
        self._dataset: List[Dict[str, Any]] = []
        self._max_tick: int = 0
        self._task: Optional[asyncio.Task] = None
        self.load_dataset()
        self.sync_with_db()

    def load_dataset(self):
        """Load synthetic dataset from JSON file."""
        if DATASET_PATH.exists():
            with open(DATASET_PATH, "r", encoding="utf-8") as f:
                self._dataset = json.load(f)
            if self._dataset:
                self._max_tick = max(e.get("tick", 1) for e in self._dataset)
        else:
            self._dataset = []
            self._max_tick = 0

    def sync_with_db(self):
        """Sync internal tick counter with database records on startup."""
        try:
            with Session(engine) as session:
                db_ticks = session.exec(select(EventRecord.tick)).all()
                if db_ticks:
                    self.current_tick = max(db_ticks)
                    latest_event = session.exec(
                        select(EventRecord).order_by(EventRecord.timestamp.desc())
                    ).first()
                    if latest_event:
                        self.current_timestamp = latest_event.timestamp
                else:
                    self.current_tick = 0
                    self.current_timestamp = None
        except Exception:
            self.current_tick = 0
            self.current_timestamp = None

    def reset(self):
        """Stop playback and clear all runtime database tables."""
        self.is_running = False
        self.is_completed = False
        self.current_tick = 0
        self.current_timestamp = None

        if self._task and not self._task.done():
            self._task.cancel()
            self._task = None

        with Session(engine) as session:
            session.exec(delete(EventRecord))
            session.exec(delete(TrendScoreRecord))
            session.exec(delete(NarrativeEventRecord))
            session.commit()

    def step_tick(self) -> Dict[str, Any]:
        """Advance one tick forward, ingest batch into SQLite, recompute trends, and evaluate narratives."""
        if self.current_tick >= self._max_tick:
            self.is_completed = True
            self.is_running = False
            return {
                "current_tick": self.current_tick,
                "ingested_count": 0,
                "is_completed": True
            }

        next_tick = self.current_tick + 1
        tick_events = [e for e in self._dataset if e.get("tick") == next_tick]

        latest_ts = self.current_timestamp
        with Session(engine) as session:
            # 1. Clean any existing events for this tick/IDs to ensure idempotence
            event_ids = [raw["event_id"] for raw in tick_events]
            if event_ids:
                session.exec(delete(EventRecord).where(EventRecord.event_id.in_(event_ids)))
            session.exec(delete(TrendScoreRecord).where(TrendScoreRecord.tick == next_tick))
            session.exec(delete(NarrativeEventRecord).where(NarrativeEventRecord.tick == next_tick))
            session.commit()

            # 2. Ingest events for this tick
            for raw in tick_events:
                eng = raw.get("engagement", {})
                event_rec = EventRecord(
                    event_id=raw["event_id"],
                    platform=raw["platform"],
                    platform_post_id=raw["platform_post_id"],
                    author_id=raw["author_id"],
                    author_name=raw.get("author_name"),
                    parent_post_id=raw.get("parent_post_id"),
                    timestamp=raw["timestamp"],
                    text=raw["text"],
                    language=raw.get("language", "en"),
                    hashtags=raw.get("hashtags", []),
                    reply_to=raw.get("reply_to"),
                    reshare_of=raw.get("reshare_of"),
                    mentions=raw.get("mentions", []),
                    likes=eng.get("likes", 0),
                    shares=eng.get("shares", 0),
                    comments=eng.get("comments", 0),
                    views=eng.get("views", 0),
                    topic=raw["topic"],
                    sentiment=raw.get("sentiment", "neutral"),
                    emotion=raw.get("emotion", []),
                    community=raw.get("community"),
                    tick=next_tick
                )
                session.add(event_rec)
                latest_ts = raw["timestamp"]

            session.commit()

            # 3. Recompute trend scores and narrative events for all active topics
            active_topics = session.exec(
                select(EventRecord.topic).where(EventRecord.tick <= next_tick).distinct()
            ).all()

            for topic in active_topics:
                score_rec = calculate_trend_score_for_topic(
                    session=session,
                    topic=topic,
                    current_tick=next_tick,
                    current_timestamp=latest_ts or ""
                )

                # 4. Evaluate Narrative Innovation Layer
                evaluate_narrative_for_topic(
                    session=session,
                    topic=topic,
                    current_tick=next_tick,
                    current_timestamp=latest_ts or "",
                    latest_score_record=score_rec
                )

        self.current_tick = next_tick
        self.current_timestamp = latest_ts
        if self.current_tick >= self._max_tick:
            self.is_completed = True
            self.is_running = False

        return {
            "current_tick": self.current_tick,
            "ingested_count": len(tick_events),
            "is_completed": self.is_completed
        }

    async def _run_loop(self):
        """Continuous ticker background loop."""
        try:
            while self.is_running and not self.is_completed:
                await asyncio.sleep(self.tick_seconds)
                if not self.is_running:
                    break
                self.step_tick()
                if self.is_completed:
                    break
        except asyncio.CancelledError:
            pass
        except Exception as e:
            print("Error in replay _run_loop:", e)
        finally:
            self.is_running = False

    def start(self):
        """Start or resume background replay loop."""
        if self.is_completed:
            self.reset()
        if not self.is_running:
            self.is_running = True
            try:
                loop = asyncio.get_running_loop()
                self._task = loop.create_task(self._run_loop())
            except RuntimeError:
                self._task = asyncio.create_task(self._run_loop())

    def pause(self):
        """Pause playback."""
        self.is_running = False
        if self._task and not self._task.done():
            self._task.cancel()
            self._task = None

    def get_state(self) -> ReplayStateResponse:
        """Return the current replay engine state."""
        with Session(engine) as session:
            count = len(session.exec(select(EventRecord)).all())

        return ReplayStateResponse(
            is_running=self.is_running,
            is_completed=self.is_completed,
            current_tick=self.current_tick,
            total_ticks=self._max_tick,
            tick_seconds=self.tick_seconds,
            current_timestamp=self.current_timestamp,
            total_events_in_db=count,
            total_dataset_events=len(self._dataset),
            mode_label="Historical Dataset Replay Mode"
        )

# Global singleton replay instance
replay_manager = ReplayManager()
