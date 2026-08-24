# TRAJECT — Design System (Final)
### Companion to PRD + TRD · governs the frontend build (Days 2–5) · web app, desktop-first, responsive down to tablet/mobile

---

## 0. Thesis

TRAJECT is not a dashboard. It's a **signal-intelligence console** — the product an analyst opens when they need to know why something is moving before anyone else notices.

The subject we're designing *from* is the seismograph / spectrogram: an instrument that draws a live line, and the line itself *is* the story — flat, then twitching, then spiking, then a mutation mark on the trace. Magenta is the ink of that instrument, not a brand color splashed on for flair. It encodes intensity. It never decorates.

Built as a web app (React/Vite per TRD §3) — desktop is the primary surface for the demo, but the system holds up down to tablet width; see §11 for the responsive floor.

---

## 1. What we're deliberately not doing

| Default | Why it's tempting | Why we're refusing it |
|---|---|---|
| Cream background + high-contrast serif + terracotta accent | Reads "premium," fast to build | Warm/editorial ≠ an intelligence tool; terracotta is a well-known AI-generated tell |
| Near-black + one bright neon accent (acid green / cyan / vermilion) | Reads "technical," fast to build | Swapping the accent to magenta and stopping there is the *same* template with a new hex code. Magenta needs to do real work — a functional ramp tied to narrative lifecycle, not a single decorative highlight — and the base is an ink-plum, not true black |
| Broadsheet hairlines, zero radius, dense newspaper columns | Reads "serious/editorial" | We want instrument-panel, not newsroom |
| Rainbow categorical palette for charts/graph nodes | Recharts/React Flow ship this for free | Every color here means something specific (§2). Nothing is assigned by index |
| Glow effects, scanlines, gradient blobs, glassmorphism | Reads "AI/cyber," fast to fake depth | The most common tell of AI-generated "intelligence dashboard" UI. None of it appears anywhere in this system |

---

## 2. Color system

Base is **ink-plum**, not black — a near-black with a violet undertone, so the whole UI feels lit by the same magenta instrument rather than sitting on a neutral grey/black shell.

### 2.1 Structure

| Token | Hex | Use |
|---|---|---|
| `--ink-base` | `#150F18` | App background |
| `--ink-surface` | `#1F1722` | Panels, sidebar, top bar |
| `--ink-raised` | `#271D2B` | Cards, modals |
| `--ink-border` | `#3A2C3F` | Hairline dividers, card borders |
| `--bone` | `#F4EBF1` | Primary text (warm off-white, faint magenta cast — never pure `#FFF`) |
| `--mauve-400` | `#B7A2B8` | Secondary text |
| `--mauve-600` | `#7C6B7E` | Tertiary text, placeholders, timestamps |

### 2.2 The lifecycle ramp — the actual palette

Every narrative moves through **SEED → EMERGING → EXPANDING → VIRAL → SATURATION → DECLINING → DORMANT** (TRD §8). Instead of one accent color, the seven stages get a real intensity ramp — rising to a hot peak at VIRAL, cooling back toward ink at DORMANT. **The color of a badge tells you where in the lifecycle you are, before you read the label.**

| Stage | Token | Hex | Character |
|---|---|---|---|
| SEED | `--stage-seed` | `#8C6B84` | Faint, barely differentiated from mauve |
| EMERGING | `--stage-emerging` | `#B4508A` | Warming, gaining saturation |
| EXPANDING | `--stage-expanding` | `#D42E82` | Core magenta — the "instrument ink" color |
| VIRAL | `--stage-viral` | `#FF3D97` | Hottest, most saturated — reserved for this state and critical alerts |
| SATURATION | `--stage-saturation` | `#A61E6B` | Denser, heavier violet-magenta — plateau, not a peak |
| DECLINING | `--stage-declining` | `#6B4A63` | Fading back toward ink |
| DORMANT | `--stage-dormant` | `#3A2E39` | Nearly swallowed by the background — a ghost trace, may resurrect |

Use this ramp for: lifecycle badges, the Pulse Rail (§5), trend-score chart fills, narrative-card left borders. Never for anything that isn't actually about lifecycle stage.

