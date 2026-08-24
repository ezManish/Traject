import re
from typing import List, Dict, Any, Optional, Set
from collections import Counter
from sqlmodel import Session, select
from app.models import EventRecord, TrendScoreRecord, NarrativeEventRecord

STOPWORDS = {
    "the", "is", "at", "which", "on", "a", "an", "and", "or", "in", "to", "for", "of",
    "with", "by", "from", "up", "about", "into", "over", "after", "this", "that", "it",
    "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
    "but", "not", "also", "very", "now", "just", "we", "they", "our", "their", "please",
    "what", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other",
    "some", "such", "no", "nor", "only", "own", "same", "so", "than", "too", "can", "will",
    "metro", "line", "station", "train", "delhi"
}

def extract_keywords(texts: List[str], top_k: int = 5) -> List[str]:
    """Extract top salient keywords/n-grams from a list of post texts."""
    words = []
    for text in texts:
        # Clean text
        clean = re.sub(r'http\S+|@\w+|#\w+|[^a-zA-Z\s]', '', text.lower())
        tokens = [w for w in clean.split() if len(w) > 3 and w not in STOPWORDS]
        words.extend(tokens)
    
    counts = Counter(words)
    return [w for w, _ in counts.most_common(top_k)]


def evaluate_narrative_for_topic(
    session: Session,
    topic: str,
    current_tick: int,
    current_timestamp: str,
    latest_score_record: Optional[TrendScoreRecord]
) -> List[NarrativeEventRecord]:
    """
    Evaluates Tier-1 Narrative Innovations per TRD §8:
    1. Lifecycle Transition Logging
    2. Framing Mutation Detection (early 30% vs late 30%)
    3. Platform Attention Migration
    4. Weak Signal Early Warning Detection
    """
    all_events = session.exec(
        select(EventRecord).where(
            EventRecord.topic == topic,
            EventRecord.tick <= current_tick
        ).order_by(EventRecord.tick)
    ).all()

    if not all_events or not latest_score_record:
        return []

    new_events: List[NarrativeEventRecord] = []
    total_count = len(all_events)

    # 1. Lifecycle Transition Detection
    prev_score_record = session.exec(
        select(TrendScoreRecord).where(
            TrendScoreRecord.topic == topic,
            TrendScoreRecord.tick == current_tick - 1
        )
    ).first()

    current_stage = latest_score_record.lifecycle_stage
    prev_stage = prev_score_record.lifecycle_stage if prev_score_record else None

    if current_stage != prev_stage:
        # Check if already recorded for this tick
        existing = session.exec(
            select(NarrativeEventRecord).where(
                NarrativeEventRecord.topic == topic,
                NarrativeEventRecord.tick == current_tick,
                NarrativeEventRecord.event_type == "LIFECYCLE_TRANSITION"
            )
        ).first()

        if not existing:
            evidence_ids = [e.event_id for e in all_events if e.tick == current_tick][:4]
            trans_event = NarrativeEventRecord(
                topic=topic,
                tick=current_tick,
                timestamp=current_timestamp,
                event_type="LIFECYCLE_TRANSITION",
                title=f"Stage Shift: {prev_stage or 'INIT'} -> {current_stage}",
                description=f"Narrative transitioned from {prev_stage or 'INIT'} to {current_stage} at trend score {latest_score_record.composite_score:.1f}.",
                evidence_post_ids=evidence_ids or [all_events[-1].event_id],
                confidence=0.92,
                meta_data={
                    "from_stage": prev_stage or "INIT",
                    "to_stage": current_stage,
                    "trend_score": latest_score_record.composite_score
                }
            )
            session.add(trans_event)
            new_events.append(trans_event)

    # 2. Mutation Detection (compare early 30% vs late 30%)
    if total_count >= 8:
        split_idx = max(2, int(total_count * 0.3))
        early_events = all_events[:split_idx]
        late_events = all_events[-split_idx:]

        early_keywords = extract_keywords([e.text for e in early_events], top_k=4)
        late_keywords = extract_keywords([e.text for e in late_events], top_k=4)

        # Measure keyword intersection/divergence
        shared = set(early_keywords).intersection(set(late_keywords))
        divergence = 1.0 - (len(shared) / max(1, len(set(early_keywords).union(set(late_keywords)))))

        # Trigger mutation if framing shifted significantly (e.g. grid/blackout appeared vs delay)
        has_blackout_framing = any(
            w in ["blackout", "grid", "feeder", "transformer", "power", "failure", "debacle"]
            for w in late_keywords
        )
        early_was_delay = any(
            w in ["delayed", "crowded", "slow", "interchange", "wait"]
            for w in early_keywords
        )

        if (divergence > 0.6 or (has_blackout_framing and early_was_delay)) and current_tick >= 4:
            existing_mut = session.exec(
                select(NarrativeEventRecord).where(
                    NarrativeEventRecord.topic == topic,
                    NarrativeEventRecord.event_type == "MUTATION_DETECTED"
                )
            ).first()

            if not existing_mut:
                early_phrase = "Routine Commuter Delay (" + ", ".join(early_keywords[:2]) + ")"
                late_phrase = "Power Grid Failure / Infrastructure Crisis (" + ", ".join(late_keywords[:2]) + ")"
                evidence_posts = [e.event_id for e in late_events if any(kw in e.text.lower() for kw in ["grid", "power", "blackout", "transformer", "substation"])][:4]
                if not evidence_posts:
                    evidence_posts = [e.event_id for e in late_events[:3]]

                mut_event = NarrativeEventRecord(
                    topic=topic,
                    tick=current_tick,
                    timestamp=current_timestamp,
                    event_type="MUTATION_DETECTED",
                    title="Narrative Mutation Detected",
                    description=f"Framing shifted from '{early_phrase}' to '{late_phrase}'.",
                    evidence_post_ids=evidence_posts,
                    confidence=0.88,
                    meta_data={
                        "from_framing": early_phrase,
                        "to_framing": late_phrase,
                        "early_keywords": early_keywords,
                        "late_keywords": late_keywords,
                        "divergence_score": round(divergence, 2)
                    }
                )
                session.add(mut_event)
                new_events.append(mut_event)

    # 3. Attention Migration Detection (Platform Share Shift)
    if total_count >= 6:
        split_mid = total_count // 2
        first_half = all_events[:split_mid]
        second_half = all_events[split_mid:]

        first_x = sum(1 for e in first_half if e.platform == "X") / max(1, len(first_half))
        first_tg = sum(1 for e in first_half if e.platform == "Telegram") / max(1, len(first_half))

        second_x = sum(1 for e in second_half if e.platform == "X") / max(1, len(second_half))
        second_tg = sum(1 for e in second_half if e.platform == "Telegram") / max(1, len(second_half))

        # Check if telegram share jumped significantly or dominant platform swapped
        if (second_tg - first_tg) >= 0.20 or (first_x > 0.65 and second_tg > 0.40):
            existing_mig = session.exec(
                select(NarrativeEventRecord).where(
                    NarrativeEventRecord.topic == topic,
                    NarrativeEventRecord.event_type == "ATTENTION_MIGRATION"
                )
            ).first()

            if not existing_mig:
                mig_evidence = [e.event_id for e in second_half if e.platform == "Telegram"][:3]
                mig_event = NarrativeEventRecord(
                    topic=topic,
                    tick=current_tick,
                    timestamp=current_timestamp,
                    event_type="ATTENTION_MIGRATION",
                    title="Platform Attention Migration",
                    description=f"Information velocity migrated from X ({first_x*100:.0f}%) to Telegram broadcast channels ({second_tg*100:.0f}%).",
                    evidence_post_ids=mig_evidence or [all_events[-1].event_id],
                    confidence=0.85,
                    meta_data={
                        "from_platform": "X",
                        "to_platform": "Telegram",
                        "initial_share": {"X": round(first_x, 2), "Telegram": round(first_tg, 2)},
                        "recent_share": {"X": round(second_x, 2), "Telegram": round(second_tg, 2)}
                    }
                )
                session.add(mig_event)
                new_events.append(mig_event)

    # 4. Weak Signal Early Warning (Accelerating Cluster with Low Absolute Volume)
    if 3 <= total_count <= 14 and latest_score_record.acceleration >= 40.0:
        existing_ws = session.exec(
            select(NarrativeEventRecord).where(
                NarrativeEventRecord.topic == topic,
                NarrativeEventRecord.event_type == "WEAK_SIGNAL"
            )
        ).first()

        if not existing_ws and current_stage in ("SEED", "EMERGING"):
            ws_evidence = [e.event_id for e in all_events[-3:]]
            ws_event = NarrativeEventRecord(
                topic=topic,
                tick=current_tick,
                timestamp=current_timestamp,
                event_type="WEAK_SIGNAL",
                title="Weak Signal Early Warning",
                description=f"Detected accelerating cluster ({total_count} posts) with velocity growth across communities before broad visibility.",
                evidence_post_ids=ws_evidence,
                confidence=0.81,
                meta_data={
                    "post_count": total_count,
                    "acceleration": latest_score_record.acceleration,
                    "trend_score": latest_score_record.composite_score
                }
            )
            session.add(ws_event)
            new_events.append(ws_event)

    session.commit()
    return new_events
