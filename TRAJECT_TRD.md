# TRAJECT — Technical Requirements Document (TRD)
### SIH 2026 · PS26152 — MVP build, 1-week timeline
### Audience: IDE coding agent (Cursor/Claude Code/etc.) implementing this repo

---

## 1. Guiding constraints

- One week, majority of effort goes to **frontend** (this is what judges see and what the video shows).
- Backend is **only as much as necessary**: serve replay data, compute deterministic analytics, proxy the LLM.
- AI/ML pieces that would normally require trained models (sentiment, emotion, narrative explanation) are handled via a **temporary NVIDIA API key** (NIM / OpenAI-compatible endpoint) instead of building or hosting models.
- No Spring Boot, no Postgres/OpenSearch/Redis/Kafka, no Docker orchestration, no microservices. Single backend service, single frontend app. These are explicitly deferred to a V2 doc — do not build them now.
- Everything the AI Analyst says must be traceable to structured evidence computed in code — the LLM never sees raw uncurated data and never does the scoring math itself.

## 2. Architecture

```
                 ┌─────────────────────────────┐
                 │        REPLAY DATASET        │
                 │   (synthetic JSON, ~40-60    │
                 │    events, X + Telegram)     │
                 └───────────────┬──────────────┘
                                 │
                                 ▼
                 ┌─────────────────────────────┐
                 │      BACKEND (FastAPI)       │
                 │  - replay engine (ticks)     │
                 │  - trend scoring             │
                 │  - narrative lifecycle/      │
                 │    mutation/migration/       │
                 │    weak-signal logic         │
                 │  - graph build (networkx)    │
                 │  - SQLite (event store)      │
                 │  - NVIDIA API proxy          │
                 └───────────────┬──────────────┘
                                 │ REST + polling
                                 │ (SSE optional)
                                 ▼
                 ┌─────────────────────────────┐
                 │     FRONTEND (React/Vite)    │
                 │  Executive · Trend ·         │
                 │  Narrative · Network ·       │
                 │  AI Analyst                  │
                 └─────────────────────────────┘
```

## 3. Tech stack

**Frontend:** React 18 + Vite, TypeScript, Tailwind CSS, Recharts (charts), React Flow (network graph — easier/faster than raw D3 for a week timeline), Framer Motion (transitions), Zustand or React Query for state/data-fetching.

**Backend:** Python 3.11 + FastAPI, Uvicorn, Pydantic v2, NetworkX (graph metrics + Louvain via `networkx.algorithms.community`), SQLite via SQLModel or plain `sqlite3` (swap-in for Postgres later, not needed now), `httpx` for calling the NVIDIA API.

**AI:** NVIDIA NIM API (OpenAI-compatible `/v1/chat/completions`), called only for (a) evidence→explanation generation, (b) AI Analyst chat. Sentiment/emotion labeling: rule/keyword-based baseline with an NVIDIA LLM classification call as enhancement — code must work with the rule-based fallback alone if the API key is absent or rate-limited (never let a missing key break the demo).

**Rationale for cuts vs. master doc:** Spring Boot/Postgres/OpenSearch/Redis/Kafka/Docker solve scale problems TRAJECT doesn't have this week. A single FastAPI service + SQLite is sufficient for a replay dataset of dozens of events and a live demo audience of one.

## 4. Repo structure

```
traject/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app, CORS, router includes
│   │   ├── config.py                # env vars (NVIDIA_API_KEY, etc.)
│   │   ├── data/
│   │   │   └── replay_dataset.json  # synthetic events
│   │   ├── db.py                    # SQLite setup
│   │   ├── models.py                # Pydantic + DB models
│   │   ├── services/
│   │   │   ├── replay.py            # tick engine
│   │   │   ├── sentiment.py         # rule-based + optional NVIDIA call
│   │   │   ├── trend.py             # trend score formula
│   │   │   ├── narrative.py         # lifecycle/mutation/migration/weak-signal
│   │   │   ├── network.py           # graph build + influence + communities
│   │   │   └── ai_analyst.py        # NVIDIA API client + evidence-grounded prompt
│   │   └── routers/
│   │       ├── trends.py
│   │       ├── narratives.py
│   │       ├── network.py
│   │       ├── replay.py
│   │       └── ai.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── ExecutiveDashboard.tsx
    │   │   ├── TrendIntelligence.tsx
    │   │   ├── NarrativeIntelligence.tsx
    │   │   ├── NetworkGraph.tsx
    │   │   └── AIAnalyst.tsx
    │   ├── components/
    │   ├── api/client.ts
    │   ├── store/
    │   └── App.tsx
    ├── package.json
    └── vite.config.ts
```