### 2.3 Two deliberate outsiders

| Token | Hex | Meaning | Why it's justified |
|---|---|---|---|
| `--evidence-gold` | `#E3A542` | Evidence, confidence %, citations, focus rings, mutation arrows, bridge-account rings | Evidence is the opposite of a signal spike — it's the receipt. A different temperature (warm gold vs. hot magenta) makes evidence legible as "the proof" everywhere it appears |
| `--calm-teal` | `#5FA8A0` | Positive sentiment only | Negative/agitated emotion stays in the hot magenta family (anger, anxiety are "hot"), neutral is mauve, positive is the one place we go cool. Color temperature maps to emotional temperature. Appears nowhere else — not lifecycle, not evidence, not platform coding |

### 2.4 Platform + community coding (Network Graph, Screen 4)

| Platform | Treatment |
|---|---|
| X | Bone-white node ring, solid edge stroke |
| Telegram | Muted slate-blue `#4A7FA6` node ring, dashed edge stroke |

Communities (Louvain clusters): 5-swatch magenta-plum-gold family — `#D42E82`, `#A61E6B`, `#8C6B84`, `#E3A542`, `#6B4A63` — never a default rainbow. Bridge accounts (Tier 2 stretch) get a thin gold ring over their community color, consistent with §2.3.

---

## 3. Type system

Two roles pull in different directions on purpose, because the product does: **narrative** (a story, told in evidence-backed prose) and **intelligence** (a readout, in numbers and timestamps).

| Role | Face | Where |
|---|---|---|
| Display / narrative voice | **Fraunces** (variable, weight 600–900) | Hero screen headline, "Why is this trending?" title, lifecycle stage name when shown large, closing line of the demo |
| Data / instrument readout | **IBM Plex Mono** (tabular figures) | Trend scores, timestamps, evidence post-IDs, confidence %, Pulse Rail labels, chart axis labels |
| UI / body | **Public Sans** | Nav, buttons, body copy, chat messages, form fields |

```
display-xl   3.5rem  / Fraunces 700   — hero title only
display-lg   2.25rem / Fraunces 600   — screen titles
data-lg      1.5rem  / Plex Mono 500  — trend score, tabular-nums
data-md      1.0rem  / Plex Mono 500  — inline metrics
body-md      1.0rem  / Public Sans 400
body-sm      0.875rem/ Public Sans 400
label-xs     0.75rem / Plex Mono 600, uppercase, tracking-wide — stage badges, section eyebrows
```

Fraunces is used **only** for genuinely narrative moments — headlines, the closing line — never buttons, badges, or body copy. If Fraunces shows up on a nav item, that's the signal something drifted toward "serif = premium brand" instead of "serif = this is a story."

---

## 4. Layout concept

Not a grid of equal cards. The shell is asymmetric: a narrow persistent rail on the left carries the signature element (§5), main content is a single dominant panel with supporting panels docked around it, sized by importance rather than a uniform grid.

```
┌──┬──────────────────────────────────────────────────┐
│  │  TRAJECT     REPLAY MODE — HISTORICAL DATASET      │  ← always-on label
│P ├──────────────────────────────────────────────────┤
│U │                                                    │
│L │        DOMINANT PANEL                              │
│S │   (hero content for this screen —                  │
│E │    e.g. "Why is this trending?" story on           │
│  │    Screen 3, network graph on Screen 4)             │
│R │                                                    │
│A │                                                    │
│I ├───────────────────┬──────────────────┬────────────┤
│L │  supporting panel │  supporting panel│  evidence   │
│  │                    │                  │  strip      │
└──┴───────────────────┴──────────────────┴────────────┘
  72px            fluid, weighted toward the dominant panel
```

Per-screen notes:

