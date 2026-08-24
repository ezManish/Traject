# TRAJECT — Explainable Narrative Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.11%2B%20%7C%203.13-blue?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-SQLModel-003B57?logo=sqlite&logoColor=white)](https://sqlmodel.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Smart India Hackathon 2026 · PS26152: Social Media Analytics (NTRO)**  
> *Deterministic narrative detection, framing mutation discovery, cross-platform propagation tracking, and evidence-grounded AI intelligence.*

---

## 1. Executive Summary & Thesis

Conventional social-listening tools focus only on **what** is trending by aggregating keyword frequencies and engagement metrics. 

**TRAJECT** transforms raw, multi-platform social streams into **explainable narrative intelligence**. It models information cascades as living mathematical objects:
* **Tracks narrative genesis** from early seed anomalies.
* **Detects framing mutation** when stories transform in sentiment and vocabulary (e.g. *transit delay* $\to$ *substation blackout crisis*).
* **Maps attention migration** as velocity shifts across platforms (X $\to$ Telegram $\to$ Mainstream News).
* **Identifies community bridges** using graph topology and betweenness centrality.
* **Enforces zero-hallucination AI** by constraining LLM synthesis to verified, cited post receipts (`[P09, P12, P18]`).

```
┌────────────────────────────────────────────────────────┐
│      REPLAY DATASET (Synthetic 36 events, X + TG)      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FASTAPI BACKEND                      │
│  - Replay Ticker (/api/replay/*)                       │
│  - 6-Factor Deterministic Trend Scoring (TRD §7)       │
│  - Narrative Lifecycle, Mutation & Migration Engine    │
│  - NetworkX Graph Topology & Louvain Communities       │
│  - NVIDIA NIM AI Proxy + Deterministic Fallback        │
│  - SQLite Database Store (SQLModel)                    │
└───────────────────────────┬────────────────────────────┘
                            │ REST / Polling
                            ▼
┌────────────────────────────────────────────────────────┐
│           REACT 18 + VITE + TAILWIND FRONTEND          │
│  - 84px Pulse Rail (Seismograph Trace & HUD Navigation)│
│  - Screen 1: Executive Intelligence Dashboard          │
│  - Screen 2: Trend Intelligence (6-Factor Breakdown)   │
│  - Screen 3: Narrative Intelligence ("Why is it hot?") │
│  - Screen 4: Topology Radar (Louvain & Bridge Accounts)│
│  - Screen 5: Audience Demographics (Aggregate DP k≥50) │
│  - Screen 6: Evidence-Grounded AI Analyst Co-Pilot     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Core Capabilities & Mathematical Models

### 1. 6-Factor Deterministic Trend Scoring (TRD §7)
Trend scores ($0\text{–}100$) are calculated on every tick using six transparent factors:
$$\text{TS} = 0.25 \cdot \text{Vol} + 0.20 \cdot \text{Eng} + 0.20 \cdot \text{Acc} + 0.15 \cdot \text{Anom} + 0.10 \cdot \text{Sent} + 0.10 \cdot \text{Net}$$

* **Volume Growth ($\text{Vol}$)**: Log-normalized post volume.
* **Engagement Velocity ($\text{Eng}$)**: Rate of likes, shares, and reposts per minute.
* **Acceleration ($\text{Acc}$)**: First derivative of velocity $\frac{\Delta V}{\Delta t}$.
* **Anomaly Detection ($\text{Anom}$)**: $Z$-score departure against historical moving averages.
* **Sentiment Shift ($\text{Sent}$)**: Divergence in negative/positive polarity velocity.
* **Network Propagation ($\text{Net}$)**: Cross-community edge density and cluster spread.

### 2. Narrative Lifecycle State Machine
Narratives transition deterministically across 7 distinct lifecycle stages:
$$\text{SEED} \longrightarrow \text{EMERGING} \longrightarrow \text{EXPANDING} \longrightarrow \text{VIRAL} \longrightarrow \text{SATURATION} \longrightarrow \text{DECLINING} \longrightarrow \text{DORMANT}$$

### 3. Framing Mutation Discovery
Detects semantic divergence between the earliest 30% of posts and the latest 30% of posts using $n$-gram Jaccard divergence and TF-IDF term shift. Highlights when a minor incident is weaponized or reframed into a crisis.

### 4. Cross-Platform Attention Migration
Quantifies platform distribution over time ($X \leftrightarrow \text{Telegram}$) and alerts operators when discussion shifts into encrypted or regional broadcast channels.

### 5. NetworkX Directed Graph Topology
Builds directed interaction graphs from `@mentions`, `reply_to`, and `reshare_of` relationships:
* **Louvain Modularity**: Partitions accounts into distinct ideological/community clusters.
* **Betweenness Centrality**: Identifies high-leverage bridge nodes connecting otherwise isolated groups.

### 6. Zero-Hallucination AI Analyst Co-Pilot
Integrates NVIDIA NIM (`llama-3.3-nemotron-super-49b-v1.5`). The engine provides strictly bounded context from SQLite facts and requires exact citation receipts (`[P01, P08]`). If the model is offline or unconfigured, the system automatically falls back to deterministic rule-based synthesis.

---

## 3. UI Design System (Terminal Green & Tactical Dark)

* **Base Palette**:
  * Canvas: `#0A0D12` (Matte Obsidian)
  * Surface / Cards: `#12161D` with `#262C38` Hairline Borders
  * Elevated: `#1A1F29`
* **Single Dominant Accent**: Terminal Green (`#4ADE80`) for active telemetry, live indicators, and seismograph traces.
* **Critical Alerts**: Danger Red (`#FF4D4D`) and Mutation Amber (`#FFB020`).
* **Typography**: Clean `Inter` headings paired with `JetBrains Mono` for all data keys, timestamps, citations, and formulas.