## 5. Canonical event schema

```json
{
  "event_id": "evt_123",
  "platform": "X",
  "platform_post_id": "x_102938",
  "author_id": "u_9182",
  "parent_post_id": null,
  "timestamp": "2026-08-24T10:31:20Z",
  "text": "Metro service is delayed again",
  "language": "en",
  "hashtags": ["metro"],
  "reply_to": null,
  "reshare_of": null,
  "engagement": {"likes": 320, "shares": 82, "comments": 41, "views": 1000},
  "topic": "Transit",
  "sentiment": "negative",
  "emotion": ["frustration"],
  "community": null
}
```

Relationships (for graph): derive from `reply_to`, `reshare_of`, and `@mentions` parsed from text. Edge weights: reply=1, mention=1, reshare=3, quote=3.

## 6. Replay engine

- Load `replay_dataset.json` (all events sorted by timestamp) at startup.
- `GET /api/replay/start` begins a session; server advances a pointer on a timer (e.g. every 2–3s release the next batch of events) and stores them into SQLite as if newly ingested.
- `GET /api/replay/state` returns current tick index / whether replay is running / completed — frontend polls this (or use SSE if time allows) to animate the dashboard.
- Always label this mode in the UI: **"Historical Dataset Replay Mode."**

## 7. Trend scoring (deterministic, no LLM)

```
TS = 0.25·VolumeGrowth + 0.20·EngagementVelocity + 0.20·Acceleration
   + 0.15·Anomaly + 0.10·SentimentShift + 0.10·NetworkPropagation
```
Each input normalized 0–100 against the topic's rolling baseline. Document this as *a* proposed scoring model in the UI, not an official formula. Recompute on every replay tick for each active topic; store score history for the timeline chart.

## 8. Narrative engine (deterministic + one LLM call for explanation text)

- **Lifecycle**: thresholds on trend score + velocity/deceleration map to SEED → EMERGING → EXPANDING → VIRAL → SATURATION → DECLINING → DORMANT. Simple state machine, transitions logged with timestamps.
- **Mutation detection**: compare the dominant keywords/n-grams (or topic embedding centroid, if time allows using a small sentence-transformers model or an NVIDIA embedding endpoint) of the narrative's first 30% of posts vs. its most recent 30%. If divergence exceeds a threshold, flag "Narrative mutation detected" and surface the before/after framing text.
- **Attention migration**: compute % of posts per platform in rolling windows; if the dominant platform changes between windows, flag a migration event and log the from→to.
- **Weak signal detection**: flag topics whose post count is accelerating (e.g. ratio of last-window growth vs. prior-window growth exceeds a threshold) while absolute volume is still low; attach a confidence score (simple heuristic combining growth ratio + engagement + community spread — do not oversell this as ML).
- Every narrative event (lifecycle transition, mutation, migration, weak signal) is written to a `narrative_events` table with timestamp + supporting evidence (post IDs).

## 9. Network / graph computation

- Build a directed graph in NetworkX from relationship edges.
- **Influence score**: weighted combination of PageRank + degree centrality + engagement generated (not follower count).
- **Communities**: `networkx.algorithms.community.louvain_communities`.
- **Bridge accounts (stretch, Tier 2)**: betweenness centrality on the same graph.
- Serve as `{nodes: [...], edges: [...]}` for React Flow; recompute on each replay tick (dataset is small enough this is cheap).

