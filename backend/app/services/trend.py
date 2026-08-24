from typing import List, Dict, Any, Optional
from sqlmodel import Session, select
from app.models import EventRecord, TrendScoreRecord, TrendScoreBreakdown, TrendSummary
import math

def calculate_trend_score_for_topic(
    session: Session,
    topic: str,
    current_tick: int,
    current_timestamp: str
) -> Optional[TrendScoreRecord]:
    """
    Computes deterministic 6-factor trend score according to TRD §7:
    TS = 0.25·VolumeGrowth + 0.20·EngagementVelocity + 0.20·Acceleration + 0.15·Anomaly + 0.10·SentimentShift + 0.10·NetworkPropagation
    All components normalized 0–100 against topic trajectory baselines.
    """
    # 1. Fetch all events for this topic up to current_tick
    all_events = session.exec(
        select(EventRecord).where(
            EventRecord.topic == topic,
            EventRecord.tick <= current_tick
        ).order_by(EventRecord.tick)
    ).all()

    if not all_events:
        return None

    current_window_events = [e for e in all_events if e.tick == current_tick]
    prior_events = [e for e in all_events if e.tick < current_tick]
    
    total_events_count = len(all_events)
    current_win_count = len(current_window_events)
    tick_minus_1_count = len([e for e in all_events if e.tick == (current_tick - 1)])

    # 1. Volume Growth (0-100)
    if current_tick == 1:
        volume_growth = min(100.0, current_win_count * 6.0)
    else:
        growth_factor = (total_events_count / 28.0) * 55.0 + (current_win_count * 8.0)
        volume_growth = min(100.0, max(10.0, growth_factor))

    # 2. Engagement Velocity (0-100)
    window_engagement = sum(
        (e.likes + e.shares * 2 + e.comments * 3) for e in current_window_events
    )
    if window_engagement > 0:
        log_val = math.log10(max(1.0, float(window_engagement)))
        engagement_velocity = min(100.0, max(5.0, log_val * 24.0))
    else:
        engagement_velocity = 5.0

    # 3. Acceleration (0-100)
    if current_tick == 1:
        acceleration = 15.0
    else:
        diff = current_win_count - tick_minus_1_count
        if diff > 0:
            acceleration = min(100.0, 45.0 + diff * 18.0)
        elif diff == 0:
            acceleration = 40.0
        else:
            acceleration = max(10.0, 40.0 + diff * 14.0)

    # 4. Anomaly (0-100)
    if current_tick <= 2:
        anomaly = 12.0
    elif current_win_count >= 4 or window_engagement > 2000:
        anomaly = min(100.0, 55.0 + (current_win_count * 8.0))
    elif tick_minus_1_count > 0:
        ratio = current_win_count / tick_minus_1_count
        anomaly = min(100.0, max(15.0, ratio * 35.0))
    else:
        anomaly = 20.0

    # 5. Sentiment Shift (0-100)
    neg_count = sum(1 for e in all_events if e.sentiment == "negative")
    neg_ratio = neg_count / max(1, total_events_count)
    sentiment_shift = min(100.0, neg_ratio * 100.0)

    # 6. Network Propagation (0-100)
    platforms = set(e.platform for e in all_events)
    communities = set(e.community for e in all_events if e.community)
    cross_mentions = sum(len(e.mentions) for e in all_events)
    
    network_propagation = min(
        100.0,
        ((len(platforms) - 1) * 20.0) + (len(communities) * 15.0) + (cross_mentions * 4.0)
    )

    # Composite Trend Score
    composite_score = (
        0.25 * volume_growth +
        0.20 * engagement_velocity +
        0.20 * acceleration +
        0.15 * anomaly +
        0.10 * sentiment_shift +
        0.10 * network_propagation
    )
    composite_score = round(min(100.0, max(0.0, composite_score)), 1)

    # Fetch previous score record to determine state transitions
    prev_record = session.exec(
        select(TrendScoreRecord).where(
            TrendScoreRecord.topic == topic,
            TrendScoreRecord.tick == current_tick - 1
        )
    ).first()

    # Determine Lifecycle Stage: SEED -> EMERGING -> EXPANDING -> VIRAL -> SATURATION -> DECLINING -> DORMANT
    if composite_score >= 75.0:
        if prev_record and prev_record.lifecycle_stage in ("VIRAL", "SATURATION") and acceleration <= 40.0:
            lifecycle_stage = "SATURATION"
        else:
            lifecycle_stage = "VIRAL"
    elif composite_score >= 50.0:
        if prev_record and prev_record.lifecycle_stage in ("VIRAL", "SATURATION", "DECLINING"):
            lifecycle_stage = "DECLINING"
        else:
            lifecycle_stage = "EXPANDING"
    elif composite_score >= 25.0:
        if prev_record and prev_record.lifecycle_stage in ("VIRAL", "SATURATION", "DECLINING"):
            lifecycle_stage = "DECLINING"
        else:
            lifecycle_stage = "EMERGING"
    else:
        if prev_record and prev_record.lifecycle_stage in ("DECLINING", "DORMANT"):
            lifecycle_stage = "DORMANT"
        else:
            lifecycle_stage = "SEED"

    record = TrendScoreRecord(
        topic=topic,
        tick=current_tick,
        timestamp=current_timestamp,
        volume_growth=round(volume_growth, 1),
        engagement_velocity=round(engagement_velocity, 1),
        acceleration=round(acceleration, 1),
        anomaly=round(anomaly, 1),
        sentiment_shift=round(sentiment_shift, 1),
        network_propagation=round(network_propagation, 1),
        composite_score=composite_score,
        lifecycle_stage=lifecycle_stage,
        event_count=total_events_count
    )

    session.add(record)
    session.commit()
    session.refresh(record)
    return record


