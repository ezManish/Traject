import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.db import init_db

def run_day6_verification():
    print("=== Starting Day 6 Exhaustive Simulation for TRAJECT ===")
    
    init_db()
    client = TestClient(app)

    # 1. Reset state
    reset_res = client.post("/api/replay/reset")
    assert reset_res.status_code == 200
    state = reset_res.json()
    assert state["current_tick"] == 0
    print("[OK] Replay cleanly reset to 0.")

    # 2. Iterate every tick and assert zero errors across all endpoints
    total_ticks = state["total_ticks"]
    topics_seen = set()

    for tick_idx in range(1, total_ticks + 1):
        step_res = client.post("/api/replay/tick")
        assert step_res.status_code == 200
        cur_state = step_res.json()["state"]
        assert cur_state["current_tick"] == tick_idx

        # Query all core endpoints on every tick
        trends_res = client.get("/api/trends")
        assert trends_res.status_code == 200
        trends = trends_res.json()
        assert len(trends) > 0

        for t in trends:
            topics_seen.add(t["topic"])

            # Verify history
            hist = client.get(f"/api/trends/{t['topic']}/history").json()
            assert len(hist) > 0

            # Verify network
            net = client.get(f"/api/trends/{t['topic']}/network").json()
            assert "nodes" in net and "edges" in net

            # Verify sentiment
            sent = client.get(f"/api/trends/{t['topic']}/sentiment").json()
            assert "sentiment_percentages" in sent

            # Verify audience
            aud = client.get(f"/api/trends/{t['topic']}/audience").json()
            assert "age_brackets" in aud

        # Query narratives
        n_res = client.get("/api/narratives")
        assert n_res.status_code == 200

        print(f"  [Tick {tick_idx:02d}] Verified {len(trends)} trends, network graphs, sentiment, and audience endpoints.")

    # 3. Verify Final AI synthesis
    print("Verifying AI Analyst across all suggested inquiry prompts...")
    prompts = [
        "Why is this trend growing so rapidly?",
        "What is the detected framing mutation in this narrative?",
        "Which communities and bridge accounts are driving the spread?",
        "How did attention migrate across platforms?"
    ]

    for p in prompts:
        ai_res = client.post(
            "/api/ai/query",
            json={"topic": "Transit System Delay", "question": p}
        )
        assert ai_res.status_code == 200
        data = ai_res.json()
        assert len(data["answer"]) > 20
        assert len(data["evidence"]) > 0
        print(f"  [Q]: {p}")
        print(f"  [A]: {data['answer'][:90]}... (Receipts: {data['evidence']})")

    print("\n=== DAY 6 FULL SIMULATION PASSED WITH ZERO CRASHES OR ERRORS ===")

if __name__ == "__main__":
    run_day6_verification()