---

## 4. Tech Stack

| Component | Technology | Version / Specification |
|---|---|---|
| **Backend Runtime** | Python | `3.11+` / `3.13` |
| **API Framework** | FastAPI + Uvicorn | `0.115+` |
| **Data Persistence** | SQLModel + SQLite | Zero external database setup |
| **Graph Intelligence** | NetworkX | Python-Louvain clustering |
| **AI Inference** | NVIDIA NIM API | `llama-3.3-nemotron-super-49b-v1.5` |
| **Frontend Framework** | React + TypeScript | `18.3` + `TS 5.5` |
| **Styling & Icons** | Tailwind CSS + Lucide React | `3.4` |
| **Data Visualization** | Recharts + SVG Canvas | Real-time kinetic waveforms |
| **State Management** | Zustand | Reactive polling & cache store |

---

## 5. Repository Structure

```
traject/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app, CORS middleware, router registration
│   │   ├── config.py               # Pydantic Settings & environment variables
│   │   ├── db.py                   # SQLite engine & session management
│   │   ├── models.py               # SQLModel schemas & response DTOs
│   │   ├── data/
│   │   │   └── replay_dataset.json # Ground-truth 36 synthetic events (X + Telegram)
│   │   ├── services/
│   │   │   ├── replay.py           # Playback tick manager & dynamic .env reader
│   │   │   ├── trend.py            # 6-factor deterministic scoring engine
│   │   │   ├── narrative.py        # Lifecycle, mutation, migration, weak signal detection
│   │   │   ├── network.py          # NetworkX topology, Louvain clusters, bridge nodes
│   │   │   └── ai_analyst.py       # NVIDIA NIM LLM client + grounded fallback
│   │   └── routers/
│   │       ├── replay.py           # /api/replay/* endpoints
│   │       ├── trends.py           # /api/trends/* endpoints
│   │       ├── narratives.py       # /api/narratives/* endpoints
│   │       └── ai.py               # /api/ai/* endpoints
│   ├── tests/
│   │   ├── test_day1.py            # SQLite schema & database tests
│   │   ├── test_day2.py            # Deterministic trend scoring & formula tests
│   │   ├── test_day4.py            # Narrative state machine & mutation tests
│   │   ├── test_day5.py            # Network graph & bridge detection tests
│   │   └── test_day6.py            # End-to-end replay & AI analyst tests
│   ├── requirements.txt            # Python dependencies
│   └── .env.example                # Backend environment template
├── frontend/
│   ├── src/
│   │   ├── api/client.ts           # REST API client & interfaces
│   │   ├── store/useTrajectStore.ts# Zustand global reactive store
│   │   ├── components/
│   │   │   ├── PulseRail.tsx       # Kinetic seismograph navigation rail
│   │   │   └── TopHeader.tsx       # Minimal live stream indicator & playback controls
│   │   ├── pages/
│   │   │   ├── ExecutiveDashboard.tsx    # Screen 1: Situation matrix & leaderboard
│   │   │   ├── TrendIntelligence.tsx     # Screen 2: 6-factor gauges & area chart
│   │   │   ├── NarrativeIntelligence.tsx # Screen 3: Hero case file & mutation chamber
│   │   │   ├── NetworkGraph.tsx          # Screen 4: Network topology & bridge accounts
│   │   │   ├── AudienceIntelligence.tsx  # Screen 5: Aggregate demographics (DP k≥50)
│   │   │   └── AIAnalyst.tsx             # Screen 6: Grounded AI analyst co-pilot
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── DEMO_GUIDE.md                   # Evaluator walkthrough script
├── TRAJECT_PRD.md                  # Product Requirements Document
├── TRAJECT_TRD.md                  # Technical Requirements Document
├── TRAJECT_DESIGN.md               # Visual Design System Specification
└── README.md
```

---

## 6. Quickstart & Installation

### Prerequisites
* **Python 3.11+**
* **Node.js 18+** and **npm**

### Step 1: Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Copy environment file and configure settings
cp .env.example .env

# Launch FastAPI backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* Interactive API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`

### Step 2: Frontend Setup
```bash
# In a new terminal, navigate to frontend folder
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
* Web Application: `http://localhost:5173/`

---

## 7. Replay Speed Control via `.env`

You can dynamically adjust the stream speed without restarting the backend:

1. Open `backend/.env`.
2. Edit `REPLAY_TICK_SECONDS`:
   ```ini
   # Speed up stream (e.g. 1.0s or 0.5s per tick)
   REPLAY_TICK_SECONDS=1.0
   ```
3. The replay singleton dynamically reads `.env` on every tick for instantaneous rate changes.

---

## 8. Verification & Test Suite

Run the full automated test suite:
```bash
python backend/tests/test_day1.py
python backend/tests/test_day2.py
python backend/tests/test_day4.py
python backend/tests/test_day5.py
python backend/tests/test_day6.py
```
All tests run natively against localized SQLite instances with zero external dependencies and exit with code `0`.

---

## 9. Responsible AI & Data Ethics

* **Honest Labeling**: Stream indicators explicitly declare historical dataset replay mode.
* **Privacy-Preserving Demographics**: Slices are computed on aggregate cohort clusters ($k \ge 50$) under Differential Privacy standards — strictly zero individual profiling or personal data extraction.
* **Bounded Confidence**: Intelligence assertions require explicit confidence percentages and post receipt citations.

---

## 10. License

Distributed under the MIT License. See `LICENSE` for more information.