def get_latest_trend_summaries(session: Session, current_tick: int) -> List[TrendSummary]:
    """Retrieve the latest trend summary for each active topic at current_tick."""
    topics = session.exec(
        select(EventRecord.topic).where(EventRecord.tick <= current_tick).distinct()
    ).all()

    summaries: List[TrendSummary] = []
    for topic in topics:
        score_record = session.exec(
            select(TrendScoreRecord).where(
                TrendScoreRecord.topic == topic,
                TrendScoreRecord.tick <= current_tick
            ).order_by(TrendScoreRecord.tick.desc())
        ).first()

        events = session.exec(
            select(EventRecord).where(
                EventRecord.topic == topic,
                EventRecord.tick <= current_tick
            )
        ).all()

        sent_dist = {"positive": 0, "neutral": 0, "negative": 0}
        emotions: Dict[str, int] = {}
        platforms: Dict[str, int] = {}
        last_ts = ""

        for ev in events:
            sent_dist[ev.sentiment] = sent_dist.get(ev.sentiment, 0) + 1
            for em in (ev.emotion or []):
                emotions[em] = emotions.get(em, 0) + 1
            platforms[ev.platform] = platforms.get(ev.platform, 0) + 1
            if ev.timestamp > last_ts:
                last_ts = ev.timestamp

        sorted_emotions = sorted(emotions.keys(), key=lambda k: emotions[k], reverse=True)[:4]

        if score_record:
            breakdown = TrendScoreBreakdown(
                volume_growth=score_record.volume_growth,
                engagement_velocity=score_record.engagement_velocity,
                acceleration=score_record.acceleration,
                anomaly=score_record.anomaly,
                sentiment_shift=score_record.sentiment_shift,
                network_propagation=score_record.network_propagation,
                composite_score=score_record.composite_score
            )
            trend_score = score_record.composite_score
            stage = score_record.lifecycle_stage
            tick_val = score_record.tick
        else:
            breakdown = TrendScoreBreakdown(
                volume_growth=0,
                engagement_velocity=0,
                acceleration=0,
                anomaly=0,
                sentiment_shift=0,
                network_propagation=0,
                composite_score=0
            )
            trend_score = 0.0
            stage = "SEED"
            tick_val = current_tick

        summaries.append(
            TrendSummary(
                topic=topic,
                trend_score=trend_score,
                lifecycle_stage=stage,
                breakdown=breakdown,
                event_count=len(events),
                sentiment_distribution=sent_dist,
                top_emotions=sorted_emotions,
                active_platforms=platforms,
                last_updated=last_ts or "",
                tick=tick_val
            )
        )

    summaries.sort(key=lambda s: s.trend_score, reverse=True)
    return summaries
