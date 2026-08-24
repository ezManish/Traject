# TRAJECT — Product Requirements Document (PRD)
### SIH 2026 · PS26152 — Social Media Analytics (NTRO)
### MVP scope: 1-week build → demo + video submission

---

## 1. One-liner

**TRAJECT transforms fragmented social-media activity into explainable narrative intelligence** — it detects weak signals before they become major trends, tracks how narratives evolve and migrate across communities and platforms, and explains *why* something is trending using evidence, not guesswork.

Most tools tell you *what* is trending. TRAJECT tells you how it was born, how it's changing, where it's moving, and what could happen next.

## 2. Official Problem Statement (context, not to be re-pitched as ours)

SIH26152 asks for an AI-driven Social Media Analytics Framework that simultaneously:
- infers follower sentiment,
- maps audience demographics (aggregate, anonymized),
- identifies trending narratives,
- performs link/network analysis,
- explains how information and influence flow among followers.

Required platforms: X (Twitter) + Telegram are must-have; Instagram/Facebook desirable; Reddit/YouTube a bonus. **For the MVP we implement this via a labeled Replay Mode over a historical/synthetic dataset** — we do not claim live-API access we don't have.

## 3. What is NOT a differentiator (explicitly acknowledged)

Sentiment analysis, emotion detection, topic/trend detection, influencer detection, community detection, network graphs, alerts, a chatbot, multilingual support — these exist in every commercial social-listening tool (Brandwatch, Sprinklr, etc.). We build them as the **substrate**, not the pitch.

## 4. The differentiator: Narrative Intelligence

A narrative is not a topic. It's a topic + framing + sentiment + emotion + communities + influencers + propagation + timeline, tracked **as a living object** that is born, grows, mutates, migrates, and can go dormant and resurrect.

**Core product question:** *What is happening online, why is it happening, how is it spreading, how is the narrative changing, and what could happen next?*

## 5. Target audience for the demo

- SIH evaluators (technical + product judges) — need to see depth (evidence, not black-box claims) and originality (narrative layer, not just a dashboard) within ~5 minutes.
- A hypothetical NTRO-style analyst — the persona the UI is designed for: someone who needs to explain *why* something is trending, with evidence, quickly.

## 6. MVP Scope

### 6.1 Official PS requirements — MVP coverage

| Requirement | MVP treatment |
|---|---|
| Multi-platform ingestion | Replay Mode over synthetic X + Telegram dataset, clearly labeled "Historical Dataset Replay Mode" |
| Timestamped historical data | Every event carries a timestamp; replay plays them back chronologically |
| Sentiment/emotion inference | Positive/neutral/negative + emotion tags (anger, anxiety, frustration, fear, support…), computed per post |
| Aggregate demographic profiling | Static/mocked aggregate breakdown (age bracket %, language %) shown with a confidence caveat — **no individual profiling** |
| Trend/topic detection | Deterministic trend score (volume growth, velocity, acceleration, sentiment shift) |
| Link/network analysis | Graph built from reply/mention/reshare relationships in the dataset; influence score, communities |
| Influence identification | Degree + simple centrality-based ranking, not follower count |
| Propagation analysis | Timeline view of which community/platform picked up the narrative and when |

### 6.2 Innovation layer — MVP coverage (Tier 1, from master context §23)

1. **Narrative Lifecycle** — SEED → EMERGING → EXPANDING → VIRAL → SATURATION → DECLINING → DORMANT, computed from trend score + velocity thresholds.
2. **Narrative Mutation Detection** — compares early-window vs. late-window dominant framing/keywords for the same narrative and flags a shift (e.g. "delay" → "system failure").
3. **Attention Migration** — tracks % share of posts per platform over time and flags a migration when the dominant platform changes.
4. **Weak Signal Early Warning** — flags small but accelerating clusters (e.g. 10→20→30 posts) with a confidence score, before they're "big."

**Deferred to stretch/post-demo if time allows:** Narrative Memory (historical similarity), Narrative Bridge Detection. Everything else in the master doc's Tier 2/3 is explicitly out of scope for this build.

### 6.3 Explicitly out of scope for MVP

