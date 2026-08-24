import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.services.replay import replay_manager
from app.db import init_db

def run_day1_verification():
    print("=== Starting Day 1 Verification for TRAJECT ===")
    
    # 1. Initialize DB
    init_db()
    print("[OK] SQLite database initialized successfully.")

    # 2. Setup Test Client
    client = TestClient(app)

    # 3. Test Health & State
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    assert res.json()["mode"] == "Historical Dataset Replay Mode"
    print("[OK] Health check endpoint OK.")

    # 4. Reset Replay
    res = client.post("/api/replay/reset")
    assert res.status_code == 200
    state = res.json()
    assert state["current_tick"] == 0
    assert state["total_events_in_db"] == 0
    print(f"[OK] Replay reset verified: tick=0, total_events={state['total_events_in_db']}")

    # 5. Step through ticks and verify progression
    max_ticks = state["total_ticks"]
    print(f"Dataset has {state['total_dataset_events']} events across {max_ticks} ticks.")

    score_progression = []
    stage_progression = []

    for t in range(1, max_ticks + 1):
        step_res = client.post("/api/replay/tick")
        assert step_res.status_code == 200
        step_data = step_res.json()
        current_tick = step_data["state"]["current_tick"]
        events_in_db = step_data["state"]["total_events_in_db"]
        
        # Query trends endpoint
        trends_res = client.get("/api/trends")
        assert trends_res.status_code == 200
        trends_data = trends_res.json()
        
        # Find Transit System Delay trend
        transit_trend = next((tr for tr in trends_data if tr["topic"] == "Transit System Delay"), None)
        if transit_trend:
            ts = transit_trend["trend_score"]
            stage = transit_trend["lifecycle_stage"]
            score_progression.append(ts)
            stage_progression.append(stage)
            print(f"  [Tick {current_tick:02d}] Events in DB: {events_in_db:02d} | Transit Score: {ts:05.1f} | Stage: {stage:<10} | Platforms: {transit_trend['active_platforms']}")
        else:
            print(f"  [Tick {current_tick:02d}] Events in DB: {events_in_db:02d}")

    # 6. Verify Score Escalation & Lifecycle Evolution
    assert len(score_progression) > 0, "No trend scores computed"
    assert score_progression[-1] > score_progression[0], "Trend score did not rise across ticks"
    assert any(s in ("EXPANDING", "VIRAL", "SATURATION") for s in stage_progression), f"Stages did not reach EXPANDING/VIRAL: {stage_progression}"
    print(f"[OK] Trend score rose from {score_progression[0]} to {max(score_progression)} (peak stage: {max(stage_progression, key=lambda s: stage_progression.count(s))}).")

    # 7. Test trend history endpoint
    hist_res = client.get("/api/trends/Transit%20System%20Delay/history")
    assert hist_res.status_code == 200
    hist_data = hist_res.json()
    assert len(hist_data) == max_ticks, f"Expected {max_ticks} history records, got {len(hist_data)}"
    print(f"[OK] Trend history endpoint returned {len(hist_data)} timestamped score points.")

    # 8. Test topic events endpoint
    events_res = client.get("/api/trends/Transit%20System%20Delay/events")
    assert events_res.status_code == 200
    events_data = events_res.json()
    assert len(events_data) > 0, "No events returned for topic"
    print(f"[OK] Topic events endpoint returned {len(events_data)} ingested events with full metadata.")

    print("\n=== DAY 1 VERIFICATION PASSED SUCCESSFULLY ===")

if __name__ == "__main__":
    run_day1_verification()
