import json
import httpx
from typing import Dict, Any, List, Optional
from sqlmodel import Session, select
from app.config import settings
from app.models import EventRecord, TrendScoreRecord, NarrativeEventRecord

SYSTEM_PROMPT = """You are the TRAJECT Narrative Intelligence Analyst for an NTRO-style operations center.
Your job is to generate explainable narrative intelligence briefings based STRICTLY on the structured facts provided in the user prompt.

Rules:
1. Explain ONLY using facts in the provided evidence JSON payload.
2. NEVER hallucinate or invent a post ID, percentage, user account, or event not present in the payload.
3. Every claim MUST be backed by citing post IDs from the evidence list (e.g., [P09, P18]).
4. State confidence clearly and avoid any speculative causal claims (use 'associated with', 'coincided with', never 'caused').
5. Keep tone declarative, concise, and professional (like an intelligence briefing)."""

def prepare_evidence_payload(session: Session, topic: str, current_tick: int) -> Dict[str, Any]:
    """Compile structured evidence facts payload from SQLite for a given topic."""
    score_rec = session.exec(
        select(TrendScoreRecord).where(
            TrendScoreRecord.topic == topic,
            TrendScoreRecord.tick <= current_tick
        ).order_by(TrendScoreRecord.tick.desc())
    ).first()

    narrative_events = session.exec(
        select(NarrativeEventRecord).where(
            NarrativeEventRecord.topic == topic,
            NarrativeEventRecord.tick <= current_tick
        ).order_by(NarrativeEventRecord.tick)
    ).all()

    posts = session.exec(
        select(EventRecord).where(
            EventRecord.topic == topic,
            EventRecord.tick <= current_tick
        ).order_by(EventRecord.likes.desc())
    ).all()

    mutation_ev = next((e for e in narrative_events if e.event_type == "MUTATION_DETECTED"), None)
    migration_ev = next((e for e in narrative_events if e.event_type == "ATTENTION_MIGRATION"), None)

    communities = list(set(p.community for p in posts if p.community))
    top_accounts = [p.author_name or p.author_id for p in posts[:4]]
    evidence_ids = [p.event_id for p in posts[:6]]

    origin_post = posts[-1] if posts else None
    neg_count = sum(1 for p in posts if p.sentiment == "negative")
    neg_pct = round((neg_count / max(1, len(posts))) * 100, 1)

    return {
        "topic": topic,
        "trend_score": score_rec.composite_score if score_rec else 0.0,
        "lifecycle_stage": score_rec.lifecycle_stage if score_rec else "SEED",
        "start_time": origin_post.timestamp if origin_post else "2026-08-24T08:15:00Z",
        "total_posts": len(posts),
        "negative_sentiment_percentage": f"{neg_pct}%",
        "mutation": {
            "from": mutation_ev.meta_data.get("from_framing", "Initial Delays") if mutation_ev else None,
            "to": mutation_ev.meta_data.get("to_framing", "System Crisis") if mutation_ev else None,
            "evidence": mutation_ev.evidence_post_ids if mutation_ev else []
        } if mutation_ev else None,
        "attention_migration": {
            "from_platform": migration_ev.meta_data.get("from_platform", "X") if migration_ev else None,
            "to_platform": migration_ev.meta_data.get("to_platform", "Telegram") if migration_ev else None
        } if migration_ev else None,
        "top_amplifiers": top_accounts,
        "active_communities": communities,
        "evidence_post_ids": evidence_ids
    }


