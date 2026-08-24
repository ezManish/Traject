# TRAJECT — 5-Minute Evaluator Demo Script & Presentation Guide
### SIH 2026 · PS26152: Social Media Analytics (NTRO)

---

## 1. Executive Summary & Value Proposition

> **Core Thesis**: *"Most social listening tools tell you **what** is trending. TRAJECT tells you **how** it was born, how the narrative is **mutating**, where attention is **migrating**, who is connecting distinct communities, and what could happen next — grounded in structured evidence, not guesswork."*

---

## 2. 5-Minute Demo Timeline & Script

```
0:00 ─── Hook: Executive Intelligence & Baseline State
0:30 ─── Multi-Platform Replay Ingestion (X + Telegram)
1:00 ─── Escalation Alert & 6-Factor Deterministic Trend Scoring
1:30 ─── Seismograph Heat Trace & Sentiment Temperature
2:30 ─── Network Topology, Louvain Clusters & Bridge Accounts
3:15 ─── Hero Screen ("Why is this trending?") & Framing Mutation
4:15 ─── Grounded AI Analyst (Zero Hallucination Protocol)
4:45 ─── Closing Statement & Architecture Highlights
```

---

### Segment 1: The Hook & Executive Intelligence (0:00 – 0:30)

- **Screen**: [Executive Intelligence](file:///d:/Projects/Traject/frontend/src/pages/ExecutiveDashboard.tsx)
- **Action**: Start at **Tick 0** (Replay Reset).
- **Spoken Script**:
  > *"Judges, in intelligence operations, by the time an issue trends on Twitter, you're already hours behind. This is **TRAJECT** — a narrative-intelligence platform built for the NTRO challenge. Notice our left rail: this is the **Pulse Rail**, an instrument seismograph encoding narrative intensity from faint seeds to viral spikes. We operate strictly in a labeled **Historical Dataset Replay Mode** to guarantee reproducible, honest telemetry without black-box claims."*

---

### Segment 2: Streaming Ingestion & Trend Escalation (0:30 – 1:15)

- **Action**: Click the **Step Forward** / **Play** button in the top header. Advance to **Tick 3 – 4**.
- **Visual Outcome**: Total analyzed events increase ($0 \to 18$). Trend score climbs to $70.3$ (`EXPANDING`).
- **Spoken Script**:
  > *"As chronological events stream in from X and Telegram, our deterministic engine recomputes scores on every tick. Notice our **Critical Signal Escalation Alert** firing at the top. This isn't an arbitrary follower counter — it's driven by our deterministic 6-factor formula incorporating volume velocity, acceleration, anomaly multipliers, sentiment shifts, and cross-platform spread."*

---

### Segment 3: Trend Intelligence & 6-Factor Breakdown (1:15 – 2:00)

- **Screen**: Switch to **Trend Intelligence** via the Pulse Rail `TREND` notch.
- **Visual Outcome**: Recharts Seismograph Area Chart renders the magenta heat trace (`#FF3D97`). The 6-factor formula stack and tri-color sentiment bar display real-time values.
- **Spoken Script**:
  > *"Here in Trend Intelligence, the analyst sees the exact mathematical breakdown: $25\%$ volume growth, $20\%$ engagement velocity, $20\%$ acceleration, $15\%$ anomaly, $10\%$ sentiment shift, and $10\%$ network propagation. Notice our sentiment gauge: we deliberately reject the generic traffic-light scheme. Hot magenta represents agitated negative emotion ($63\%$), mauve represents neutral, and calm teal represents positive."*

---

### Segment 4: Network Graph & Cross-Platform Propagation (2:00 – 3:00)

- **Screen**: Switch to **Network Graph** via the Pulse Rail `GRAPH` notch.
- **Visual Outcome**: Interactive directed graph displaying $20$ nodes and community clusters. Nodes show platform rings (X vs. Telegram) and gold rings highlight bridge accounts.
- **Spoken Script**:
  > *"In social listening, who connects communities matters more than who has the most followers. Our NetworkX graph computes Louvain community clusters and betweenness centrality. Notice these nodes with **Evidence Gold rings**: these are bridge accounts connecting the isolated commuter cluster on Telegram with mainstream journalists on X, accelerating the spread across the entire information landscape."*

---

### Segment 5: The Hero Screen — "Why is this trending?" (3:00 – 4:15)

- **Screen**: Switch to **Narrative Intelligence** via the Pulse Rail `STORY` notch.
- **Action**: Advance replay to **Tick 6 – 7** (`VIRAL`, score $83.0$).
- **Visual Outcome**: Case file briefing card updates. Mutation Callout appears (`"Routine Commuter Delay"` $\to$ `"Power Grid Failure / Infrastructure Crisis"`). Evidence strip shows verified receipts `[P09, P12, P18]`.
- **Spoken Script**:
  > *"This is the heart of TRAJECT: **Why is this trending?** Rather than guessing, TRAJECT generates an evidence-grounded case file. Look at this callout: our n-gram divergence engine detected a **Framing Mutation** — the story began as casual commute delays at Rajiv Chowk, but mutated into a power grid and substation crisis. Every claim on screen has attached post receipts and confidence intervals. No hallucinated numbers, no unverifiable assertions."*

---

### Segment 6: Grounded AI Analyst (4:15 – 4:45)

- **Screen**: Switch to **AI Analyst** via the Pulse Rail `ANALYST` notch.
- **Action**: Click the suggested inquiry: `“What is the detected framing mutation in this narrative?”`.
- **Visual Outcome**: AI responds instantly with grounded text citing post receipts `[P12, P18]`.
- **Spoken Script**:
  > *"Our AI Analyst, powered by NVIDIA NIM inference (`llama-3.3-nemotron-super-49b-v1.5`), operates under a strict Zero-Hallucination Protocol. It is fed only curated SQLite telemetry and is constrained to answer strictly from verified facts. If the API endpoint is offline, our deterministic fallback ensures zero downtime."*

---

### Segment 7: Audience Intelligence & Closing Statement (4:45 – 5:00)

- **Screen**: Click `AUDIENCE` on the Pulse Rail.
- **Spoken Script**:
  > *"Finally, our Audience Intelligence module provides aggregate demographic and corridor estimations with a strict responsible-AI guardrail — aggregate only, zero individual profiling.*
  >
  > *To conclude: **TRAJECT doesn't just tell you what people are saying. It tells you what is emerging, how the narrative is mutating, where it is moving, who is connecting it, and what will happen next.** Thank you."*

---

## 3. Key Evaluator Questions & Answers

| Potential Judge Question | Grounded Answer |
|---|---|
| *Is this using live social media APIs?* | *"No, we explicitly label this **Historical Dataset Replay Mode**. Claiming live X/Telegram streaming during an MVP demo would be dishonest. Replay allows deterministic evaluation of our analytics engine."* |
| *How do you prevent LLM hallucinations?* | *"The LLM does zero mathematical scoring. Trend scores, lifecycle stages, and mutations are computed deterministically in Python. The LLM only synthesizes that structured evidence payload."* |
| *Why magenta instead of a dark neon theme?* | *"We didn't pick an accent color — we built an intensity instrument. The 7-stage lifecycle ramp (from seed mauve to viral magenta) directly communicates narrative intensity across the Pulse Rail."* |