Mobile app, live API integrations, Spring Boot/Postgres/OpenSearch/Kafka infra, real user accounts/auth beyond a basic login, 20+ language support, individual-level profiling, face recognition, What-If simulation, Narrative Collision, Event correlation, Polarization Radar, Conversation Drop Intelligence, production-scale anything.

## 7. Screens & Features (user-facing)

### Screen 1 — Executive Intelligence
Top-line cards: active narratives, emerging trends, critical alerts, posts analyzed. Live trend leaderboard.

### Screen 2 — Trend Intelligence
Per-topic: trend score with the 6-factor breakdown, volume/velocity/acceleration timeline, sentiment mini-chart, forecast line, evidence count.

### Screen 3 — Narrative Intelligence ("Why is this trending?") — **hero screen**
Origin time, origin community, amplifiers, propagation path, sentiment shift, mutation callout ("delay" → "system failure"), current lifecycle stage, confidence + evidence list. This is the screen the demo video centers on.

### Screen 4 — Network Graph
Interactive graph (node size = influence, color = community, edges = relationship type). Time scrubber to replay propagation.

### Screen 5 — Sentiment & Emotion
Sentiment timeline, emotion distribution, sentiment by community/language.

### Screen 6 — Audience Intelligence (stretch)
Aggregate age/language/geography bars with confidence bands. No individual data shown.

### Screen 7 — AI Analyst
Suggested-prompt chat grounded in the evidence for the selected trend/narrative (not a general chatbot). Every answer shows its evidence (post count, communities, amplifiers, confidence).

## 8. Data & AI approach (product-level, see TRD for technical detail)

- **Replay Mode only** for MVP — a synthetic ~30–60 event dataset modeled on the master context's transit-delay example, played back on a timer so the dashboard visibly evolves during the demo.
- Deterministic scoring (trend score, lifecycle stage, mutation flag) is computed in code, **not** by an LLM.
- An LLM (via a temporary NVIDIA API key) is used only to (a) turn structured evidence into natural-language explanations, and (b) power the AI Analyst chat — always fed a structured evidence payload, never raw uncurated data, and always required to show confidence + evidence.

## 9. Success criteria for this build

- [ ] Replay runs end-to-end without manual DB/data manipulation
- [ ] Trend score visibly rises during replay and triggers an alert
- [ ] At least one narrative reaches VIRAL and shows a detected mutation
- [ ] Network graph renders and grows during replay
- [ ] "Why is this trending?" screen tells a coherent evidence-backed story
- [ ] AI Analyst answers at least the suggested prompts with evidence attached
- [ ] The whole flow fits inside a 4–5 minute video

## 10. Demo video narrative (condensed from master context §60)

0:00 Hook → dashboard looks normal, then an acceleration alert fires.
0:30 Data arriving from X + Telegram (replay, clearly labeled).
1:00 Trend score climbs, alert triggers.
1:30 Topic identified.
2:00 Sentiment shifts negative.
2:30 Network graph grows, a bridge account appears.
3:00 Propagation path animates across communities → platforms.
3:30 "Why is this trending?" — the money screen.
4:15 (if time) AI Analyst answers a follow-up question with evidence.
4:45 Closing line: *"TRAJECT doesn't just tell you what people are saying. It tells you what is emerging, how the narrative is changing, where it is moving, who is connecting it, and what could happen next."*

## 11. Key risks (product-level)

| Risk | Mitigation |
|---|---|
| Judges assume it's "just another dashboard" | Lead every explanation with the narrative-lifecycle/mutation framing, not sentiment/trend numbers |
| AI Analyst looks like a generic chatbot | Restrict prompts to suggested, evidence-grounded questions only |
| Overclaiming live data access | Replay Mode labeled explicitly on-screen at all times |
| Running out of build time | Tier-1 innovations only; Tier 2/3 cut without hesitation if Day 5 checkpoint is behind |

## 12. Non-goals

This is not a general-purpose social-listening SaaS, not a production system, and not a forecasting/prediction engine — scenario simulation and causal claims are explicitly out of scope; TRAJECT reports correlation and confidence, never certainty.
