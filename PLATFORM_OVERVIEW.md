# TRAJECT — Teammate & Evaluator Presentation Guide
### Social Media Analytics & Explainable Narrative Intelligence (SIH 2026 · PS26152 / NTRO)

---

## 1. Why TRAJECT Exists (The Problem & The Solution)

### The Problem with Conventional Social Listening
Standard platforms (Brandwatch, Talkwalker, Hootsuite, Google Trends) only tell you **what** is trending by counting likes, retweets, and hashtags after the fact.
- By the time an issue trends on Twitter, security and operations teams are already **hours behind**.
- They cannot explain **how** the story evolved, **who** connected separate online groups, or **why** it suddenly escalated.

### The TRAJECT Solution
**TRAJECT** is an **explainable narrative-intelligence console** designed for an intelligence / operations center. It treats narratives as **living organisms**:
1. **Catches Weak Signals**: Flags small, accelerating clusters before they gain mass visibility.
2. **Detects Framing Mutations**: Automatically flags when a narrative's meaning shifts (e.g., from a routine delay to an infrastructure crisis).
3. **Maps Attention Migration**: Tracks information moving across platforms (X $\longrightarrow$ Telegram $\longrightarrow$ News).
4. **Zero-Hallucination AI Briefings**: Integrates NVIDIA NIM to synthesize natural-language briefings backed by verified post citations (`[P09, P12, P18]`).

---

## 2. Real-World Use Case Scenario

### Scenario: The Infrastructure Crisis Spiral
* **08:15 AM (Seed)**: A few commuters on X post about train delays at Rajiv Chowk Metro station.
* **08:25 AM (Migration)**: Commuters switch to regional Telegram broadcast channels to share real-time updates.
* **08:40 AM (Mutation)**: Rumors start spreading on Telegram that the delay is actually a **regional power grid failure and substation blackout**.
* **08:55 AM (Viral Peak)**: Journalists on X pick up the Telegram rumors, amplifying the power-grid crisis framing to the general public.

**Where TRAJECT Wins**: 
TRAJECT detects the **framing mutation** and **bridge accounts** at 08:40 AM—hours before official press briefings—allowing authorities to intervene with accurate facts immediately.

---

## 3. Architecture & How It Works Under the Hood

```
                 Multi-Platform Ingestion (X + Telegram)
                                    │
                                    ▼
       [Replay Controller] (Chronological 10-tick playback loop)
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
[Deterministic Trend Scoring]                      [Narrative Innovation Engine]
• 6-Factor Formula:                                • Lifecycle State Machine (7 stages)
  - 0.25 × Volume Growth                           • Framing Mutation (N-gram divergence)
  - 0.20 × Engagement Velocity                     • Attention Migration (X ↔ Telegram)
  - 0.20 × Acceleration                            • Weak Signal Anomaly Multiplier
  - 0.15 × Anomaly Spike                           • NetworkX Topology (Louvain + Bridges)
  - 0.10 × Sentiment Shift                                    │
  - 0.10 × Network Spread                                     ▼
          │                                  [Grounded AI Analyst (NVIDIA NIM)]
          └─────────────────────────────────► • Zero-Hallucination Protocol
                                              • Cites verified post IDs [P09, P18]
```

> **Key Rule**: The LLM **never** calculates math or invents numbers. All scores, graphs, and stages are computed in Python deterministically. The NVIDIA LLM (`llama-3.3-nemotron-super-49b-v1.5`) only translates structured evidence into clear English briefings.

---

## 4. UI Walkthrough (Screen-by-Screen Click Guide)

Open `http://localhost:5173`. Notice the left **72px Pulse Rail** (a vertical seismograph that traces live narrative heat) and the top bar labeled **Historical Dataset Replay Mode**.

```
┌──────┬─────────────────────────────────────────────────────────────┐
│ P    │  [Historical Dataset Replay Mode]   [▶ Play] [⏭ Step] [↺]   │
│ U    ├─────────────────────────────────────────────────────────────┤
│ L    │                                                             │
│ S    │                                                             │
│ E    │                 MAIN INTERACTIVE SCREEN                     │
│      │                                                             │
│ R    │                                                             │
│ A    │                                                             │
│ I    │                                                             │
│ L    │                                                             │
└──────┴─────────────────────────────────────────────────────────────┘
```

---

### Step 1: Start on Executive Dashboard (`EXEC` icon)
* **What it shows**: The bird's-eye view of all active narratives, current replay tick, and live streaming posts.
* **How to demo it**:
  1. Click the **Step Forward** (`⏭`) button in the top header 3–4 times.
  2. Watch the **Leaderboard** animate: the *"Transit System Delay"* trend score climbs from $34.6 \to 73.7$ (`EXPANDING`).
  3. At Tick 6, watch the **Critical Signal Escalation Alert** banner trigger with a magenta border as the score hits $83.0$ (`VIRAL`).
  4. Click **"Inspect Case File"** on the banner to jump straight to the Hero screen.