- **Executive (1)**: dominant panel = live trend leaderboard (a ranked list, not four equal KPI cards — rank *is* the information).
- **Trend (2)**: dominant panel = the 6-factor trend-score breakdown as a single stacked instrument reading, not six mini-cards.
- **Narrative (3, hero)**: dominant panel = origin → mutation → current timeline, read top to bottom like a case file, evidence strip always visible at the bottom, never scrolled out of view.
- **Network (4)**: dominant panel = the graph itself, full-bleed; time scrubber lives at the bottom edge, echoing the Pulse Rail's own scrub behavior.
- **AI Analyst (7)**: dominant panel = the answer + its evidence; chat input is secondary and small — this screen should never look like a generic chat window first.

---

## 5. Signature element — The Pulse Rail

The one bold, memorable thing. Everything else stays quiet around it.

A 72px vertical strip, present on every screen, that **is** a live seismograph of the currently-focused narrative's trend score:

- A thin ink-base track runs the full height; the trend-score history draws as a magenta line against it, colored per-segment using the lifecycle ramp (§2.2) — scrolling your eye down the rail literally shows the narrative's life story in color.
- `narrative_events` (lifecycle transitions, mutations, migrations — TRD §8) appear as small ticks on the rail. A mutation tick gets a thin gold ring (evidence-gold — "here's proof something changed").
- Screen navigation is embedded *in* the rail as five small labeled notches (Executive / Trend / Narrative / Network / AI Analyst) rather than a separate top nav bar — navigation is part of the instrument, not bolted on next to it.
- The rail doubles as the time scrubber: dragging it moves the replay window for the whole screen, extending the Network Graph's scrubber (TRD §12) into a system-wide behavior instead of a one-off widget.

**Implementation note:** render as SVG (`<path>` for the trace, `<circle>` for event ticks), driven by the same trend-score history array already fetched for the Trend Intelligence chart — don't build a second data path for it.

---

## 6. Motion

Motion reads as **instrument behavior**, not decoration. Framer Motion is in the stack (TRD §3) — use it for exactly these, and nothing else:

| Moment | Motion | Duration |
|---|---|---|
| Replay tick arrives | Pulse Rail extends by one segment | matches `REPLAY_TICK_SECONDS` (2–3s), spring, no bounce |
| Lifecycle transition | Color sweep along the new rail segment + one soft 400ms glow on the stage badge | 400ms, once |
| Mutation detected | Rail tick flares gold-ringed magenta and settles; mutation callout card border draws itself once | 600ms, once |
| Attention migration | Dotted path between platform icons draws left→right | 800ms, once, no loop |

**Explicitly do not add:** floating gradient blobs, parallax on scroll, infinite pulsing glows/breathing cards, confetti, cursor-follow effects. If a component is animating and nothing in the data actually changed, cut it.

---

## 7. Component patterns

- **Lifecycle badge**: small pill, `background: var(--stage-*)`, text in `--ink-base` (dark-on-bright, since ramp colors are mid-to-high saturation), label in `label-xs` (Plex Mono, uppercase, tracked).
- **Evidence citation**: inline tag, transparent background, 1px `--evidence-gold` hairline border, gold text, Plex Mono — e.g. `[P09, P12, P18] · 89% confidence`. This exact pattern appears everywhere an AI-generated claim is shown (TRD §13 — every claim needs confidence + evidence attached).
- **Alert card**: 3px left border in `--stage-viral`, background `--ink-raised`. No red. This isn't a system error, it's a signal crossing threshold.
- **Narrative card**: left border colored by current lifecycle stage; border color is the *only* way stage is shown at a glance, badge confirms it in text for anyone who can't rely on color.
- **Mutation callout**: "delay" → "system failure" style before/after framing, two Plex Mono chips joined by a gold arrow — the arrow is evidence-gold, not magenta, because the *fact of the change* is the evidence.

---

## 8. Chart + graph specifics (Recharts / React Flow)

- Trend-score area chart: gradient fill from `--ink-base` at 0 to whichever lifecycle color the score currently corresponds to at the top — reads as a heat trace, not a generic blue area chart.
- Sentiment chart: exactly three colors — `--stage-viral`-family hot magenta for negative, `--mauve-400` for neutral, `--calm-teal` for positive. Never the red/amber/green traffic-light default.
- Network graph nodes: radius = influence score, fill = community swatch (§2.4), ring = platform, gold ring overlay = bridge account. No default React Flow rainbow.
- Axis labels, tick marks, timestamps: always Plex Mono, always `--mauve-600` unless actively highlighted.

