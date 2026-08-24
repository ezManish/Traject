import math
import networkx as nx
from typing import List, Dict, Any, Optional
from sqlmodel import Session, select
from app.models import EventRecord

# Community 5-swatch palette from TRAJECT_DESIGN.md §2.4
COMMUNITY_COLORS = [
    "#D42E82",  # Magenta Core
    "#A61E6B",  # Dense Violet-Magenta
    "#8C6B84",  # Muted Plum
    "#E3A542",  # Evidence Gold
    "#6B4A63"   # Deep Mauve-Plum
]

def build_network_graph(session: Session, topic: str, current_tick: int) -> Dict[str, Any]:
    """
    Constructs a NetworkX directed graph from reply, reshare, and mention links
    for all ingested events for a topic up to current_tick.
    Computes PageRank, Louvain communities, betweenness centrality, and layout coordinates.
    """
    events = session.exec(
        select(EventRecord).where(
            EventRecord.topic == topic,
            EventRecord.tick <= current_tick
        )
    ).all()

    if not events:
        return {"nodes": [], "edges": [], "stats": {"total_nodes": 0, "total_edges": 0, "communities_count": 0, "bridge_accounts_count": 0}}

    G = nx.DiGraph()
    author_info: Dict[str, Dict[str, Any]] = {}
    post_map: Dict[str, EventRecord] = {e.event_id: e for e in events}
    platform_post_map: Dict[str, EventRecord] = {e.platform_post_id: e for e in events if e.platform_post_id}

    # 1. Collect author nodes and track aggregated engagement
    for ev in events:
        aid = ev.author_id
        if aid not in author_info:
            author_info[aid] = {
                "author_id": aid,
                "author_name": ev.author_name or aid,
                "platform": ev.platform,
                "community": ev.community or "General",
                "post_count": 0,
                "total_likes": 0,
                "total_shares": 0,
                "total_comments": 0,
                "total_views": 0
            }
        author_info[aid]["post_count"] += 1
        author_info[aid]["total_likes"] += ev.likes
        author_info[aid]["total_shares"] += ev.shares
        author_info[aid]["total_comments"] += ev.comments
        author_info[aid]["total_views"] += ev.views
        G.add_node(aid)

    # 2. Add edges derived from relationships (reply_to, reshare_of, mentions)
    edge_weights: Dict[tuple, int] = {}
    edge_relations: Dict[tuple, str] = {}

    for ev in events:
        src = ev.author_id

        # 2a. Reply edge (weight=1)
        if ev.reply_to:
            target_ev = post_map.get(ev.reply_to) or platform_post_map.get(ev.reply_to)
            if target_ev and target_ev.author_id != src:
                tgt = target_ev.author_id
                pair = (src, tgt)
                edge_weights[pair] = edge_weights.get(pair, 0) + 1
                edge_relations[pair] = "reply"

        # 2b. Reshare edge (weight=3)
        if ev.reshare_of:
            target_ev = post_map.get(ev.reshare_of) or platform_post_map.get(ev.reshare_of)
            if target_ev and target_ev.author_id != src:
                tgt = target_ev.author_id
                pair = (src, tgt)
                edge_weights[pair] = edge_weights.get(pair, 0) + 3
                edge_relations[pair] = "reshare"

        # 2c. Mentions (weight=1)
        for m in (ev.mentions or []):
            clean_m = m.lstrip("@").lower()
            for candidate_aid, cinfo in author_info.items():
                if candidate_aid != src and (clean_m in candidate_aid.lower() or clean_m in cinfo["author_name"].lower()):
                    pair = (src, candidate_aid)
                    edge_weights[pair] = edge_weights.get(pair, 0) + 1
                    edge_relations[pair] = "mention"

    for (src, tgt), w in edge_weights.items():
        if G.has_node(src) and G.has_node(tgt):
            G.add_edge(src, tgt, weight=w, relation=edge_relations.get((src, tgt), "connection"))

    # 3. Compute Network Metrics
    # 3a. PageRank (influence base)
    try:
        pagerank = nx.pagerank(G, weight="weight") if len(G) > 1 else {n: 1.0 for n in G.nodes()}
    except Exception:
        pagerank = {n: 1.0 / max(1, len(G)) for n in G.nodes()}

    # 3b. Degree centrality
    try:
        degree_cent = nx.degree_centrality(G) if len(G) > 1 else {n: 0.5 for n in G.nodes()}
    except Exception:
        degree_cent = {n: 0.5 for n in G.nodes()}

    # 3c. Betweenness centrality (for bridge detection)
    try:
        betweenness = nx.betweenness_centrality(G) if len(G) > 2 else {n: 0.0 for n in G.nodes()}
    except Exception:
        betweenness = {n: 0.0 for n in G.nodes()}

    # 3d. Louvain Communities (undirected projection)
    UG = G.to_undirected()
    try:
        if len(UG) >= 2 and UG.number_of_edges() > 0:
            communities_list = list(nx.algorithms.community.louvain_communities(UG, seed=42))
        else:
            communities_list = [{n} for n in UG.nodes()]
    except Exception:
        communities_list = [{n} for n in UG.nodes()]

    node_community_map: Dict[str, int] = {}
    for c_idx, comm_set in enumerate(communities_list):
        for node in comm_set:
            node_community_map[node] = c_idx % len(COMMUNITY_COLORS)

    # 3e. 2D Positioning
    try:
        pos = nx.spring_layout(G, seed=42, k=1.8 / math.sqrt(max(1, len(G))), iterations=50)
    except Exception:
        pos = nx.circular_layout(G)

    # 4. Format React Flow Nodes & Edges
    max_betweenness = max(betweenness.values()) if betweenness else 0.0
    bridge_threshold = max_betweenness * 0.6 if max_betweenness > 0.05 else 0.5

    nodes = []
    max_pr = max(pagerank.values()) if pagerank else 1.0
    
    for node_id in G.nodes():
        info = author_info.get(node_id, {})
        pr = pagerank.get(node_id, 0.0)
        deg = degree_cent.get(node_id, 0.0)
        bt = betweenness.get(node_id, 0.0)
        comm_idx = node_community_map.get(node_id, 0)
        comm_color = COMMUNITY_COLORS[comm_idx]

        # Composite Influence Score (0-100)
        eng_factor = math.log10(max(1.0, float(info.get("total_likes", 0) + info.get("total_shares", 0) * 2))) / 4.0
        pr_norm = pr / max(1e-5, max_pr)
        influence_score = round(min(100.0, (pr_norm * 45.0 + deg * 25.0 + eng_factor * 30.0)), 1)
        
        is_bridge = (bt >= bridge_threshold and bt > 0.05) or (info.get("post_count", 0) >= 2 and len(communities_list) > 1 and deg > 0.2)

        # Scale layout coordinates to canvas
        coord = pos.get(node_id, (0, 0))
        x_pos = round(coord[0] * 380 + 420, 1)
        y_pos = round(coord[1] * 280 + 320, 1)

        nodes.append({
            "id": node_id,
            "position": {"x": x_pos, "y": y_pos},
            "data": {
                "label": info.get("author_name", node_id),
                "author_id": node_id,
                "author_name": info.get("author_name", node_id),
                "platform": info.get("platform", "X"),
                "community": info.get("community", "General"),
                "community_id": comm_idx,
                "community_color": comm_color,
                "influence_score": influence_score,
                "betweenness": round(bt, 3),
                "is_bridge": bool(is_bridge),
                "post_count": info.get("post_count", 1),
                "total_engagement": {
                    "likes": info.get("total_likes", 0),
                    "shares": info.get("total_shares", 0),
                    "comments": info.get("total_comments", 0),
                    "views": info.get("total_views", 0)
                }
            }
        })

    # Sort nodes by influence for ranking
    nodes.sort(key=lambda n: n["data"]["influence_score"], reverse=True)

    edges = []
    for idx, (src, tgt, edata) in enumerate(G.edges(data=True)):
        rel = edata.get("relation", "connection")
        weight = edata.get("weight", 1)
        edges.append({
            "id": f"e_{src}_{tgt}_{idx}",
            "source": src,
            "target": tgt,
            "label": rel,
            "weight": weight,
            "animated": weight >= 3,
            "style": {
                "stroke": "#4A7FA6" if author_info.get(src, {}).get("platform") == "Telegram" else "#B7A2B8",
                "strokeWidth": min(4, 1 + weight),
                "strokeDasharray": "5,5" if author_info.get(src, {}).get("platform") == "Telegram" else "none"
            }
        })

    return {
        "nodes": nodes,
        "edges": edges,
        "stats": {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "communities_count": len(communities_list),
            "bridge_accounts_count": sum(1 for n in nodes if n["data"]["is_bridge"])
        }
    }