---

### Step 2: Inspect the Math on Trend Intelligence (`TREND` icon)
* **What it shows**: The deterministic telemetry behind the trend score.
* **How to demo it**:
  1. Look at the **Area Chart**: It renders a magenta heat trace (`#FF3D97`) showing velocity over time.
  2. Look at the **6-Factor Stack**: Displays the exact mathematical contributions:
     - Volume Growth: $51.6$
     - Engagement Velocity: $79.4$
     - Acceleration: $81.0$
     - Anomaly: $87.0$
     - Sentiment Shift: $80.0$
     - Network Propagation: $77.0$
  3. Look at the **Tri-Color Sentiment Temperature**:
     - **Hot Magenta** = Negative/Agitated emotion ($63\%$).
     - **Mauve** = Neutral emotion ($20\%$).
     - **Calm Teal** = Positive emotion ($17\%$).

---

### Step 3: Reveal the Mutation on Narrative Intelligence (`STORY` icon — Hero Screen)
* **What it shows**: Answers the question: *"Why is this trending?"*
* **How to demo it**:
  1. Read the **Intelligence Summary Briefing** card at the top (synthesized by NVIDIA NIM).
  2. Point out the **Framing Mutation Box** (highlighted with an Evidence Gold arrow):
     - Left box: `"Routine Commuter Delay (rajiv, chowk)"`
     - $\longrightarrow$ Right box: `"Power Grid Failure / Infrastructure Crisis (stations, power)"`
  3. Point out the **Cross-Platform Attention Migration** badge ($80\% \text{ X} \to 40\% \text{ Telegram}$).
  4. Scroll to the bottom **Evidence Receipts Strip**: Show the actual post cards `[P09]`, `[P12]`, `[P18]` with exact timestamps and engagement metrics.

---

### Step 4: Map the Spread on Network Graph (`GRAPH` icon)
* **What it shows**: The topology of who is talking to whom across platforms.
* **How to demo it**:
  1. Point out the **Node Visuals**:
     - **Node Size** = Account influence score (PageRank + engagement).
     - **Node Color** = Community cluster (Louvain algorithm).
     - **Node Border** = Platform (Solid white for X, Slate-blue dashed for Telegram).
     - **Dashed Gold Outer Rings** = **Bridge Accounts** (accounts with high betweenness centrality connecting separate groups).
  2. Click on any node (e.g., `@OfficialDMRC` or `@kavita_journo`) to open the **Account Inspector** on the right.
  3. Use the **Bottom Time Scrubber** to step back and forth through time.

---

### Step 5: Responsible-AI Demographics on Audience Intelligence (`AUDIENCE` icon)
* **What it shows**: Aggregate audience estimation with privacy guardrails.
* **How to demo it**:
  1. Point out the top green badge: **"AGGREGATE-ONLY PROTOCOL"**.
  2. Point out the disclaimer: *"Aggregate statistical estimation — strictly zero individual-level profiling."*
  3. Show the aggregate age distribution ($18\text{–}24$, $25\text{–}34$), Hindi/English language split, and corridor distribution.

---

### Step 6: Query the AI Analyst (`ANALYST` icon)
* **What it shows**: Natural-language Q&A backed by post citations.
* **How to demo it**:
  1. Click any suggested prompt button, such as:
     - `“What is the detected framing mutation in this narrative?”`
     - `“Why is this trend growing so rapidly?”`
  2. Watch the AI respond with a concise briefing citing receipts: `Cited Receipts: [P12, P18] · Confidence: 93%`.
  3. Type your own custom question in the input bar and press Enter.

---

## 5. 30-Second Elevator Pitch (For Teammates & Judges)

> *"Most social tools only count retweets after a story is already viral. **TRAJECT** is an explainable narrative-intelligence console built for operations centers. 
> 
> As events stream in from X and Telegram, our deterministic engine tracks the narrative lifecycle across 7 stages, detects when early commute complaints **mutate** into rumors of a power grid collapse, highlights **bridge accounts** connecting isolated groups, and gives analysts evidence-backed AI briefings citing exact post receipts. 
> 
> Everything is verifiable, deterministic, and free of AI hallucinations."*

---

## 6. Frequently Asked Questions by Judges

| Potential Judge Question | Grounded Answer |
|---|---|
| **Is this using live social media APIs?** | *"No, we explicitly label this **Historical Dataset Replay Mode**. Claiming live streaming during an MVP demo would be dishonest. Replay allows deterministic, reproducible evaluation of our analytics engine."* |
| **How do you prevent LLM hallucinations?** | *"The LLM does zero mathematical scoring. Trend scores, lifecycle stages, and mutations are computed deterministically in Python. The LLM only synthesizes that structured evidence payload."* |
| **Why magenta instead of a dark neon theme?** | *"We didn't pick an accent color — we built an intensity instrument. The 7-stage lifecycle ramp (from seed mauve to viral magenta) directly communicates narrative intensity across the Pulse Rail."* |
