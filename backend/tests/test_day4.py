import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.db import init_db

def run_day4_verification():
    print("=== Starting Day 4 Verification for TRAJECT ===")
    
    init_db()
    client = TestClient(app)

    # 1. Reset and advance replay to tick 6 (Peak Viral / Mutation state)
    client.post("/api/replay/reset")
    for _ in range(6):
        client.post("/api/replay/tick")
    print("[OK] Replay advanced to Tick 6 (Peak Viral & Mutation).")

    # 2. Test /api/ai/narrative-briefing
    briefing_res = client.post(
        "/api/ai/narrative-briefing",
        json={"topic": "Transit System Delay"}
    )
    assert briefing_res.status_code == 200
    briefing = briefing_res.json()
    assert "briefing" in briefing
    assert len(briefing["evidence"]) > 0
    assert briefing["confidence"] >= 0.85
    print(f"[OK] Narrative Briefing generated ({briefing['provider']}):")
    print(f"  \"{briefing['briefing'][:150]}...\"")
    print(f"  Confidence: {briefing['confidence']} | Evidence: {briefing['evidence']}")

    # 3. Test /api/ai/query
    query_res = client.post(
        "/api/ai/query",
        json={
            "topic": "Transit System Delay",
            "question": "What is the detected framing mutation in this narrative?"
        }
    )
    assert query_res.status_code == 200
    answer = query_res.json()
    assert "answer" in answer
    assert "mutation" in answer["answer"].lower() or "power grid" in answer["answer"].lower() or "delay" in answer["answer"].lower()
    print(f"[OK] AI Analyst Query answered successfully:")
    print(f"  Q: What is the detected framing mutation in this narrative?")
    print(f"  A: {answer['answer']}")
    print(f"  Receipts: {answer.get('evidence')}")

    # 4. Verify Network Graph at Tick 6
    net_res = client.get("/api/trends/Transit%20System%20Delay/network")
    assert net_res.status_code == 200
    net = net_res.json()
    assert len(net["nodes"]) >= 10
    print(f"[OK] Network graph at Tick 6: {len(net['nodes'])} nodes, {len(net['edges'])} edges across {net['stats']['communities_count']} communities.")

    print("\n=== DAY 4 BACKEND VERIFICATION PASSED SUCCESSFULLY ===")

if __name__ == "__main__":
    run_day4_verification()
