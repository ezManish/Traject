import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.db import init_db

def run_day5_verification():
    print("=== Starting Day 5 End-to-End Verification for TRAJECT ===")
    
    init_db()
    client = TestClient(app)

    # 1. Reset
    client.post("/api/replay/reset")
    state = client.get("/api/replay/state").json()
    assert state["current_tick"] == 0
    print("[OK] Replay cleanly reset to Tick 0.")

    # 2. Advance through all ticks
    total_ticks = state["total_ticks"]
    for t in range(1, total_ticks + 1):
        step_res = client.post("/api/replay/tick")
        assert step_res.status_code == 200

    final_state = client.get("/api/replay/state").json()
    assert final_state["is_completed"] is True
    print(f"[OK] Replay completed all {total_ticks} ticks ({final_state['total_events_in_db']} events ingested).")

    # 3. Verify Trends & Lifecycle Stages
    trends_res = client.get("/api/trends")
    assert trends_res.status_code == 200
    trends = trends_res.json()
    assert len(trends) >= 2
    hero_trend = next((t for t in trends if t["topic"] == "Transit System Delay"), None)
    assert hero_trend is not None
    print(f"[OK] Trends verified: Hero Topic Trend Score: {hero_trend['trend_score']} | Stage: {hero_trend['lifecycle_stage']}")

    # 4. Verify Audience Intelligence Endpoint (Screen 6)
    aud_res = client.get("/api/trends/Transit%20System%20Delay/audience")
    assert aud_res.status_code == 200
    aud = aud_res.json()
    assert len(aud["age_brackets"]) == 4
    assert len(aud["language_distribution"]) == 2
    assert "strictly zero individual profiling" in aud["disclaimer"]
    print(f"[OK] Audience Demographics verified with responsible-AI disclaimer: {aud['age_brackets'][0]['bracket']}")

    # 5. Verify Grounded AI Analyst Query (Screen 7)
    ai_res = client.post(
        "/api/ai/query",
        json={"topic": "Transit System Delay", "question": "Why did this trend escalate?"}
    )
    assert ai_res.status_code == 200
    ai_data = ai_res.json()
    assert "answer" in ai_data
    assert len(ai_data["evidence"]) > 0
    print(f"[OK] AI Analyst Answer verified: \"{ai_data['answer'][:100]}...\" (Receipts: {ai_data['evidence']})")

    # 6. Verify AI Narrative Briefing
    briefing_res = client.post(
        "/api/ai/narrative-briefing",
        json={"topic": "Transit System Delay"}
    )
    assert briefing_res.status_code == 200
    briefing = briefing_res.json()
    assert "briefing" in briefing
    assert len(briefing["evidence"]) > 0
    print(f"[OK] AI Narrative Briefing verified ({briefing['provider']}) with {len(briefing['evidence'])} evidence posts.")

    print("\n=== DAY 5 END-TO-END VERIFICATION PASSED WITH ZERO ERRORS ===")

if __name__ == "__main__":
    run_day5_verification()
