from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Column, JSON
from pydantic import BaseModel

# ==========================================
# Database Table Models (SQLModel)
# ==========================================

class EventRecord(SQLModel, table=True):
    __tablename__ = "events"

    event_id: str = Field(primary_key=True, index=True)
    platform: str = Field(index=True)  # "X" | "Telegram"
    platform_post_id: str
    author_id: str = Field(index=True)
    author_name: Optional[str] = None
    parent_post_id: Optional[str] = None
    timestamp: str = Field(index=True)
    text: str
    language: str = "en"
    hashtags: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    reply_to: Optional[str] = None
    reshare_of: Optional[str] = None
    mentions: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    
    # Engagement breakdown
    likes: int = 0
    shares: int = 0
    comments: int = 0
    views: int = 0
    
    topic: str = Field(index=True)
    sentiment: str = "neutral"  # positive | neutral | negative
    emotion: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    community: Optional[str] = None
    
    # Ingestion metadata
    tick: int = Field(default=0, index=True)


class TrendScoreRecord(SQLModel, table=True):
    __tablename__ = "trend_scores"

    id: Optional[int] = Field(default=None, primary_key=True)
    topic: str = Field(index=True)
    tick: int = Field(index=True)
    timestamp: str
    
    volume_growth: float = 0.0
    engagement_velocity: float = 0.0
    acceleration: float = 0.0
    anomaly: float = 0.0
    sentiment_shift: float = 0.0
    network_propagation: float = 0.0
    composite_score: float = 0.0
    
    lifecycle_stage: str = "SEED"
    event_count: int = 0


class NarrativeEventRecord(SQLModel, table=True):
    __tablename__ = "narrative_events"

    id: Optional[int] = Field(default=None, primary_key=True)
    topic: str = Field(index=True)
    tick: int = Field(index=True)
    timestamp: str
    event_type: str = Field(index=True)  # LIFECYCLE_TRANSITION, MUTATION_DETECTED, ATTENTION_MIGRATION, WEAK_SIGNAL
    title: str
    description: str
    evidence_post_ids: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    confidence: float = 0.85
    meta_data: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))


# ==========================================
# Pydantic Schemas / DTOs
# ==========================================

class Engagement(BaseModel):
    likes: int = 0
    shares: int = 0
    comments: int = 0
    views: int = 0


class EventSchema(BaseModel):
    event_id: str
    platform: str
    platform_post_id: str
    author_id: str
    author_name: Optional[str] = None
    parent_post_id: Optional[str] = None
    timestamp: str
    text: str
    language: str = "en"
    hashtags: List[str] = []
    reply_to: Optional[str] = None
    reshare_of: Optional[str] = None
    mentions: List[str] = []
    engagement: Engagement = Engagement()
    topic: str
    sentiment: str = "neutral"
    emotion: List[str] = []
    community: Optional[str] = None
    tick: int = 0


class TrendScoreBreakdown(BaseModel):
    volume_growth: float
    engagement_velocity: float
    acceleration: float
    anomaly: float
    sentiment_shift: float
    network_propagation: float
    composite_score: float


class TrendSummary(BaseModel):
    topic: str
    trend_score: float
    lifecycle_stage: str
    breakdown: TrendScoreBreakdown
    event_count: int
    sentiment_distribution: Dict[str, int]
    top_emotions: List[str]
    active_platforms: Dict[str, int]
    last_updated: str
    tick: int


class ReplayStateResponse(BaseModel):
    is_running: bool
    is_completed: bool
    current_tick: int
    total_ticks: int
    tick_seconds: float
    current_timestamp: Optional[str]
    total_events_in_db: int
    total_dataset_events: int
    mode_label: str = "Historical Dataset Replay Mode"