---

## 9. Voice

Users are analysts, not consumers — copy reads like a briefing, not a marketing page.

- Declarative, evidence-first: *"Sentiment shifted 24% → 67% negative across 312 posts"* — not *"Whoa, sentiment is tanking!"*
- No causal language anywhere on screen — "coincided with," "preceded," "associated with," never "caused" (TRD §13, non-negotiable).
- Stage labels always uppercase Plex Mono — they read as *system state*, not marketing copy ("VIRAL" as a readout, never "Going Viral!!").
- No emoji, no exclamation points, no hype adjectives.
- Empty/loading states describe what the instrument is doing, not what the user should feel: *"Awaiting the next replay tick"* — not *"Nothing here yet!"*

---

## 10. Implementation handoff

```css
:root {
  --ink-base: #150F18;
  --ink-surface: #1F1722;
  --ink-raised: #271D2B;
  --ink-border: #3A2C3F;
  --bone: #F4EBF1;
  --mauve-400: #B7A2B8;
  --mauve-600: #7C6B7E;

  --stage-seed: #8C6B84;
  --stage-emerging: #B4508A;
  --stage-expanding: #D42E82;
  --stage-viral: #FF3D97;
  --stage-saturation: #A61E6B;
  --stage-declining: #6B4A63;
  --stage-dormant: #3A2E39;

  --evidence-gold: #E3A542;
  --calm-teal: #5FA8A0;

  --font-display: 'Fraunces', serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --font-body: 'Public Sans', sans-serif;
}
```

```js
// tailwind.config.js excerpt
theme: {
  extend: {
    colors: {
      ink: { base: '#150F18', surface: '#1F1722', raised: '#271D2B', border: '#3A2C3F' },
      bone: '#F4EBF1',
      mauve: { 400: '#B7A2B8', 600: '#7C6B7E' },
      stage: {
        seed: '#8C6B84', emerging: '#B4508A', expanding: '#D42E82',
        viral: '#FF3D97', saturation: '#A61E6B', declining: '#6B4A63',
        dormant: '#3A2E39',
      },
      evidence: '#E3A542',
      calm: '#5FA8A0',
    },
    fontFamily: {
      display: ['Fraunces', 'serif'],
      mono: ['"IBM Plex Mono"', 'monospace'],
      body: ['"Public Sans"', 'sans-serif'],
    },
  },
}
```

Fonts are all free on Google Fonts (Fraunces, IBM Plex Mono, Public Sans) — load via `@fontsource` packages or a Google Fonts `<link>`, no licensing blocker for the week.

---

## 11. Quality floor

- Focus rings use `--evidence-gold` at 2px, not magenta — magenta-on-ink doesn't hit reliable contrast for focus states at every stage tint, gold does, consistently.
- Lifecycle stage and sentiment are **never** color-only: stage badges always carry the text label, sentiment always pairs an icon with the hue.
- `prefers-reduced-motion`: Pulse Rail draws its full history instantly instead of animating tick-by-tick; sweep/flare/draw animations in §6 are skipped in favor of instant state changes.
- Responsive floor (web app, not mobile-first, but must not break): rail collapses to a 40px icon-only strip below 768px, nav notches become a bottom sheet; dominant-panel layout stacks single column. The demo itself will run on desktop — this is a safety net, not the primary design target.
- Contrast check: `--bone` on `--ink-base` and `--ink-surface` both clear AA for body text; stage-ramp colors are only used as backgrounds behind `--ink-base` text (dark-on-bright), never as text-on-ink below AA size.

---

## 12. One-paragraph summary for the demo script

If a judge asks "why magenta, why this look" in the 5-minute window: *"We didn't pick an accent color, we built an intensity scale — seven tones from a barely-there seed to a peak flare — and used it as the actual instrument the analyst reads. The rail on the left is a live trace of the story you're looking at, not a nav bar with a coat of paint on it."*
