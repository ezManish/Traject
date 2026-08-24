import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.db import init_db

def run_day2_verification():
    print("=== Starting Day 2 Verification for TRAJECT ===")
    
    init_db()
    client = TestClient(app)

    # 1. Reset replay
    client.post("/api/replay/reset")
    print("[OK] Replay reset.")

    # 2. Advance all ticks
    state = client.get("/api/replay/state").json()
    max_ticks = state["total_ticks"]
    
    print(f"Executing {max_ticks} replay ticks with real-time narrative evaluation...")
    for t in range(1, max_ticks + 1):
        step_res = client.post("/api/replay/tick")
        assert step_res.status_code == 200

    # 3. Test /api/narratives
    narratives_res = client.get("/api/narratives")
    assert narratives_res.status_code == 200
    narratives = narratives_res.json()
    assert len(narratives) >= 2, f"Expected at least 2 narratives, got {len(narratives)}"
    print(f"[OK] /api/narratives returned {len(narratives)} narratives:")
    for n in narratives:
        print(f"  - Topic: {n['topic']} | Stage: {n['lifecycle_stage']} | Mutation: {n['mutation_detected']} | Migration: {n['attention_migration']} | WeakSignal: {n['is_weak_signal']}")

    # 4. Check Hero Narrative Innovation Events
    transit_n = next((n for n in narratives if n["topic"] == "Transit System Delay"), None)
    assert transit_n is not None
    assert transit_n["mutation_detected"] is True, "Mutation was not detected on hero narrative!"
    assert transit_n["attention_migration"] is True, "Attention migration was not detected on hero narrative!"
    print(f"[OK] Hero Narrative Mutation confirmed: {transit_n['mutation_data']}")
    print(f"[OK] Hero Narrative Attention Migration confirmed: {transit_n['migration_data']}")

    # 5. Check Secondary Narrative Weak Signal
    smartcard_n = next((n for n in narratives if n["topic"] == "Smart Card Fare Glitch"), None)
    assert smartcard_n is not None
    assert smartcard_n["is_weak_signal"] is True, "Weak signal was not flagged for Smart Card Fare Glitch!"
    print(f"[OK] Secondary Narrative Weak Signal confirmed: {smartcard_n['topic']}")

    # 6. Test /api/narratives/{topic}/timeline
    timeline_res = client.get("/api/narratives/Transit%20System%20Delay/timeline")
    assert timeline_res.status_code == 200
    timeline = timeline_res.json()
    assert len(timeline) >= 3, f"Expected at least 3 timeline events, got {len(timeline)}"
    print(f"[OK] Narrative Timeline contains {len(timeline)} logged innovation events:")
    for ev in timeline:
        print(f"  [{ev['timestamp']}] Tick {ev['tick']:02d} | {ev['event_type']} | {ev['title']}")

    # 7. Test /api/narratives/{topic}/evidence
    evidence_res = client.get("/api/narratives/Transit%20System%20Delay/evidence")
    assert evidence_res.status_code == 200
    evidence = evidence_res.json()
    assert evidence["total_evidence_count"] >= 25
    print(f"[OK] Evidence endpoint returned {evidence['total_evidence_count']} posts with confidence {evidence['confidence_score']}.")

    # 8. Test /api/trends/{topic}/network (React Flow graph)
    network_res = client.get("/api/trends/Transit%20System%20Delay/network")
    assert network_res.status_code == 200
    graph = network_res.json()
    assert len(graph["nodes"]) > 5, "Graph has too few nodes"
    assert len(graph["edges"]) > 3, "Graph has too few edges"
    assert graph["stats"]["communities_count"] >= 2, "Louvain communities not computed"
    print(f"[OK] Network Graph built: {len(graph['nodes'])} nodes, {len(graph['edges'])} edges, {graph['stats']['communities_count']} communities, {graph['stats']['bridge_accounts_count']} bridge accounts.")

    # 9. Test /api/trends/{topic}/communities & influencers & sentiment
    comm_res = client.get("/api/trends/Transit%20System%20Delay/communities")
    assert comm_res.status_code == 200
    assert len(comm_res.json()) >= 2
    print(f"[OK] Communities endpoint returned {len(comm_res.json())} community cluster buckets.")

    inf_res = client.get("/api/trends/Transit%20System%20Delay/influencers")
    assert inf_res.status_code == 200
    top_inf = inf_res.json()[0]
    print(f"[OK] Top influencer: {top_inf['author_name']} (Influence: {top_inf['influence_score']}, Bridge: {top_inf['is_bridge']})")

    sent_res = client.get("/api/trends/Transit%20System%20Delay/sentiment")
    assert sent_res.status_code == 200
    sent = sent_res.json()
    print(f"[OK] Sentiment endpoint: {sent['sentiment_percentages']} with emotions {list(sent['emotion_breakdown'].keys())}")

    print("\n=== DAY 2 BACKEND VERIFICATION PASSED SUCCESSFULLY ===")

if __name__ == "__main__":
    run_day2_verification()