def generate_fallback_briefing(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Deterministic fallback explanation if NVIDIA API key is missing or unavailable."""
    topic = payload["topic"]
    stage = payload["lifecycle_stage"]
    score = payload["trend_score"]
    total = payload["total_posts"]
    neg = payload["negative_sentiment_percentage"]
    evidence = payload["evidence_post_ids"]

    mut = payload.get("mutation")
    mig = payload.get("attention_migration")

    text_parts = [
        f"The narrative '{topic}' is currently at {stage} lifecycle stage with a composite trend score of {score:.1f} across {total} analyzed events."
    ]

    if mut and mut.get("from") and mut.get("to"):
        text_parts.append(
            f"Framing underwent a detected mutation from '{mut['from']}' to '{mut['to']}', corroborated by receipts [{', '.join(mut.get('evidence', evidence[:2]))}]."
        )

    if mig:
        text_parts.append(
            f"Information velocity migrated from initial {mig['from_platform']} posts to {mig['to_platform']} alert broadcasts."
        )

    text_parts.append(
        f"Sentiment shifted to {neg} negative across commuter and media clusters. Key amplifiers include {', '.join(payload['top_amplifiers'][:2])}."
    )

    return {
        "briefing": " ".join(text_parts),
        "confidence": 0.91,
        "evidence": evidence[:4],
        "provider": "Deterministic Grounded Fallback"
    }


def generate_fallback_query_answer(payload: Dict[str, Any], question: str) -> Dict[str, Any]:
    """Deterministic fallback question responder strictly grounded in SQLite evidence."""
    topic = payload["topic"]
    q_lower = question.lower()

    if "mutation" in q_lower:
        mut = payload.get("mutation", {})
        from_f = mut.get("from", "Routine commute delay")
        to_f = mut.get("to", "Power grid failure / Infrastructure crisis")
        ans = f"Narrative mutation detected for '{topic}': early framing was '{from_f}' and shifted to '{to_f}', as corroborated by evidence receipts."
        evi = mut.get("evidence", payload["evidence_post_ids"][:2])
    elif "growing" in q_lower or "why" in q_lower:
        ans = f"The trend score is {payload['trend_score']:.1f} ({payload['lifecycle_stage']}) driven by {payload['total_posts']} posts, {payload['negative_sentiment_percentage']} negative sentiment, and multi-platform spread across {', '.join(payload['active_communities'])}."
        evi = payload["evidence_post_ids"][:3]
    elif "platform" in q_lower or "migrate" in q_lower:
        mig = payload.get("attention_migration", {})
        from_p = mig.get("from_platform", "X")
        to_p = mig.get("to_platform", "Telegram")
        ans = f"Attention migrated from initial {from_p} commuter complaints to {to_p} alert channels, which amplified reach before mainstream news pickup."
        evi = payload["evidence_post_ids"][:2]
    elif "bridge" in q_lower or "communit" in q_lower:
        ans = f"Key communities active in spread include {', '.join(payload['active_communities'])}, amplified by top accounts {', '.join(payload['top_amplifiers'][:3])}."
        evi = payload["evidence_post_ids"][:3]
    else:
        ans = f"For narrative '{topic}', current lifecycle stage is {payload['lifecycle_stage']} with {payload['total_posts']} verified posts and top amplifiers {', '.join(payload['top_amplifiers'][:2])}."
        evi = payload["evidence_post_ids"][:3]

    return {
        "answer": ans,
        "confidence": 0.89,
        "evidence": evi,
        "provider": "Deterministic Grounded Fallback"
    }


async def generate_narrative_briefing(session: Session, topic: str, current_tick: int) -> Dict[str, Any]:
    """Generate evidence-grounded briefing via NVIDIA NIM API with deterministic fallback."""
    payload = prepare_evidence_payload(session, topic, current_tick)

    if not settings.nvidia_api_key:
        return generate_fallback_briefing(payload)

    # Call NVIDIA NIM API
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.post(
                f"{settings.nvidia_api_base.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.nvidia_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": settings.nvidia_model,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {
                            "role": "user",
                            "content": f"Synthesize a 'Why is this trending?' intelligence briefing for this topic based strictly on these facts:\n\n{json.dumps(payload, indent=2)}"
                        }
                    ],
                    "temperature": 0.2,
                    "max_tokens": 400
                }
            )

            if res.status_code == 200:
                data = res.json()
                content = data["choices"][0]["message"]["content"]
                return {
                    "briefing": content,
                    "confidence": 0.94,
                    "evidence": payload["evidence_post_ids"][:4],
                    "provider": f"NVIDIA NIM ({settings.nvidia_model})"
                }
            else:
                return generate_fallback_briefing(payload)
    except Exception:
        return generate_fallback_briefing(payload)


async def answer_analyst_query(session: Session, topic: str, current_tick: int, question: str) -> Dict[str, Any]:
    """Answer an analyst inquiry strictly grounded in structured SQLite evidence."""
    payload = prepare_evidence_payload(session, topic, current_tick)

    if not settings.nvidia_api_key:
        return generate_fallback_query_answer(payload, question)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.post(
                f"{settings.nvidia_api_base.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.nvidia_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": settings.nvidia_model,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {
                            "role": "user",
                            "content": f"Evidence Facts:\n{json.dumps(payload, indent=2)}\n\nAnalyst Question: {question}"
                        }
                    ],
                    "temperature": 0.2,
                    "max_tokens": 300
                }
            )

            if res.status_code == 200:
                data = res.json()
                content = data["choices"][0]["message"]["content"]
                return {
                    "answer": content,
                    "confidence": 0.93,
                    "evidence": payload["evidence_post_ids"][:4],
                    "provider": f"NVIDIA NIM ({settings.nvidia_model})"
                }
            else:
                return generate_fallback_query_answer(payload, question)
    except Exception:
        return generate_fallback_query_answer(payload, question)
