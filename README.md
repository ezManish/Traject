# TRAJECT — Explainable Narrative Intelligence Platform

### Smart India Hackathon 2026 · PS26152: Social Media Analytics (NTRO)

---

## 1. Overview & Core Thesis

Most conventional social-listening and monitoring platforms tell you **what** is trending by counting hashtags and likes. 

**TRAJECT** transforms raw, multi-platform social streams into **explainable narrative intelligence** — it tracks how narratives are born, detects weak signals before they escalate, maps how framing mutates across communities and platforms, and explains *why* something is trending using deterministic evidence receipts rather than hallucinated AI claims.

```
┌────────────────────────────────────────────────────────┐
│      REPLAY DATASET (Synthetic 36 events, X + TG)      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FASTAPI BACKEND                      │
│  - Replay Ticker (/api/replay/*)                       │
│  - 6-Factor Deterministic Trend Scoring                │
│  - Narrative Lifecycle, Mutation & Migration Engine    │
│  - NetworkX Graph Topology & Louvain Communities       │
│  - NVIDIA NIM AI Proxy + Grounded Fallback             │
│  - SQLite Database Store                               │
└───────────────────────────┬────────────────────────────┘
                            │ REST / Polling (2.5s)
                            ▼
┌────────────────────────────────────────────────────────┐
│           REACT 18 + VITE + TAILWIND FRONTEND          │
│  - 72px Signature Pulse Rail (Seismograph Trace)       │
│  - Screen 1: Executive Intelligence Dashboard          │
│  - Screen 2: Trend Intelligence (6-Factor Gauges)      │
│  - Screen 3: Hero Narrative Intelligence ("Why?")      │
│  - Screen 4: Network Graph (Topology + Scrubber)       │
│  - Screen 6: Audience Intelligence (Aggregate Only)    │
│  - Screen 7: Grounded AI Analyst                       │
└────────────────────────────────────────────────────────┘
```

---

## 2. Key Innovations

### 1. Narrative Lifecycle State Machine
Tracks narratives as living objects across 7 distinct states based on score and velocity thresholds:
$$\text{SEED} \longrightarrow \text{EMERGING} \longrightarrow \text{EXPANDING} \longrightarrow \text{VIRAL} \longrightarrow \text{SATURATION} \longrightarrow \text{DECLINING} \longrightarrow \text{DORMANT}$$

### 2. Framing Mutation Detection
Compares salient keyword and n-gram divergence between the early 30% of posts and the latest 30% of posts to detect shifts in how a story is framed (e.g., `"Routine Commuter Delay"` $\to$ `"Power Grid Failure / Infrastructure Crisis"`).

### 3. Cross-Platform Attention Migration
Computes platform share over time and logs migration events as information velocity transitions from early individual complaints on X to regional alert broadcast channels on Telegram and back to mainstream media.

### 4. Weak Signal Early Warning
Identifies accelerating small clusters ($3\text{–}14$ posts) with velocity multipliers before they achieve broad public visibility.

### 5. NetworkX Graph Topology & Bridge Detection
Constructs directed interaction networks from `@mentions`, `reply_to`, and `reshare_of` relationships to identify Louvain community clusters and bridge accounts connecting disparate groups using betweenness centrality.

### 6. Evidence-Grounded AI Analyst (Zero Hallucination Protocol)
Integrates NVIDIA NIM (`llama-3.3-nemotron-super-49b-v1.5`) to synthesize intelligence briefings. The LLM is fed strictly structured SQLite facts and is constrained to cite specific post IDs (`[P09, P12, P18]`), with an automatic deterministic fallback when offline.

---

## 3. Visual Design System

TRAJECT is designed as a **signal-intelligence console**, modeled after seismographs and spectrograms:
- **Base Canvas**: Ink-plum (`#150F18`), not generic black.
- **7-Stage Lifecycle Intensity Ramp**:
  - `SEED`: `#8C6B84` (faint plum)
  - `EMERGING`: `#B4508A` (warming magenta)
  - `EXPANDING`: `#D42E82` (core instrument magenta)
  - `VIRAL`: `#FF3D97` (hot saturated peak)
  - `SATURATION`: `#A61E6B` (dense violet plateau)
  - `DECLINING`: `#6B4A63` (fading mauve)
  - `DORMANT`: `#3A2E39` (ghost trace)
- **Evidence Gold (`#E3A542`)**: Used exclusively for evidence receipts, mutation connectors, and bridge account rings.
- **Calm Teal (`#5FA8A0`)**: Used exclusively for positive sentiment.
- **72px Pulse Rail**: Persistent vertical seismograph on every screen showing the focused narrative's live heat trace and embedded screen navigation notches.

---

## 4. Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.11+ / 3.13, FastAPI, SQLModel, SQLite, NetworkX, HTTPX, Pydantic v2 |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Recharts, Framer Motion, Zustand, Lucide Icons |
| **AI Inference** | NVIDIA NIM API (`llama-3.3-nemotron-super-49b-v1.5`) + Deterministic Grounded Fallback |
| **Fonts** | Fraunces (Display/Narrative), IBM Plex Mono (Data Readout), Public Sans (UI Body) |