## 10. AI integration (NVIDIA API)

- Environment variable `NVIDIA_API_KEY`; client hits the NIM chat-completions endpoint at `https://integrate.api.nvidia.com/v1` (OpenAI-compatible `/chat/completions`, `/embeddings`). Verify this base URL against the developer portal when the key is issued — it's the standard build.nvidia.com endpoint but confirm before relying on it.

### Model selection (from the build.nvidia.com catalog, all **Free Endpoint** — no self-hosting/download required)

| Role | Model | Why |
|---|---|---|
| Narrative explanation + AI Analyst chat | `llama-3.3-nemotron-super-49b-v1.5` | Strong instruction-following/reasoning/tool-calling, well-established, good fit for turning structured evidence JSON into grounded explanations |
| High-frequency per-tick classification (sentiment/emotion during replay, if not using the rule-based path) | `nemotron-3.5-lightning-30b-a3b` | Fastest 30B-class MoE, lowest latency — matters because replay ticks fire every 2-3s and you don't want the UI stalling on LLM round-trips |
| Embeddings (topic clustering input, narrative mutation similarity between early/late post windows, and Narrative Memory if you get to it) | `nemotron-3-embed-1b` | Purpose-built for semantic search/retrieval — better and cheaper than asking a chat model to eyeball similarity |
| Hindi/English normalization (optional, supports the PS's multilingual requirement) | `riva-translate-4b-instruct-v2` | 37-language translation; normalize Hindi posts (e.g. "स्टेशन पर बहुत भीड़ है") to English before running them through one sentiment/topic pipeline instead of building separate Hindi models |
| Content-safety guardrail (optional, stretch — not required for MVP) | `nemotron-3.5-content-safety` | If time allows, use to sanity-check AI Analyst output isn't making unsafe individual-risk statements, per the responsible-AI rules in §13 |

Use `llama-3.3-nemotron-super-49b-v1.5` as the single default for both explanation generation and the AI Analyst to keep the integration simple for a one-week build; only add the lightning model or embeddings if the demo actually needs the latency or similarity capability — don't wire up all five just because they're available.
- **Evidence-grounded prompt pattern** (used for both the "Why is this trending" explanation and the AI Analyst):

```json
{
  "trend_score": 88.7,
  "lifecycle_stage": "VIRAL",
  "start_time": "2026-08-24T10:18:00Z",
  "volume_growth": "7.3x baseline",
  "sentiment_shift": "24% -> 67% negative",
  "mutation": {"from": "Metro delayed", "to": "System failure"},
  "top_accounts": ["..."],
  "communities": ["..."],
  "evidence_post_ids": ["P09","P12","P18"]
}
```
  System prompt instructs the model: explain only from the given facts, never invent a post ID or number not present in the payload, state confidence, and explicitly say when evidence is thin. This mirrors the master doc's hallucination rules (§65) — enforce them in the system prompt even though there's no separate evaluation harness this week.
- **Fallback**: if the API key is missing/rate-limited, generate the explanation from a template using the same JSON (e.g. `"{topic} entered {stage} at {volume_growth} baseline growth, sentiment shifted {sentiment_shift}."`). The demo must not break without the key.

## 11. API surface (MVP subset of master doc §58)

```
GET  /api/replay/start
GET  /api/replay/state
GET  /api/trends
GET  /api/trends/{id}
GET  /api/trends/{id}/sentiment
GET  /api/trends/{id}/network
GET  /api/trends/{id}/communities
GET  /api/trends/{id}/influencers
GET  /api/narratives
GET  /api/narratives/{id}
GET  /api/narratives/{id}/timeline
GET  /api/narratives/{id}/evidence
POST /api/ai/query   { "trendId": 21, "question": "Why is this trend growing?" }
     -> { "answer": "...", "confidence": 0.89, "evidence": ["P09","P12","P18"] }
```

## 12. Frontend architecture

- **Routing**: one route per screen (Executive / Trend / Narrative / Network / AI Analyst), plus a persistent top nav showing replay status.
- **Data**: poll `/api/replay/state` + relevant list endpoints every 2–3s while replay is running (simplest reliable approach for a week-long build; swap for SSE/WebSocket only if there's slack time).
- **Charts**: Recharts for trend score/volume/sentiment timelines.
- **Network graph**: React Flow with node size bound to influence score, node color bound to community id, a play/scrub control tied to replay tick.
- **Narrative Intelligence screen**: this is the hero — invest the most design effort here (see design notes below).
- **Design direction**: this is an intelligence command-center, not an admin dashboard. Avoid generic dashboard clichés (cream+serif+terracotta, or black+neon, or newspaper-hairline layouts) — pick a distinct palette/type system that reads as "narrative intelligence," not "generic SaaS." Establish the palette/type/layout decisions explicitly before wiring components together; keep motion purposeful (replay ticks, lifecycle transitions, migration animation) rather than decorative.

## 13. Non-functional / responsible-AI requirements (carried over from master doc, still apply at MVP scale)

- Aggregate-only demographics, no individual profiling, ever.
- No causal language ("X caused Y") — only temporal association + confidence.
- Every AI-generated claim on screen shows confidence + evidence count.
- Replay Mode is labeled on every screen that shows data — never implies live access.
- No sensitive personal characteristics inferred about any individual.

## 14. Environment & config

```
# backend/.env
NVIDIA_API_KEY=
NVIDIA_API_BASE=https://integrate.api.nvidia.com/v1   # verify against developer portal
NVIDIA_MODEL=llama-3.3-nemotron-super-49b-v1.5          # default for explanation + AI Analyst
NVIDIA_EMBED_MODEL=nemotron-3-embed-1b                  # optional, for mutation/narrative similarity
DATABASE_URL=sqlite:///./traject.db
REPLAY_TICK_SECONDS=2
```

## 15. Suggested day-by-day build order (1 week)

- **Day 1** — Backend skeleton, SQLite schema, synthetic dataset (~40-60 events across the transit-delay scenario + a second smaller narrative), replay engine, `/api/replay/*`, basic trend scoring.
- **Day 2** — Narrative engine (lifecycle, mutation, migration, weak signal), network/graph endpoints, seed the frontend project + design-token decisions (palette/type/layout plan, per design notes above).
- **Day 3** — Executive + Trend Intelligence screens wired to live-polled data; replay visibly animates numbers.
- **Day 4** — Narrative Intelligence hero screen + Network Graph screen (React Flow), NVIDIA API integration for the "why is this trending" explanation with template fallback.
- **Day 5** — AI Analyst screen (suggested prompts → `/api/ai/query`), Alerts, polish transitions/animations, aggregate Audience screen if time allows.
- **Day 6** — End-to-end run-through with no manual DB edits, bug fixing, cut anything not stable.
- **Day 7** — Record the demo video per PRD §10, buffer for re-takes.

## 16. Definition of done (MVP subset)

- [ ] Replay runs start-to-finish without manual intervention
- [ ] Trend score updates live during replay and crosses an alert threshold
- [ ] At least one lifecycle transition and one mutation are detected and shown
- [ ] Attention migration detected and visualized for at least one narrative
- [ ] Network graph renders and grows during replay
- [ ] AI Analyst answers the suggested prompts with evidence, and still works (via fallback) if the NVIDIA key is unavailable
- [ ] No screen implies live API access — Replay Mode labeled throughout

## 17. Deferred to V2 (do not build now)

Spring Boot backend, Postgres/OpenSearch/Redis/Kafka, Docker/microservices, live X/Telegram API adapters, Narrative Memory (historical similarity search), Narrative Bridge Detection, Counter-Narrative Detection, What-If Simulation, Narrative Collision, Event-to-Narrative Correlation, Polarization Radar, Conversation Drop Intelligence, RBAC/audit logging beyond a token-gated login, full multilingual support beyond English/Hindi keyword handling.