---

## 5. Repository Structure

```
traject/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application, CORS, and routers
│   │   ├── config.py               # Pydantic Settings & environment loader
│   │   ├── db.py                   # SQLite engine and session dependencies
│   │   ├── models.py               # SQLModel schemas & DTOs
│   │   ├── data/
│   │   │   └── replay_dataset.json # 36 synthetic events (X + Telegram)
│   │   ├── services/
│   │   │   ├── replay.py           # Playback tick manager
│   │   │   ├── trend.py            # 6-factor deterministic scoring
│   │   │   ├── narrative.py        # Lifecycle, mutation, migration, weak signal
│   │   │   ├── network.py          # NetworkX graph, PageRank, Louvain communities
│   │   │   └── ai_analyst.py       # NVIDIA NIM client + grounded fallback
│   │   └── routers/
│   │       ├── replay.py           # /api/replay/* endpoints
│   │       ├── trends.py           # /api/trends/* endpoints
│   │       ├── narratives.py       # /api/narratives/* endpoints
│   │       └── ai.py               # /api/ai/* endpoints
│   ├── tests/
│   │   ├── test_day1.py
│   │   ├── test_day2.py
│   │   ├── test_day4.py
│   │   ├── test_day5.py
│   │   └── test_day6.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/client.ts           # REST API client & interfaces
│   │   ├── store/useTrajectStore.ts# Zustand global reactive store
│   │   ├── components/
│   │   │   ├── PulseRail.tsx       # 72px signature seismograph navigation rail
│   │   │   └── TopHeader.tsx       # Replay mode header & playback controls
│   │   ├── pages/
│   │   │   ├── ExecutiveDashboard.tsx    # Screen 1: Overview & live stream
│   │   │   ├── TrendIntelligence.tsx     # Screen 2: 6-factor gauges & area chart
│   │   │   ├── NarrativeIntelligence.tsx # Screen 3: Hero case file & mutation
│   │   │   ├── NetworkGraph.tsx          # Screen 4: Network topology & scrubber
│   │   │   ├── AudienceIntelligence.tsx  # Screen 6: Aggregate demographics
│   │   │   └── AIAnalyst.tsx             # Screen 7: Grounded AI queries
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── DEMO_GUIDE.md                   # 5-minute evaluator demonstration walkthrough
├── TRAJECT_PRD.md                  # Product Requirements Document
├── TRAJECT_TRD.md                  # Technical Requirements Document
├── TRAJECT_DESIGN.md               # Visual Design System Specification
└── README.md
```

---

## 6. Quickstart & Local Setup

### Prerequisites
- **Python 3.11+** installed
- **Node.js 18+** and **npm** installed

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Copy environment template and configure NVIDIA API key if available
copy .env.example .env

# Run FastAPI backend server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The interactive API documentation (Swagger UI) will be live at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install Node packages
npm install

# Start Vite dev server
npm run dev
```
Open your browser at `http://127.0.0.1:5173`.

---

## 7. Running Replay & Demonstrating Features

1. Click **Play** or **Step Forward** in the top header to stream events tick-by-tick.
2. Watch the **Executive Dashboard** leaderboard update with animated rank transitions as the trend score climbs from $34.6 \to 83.0$ (`VIRAL`).
3. Notice the **Critical Signal Escalation Alert** fire at Tick 6.
4. Click **TREND** on the Pulse Rail to inspect the 6-factor formula stack and Recharts heat-trace seismograph.
5. Click **GRAPH** to interact with the NetworkX Louvain community topology and observe bridge accounts.
6. Click **STORY** to inspect the Hero case file with detected framing mutations (`"Routine Commuter Delay"` $\to$ `"Power Grid Failure"`).
7. Click **ANALYST** to ask grounded inquiries backed by verified citations (`[P09, P12, P18]`).

For the exact 5-minute presentation script and evaluator talking points, see [DEMO_GUIDE.md](file:///d:/Projects/Traject/DEMO_GUIDE.md).

---

## 8. Responsible AI & Replay Mode Guarantee

- **Honest Labeling**: Every screen clearly displays `"Historical Dataset Replay Mode"` — no claim of live X/Telegram API access is made.
- **Zero Hallucination Protocol**: Scoring and metrics are computed deterministically in Python; the LLM only translates structured evidence into natural language.
- **Aggregate Demographics Only**: Audience intelligence estimates general age, language, and geographic corridors with confidence intervals — strictly zero individual profiling.

---

## 9. Verification & Automated Tests

Run the full suite of automated verification scripts:
```bash
# In the project root:
python backend/tests/test_day1.py
python backend/tests/test_day2.py
python backend/tests/test_day4.py
python backend/tests/test_day5.py
python backend/tests/test_day6.py
```
All tests execute end-to-end against the SQLite store with zero mock dependencies and exit with code `0`.
