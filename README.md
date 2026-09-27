# RailBlock AI — Frontend Prototype

### by Team IntegraX

**AI-Powered Automatic Block Planning to Maximize Asset Availability for Train
Operations on Indian Railways** — SIH 2026, Problem Statement **SIH26027**.

This is the **frontend only**, built to demo the full workflow — data
integration, AI prioritization, block optimization, and multi-department
coordination — on synthetic/demo data. No backend is included; the code is
structured so a FastAPI backend can be dropped in later without touching the
page layer (see "Connecting a real backend" below).

## Stack

- React 18 + Vite
- Tailwind CSS (custom railway-green palette in `tailwind.config.js`)
- Plotly.js via `react-plotly.js` for every chart, including the Gantt views
- React Router for the 10-page navigation
- Lucide React for icons

## Running it

You'll need [Node.js](https://nodejs.org) 18+ installed locally (this project
was built in a sandbox without internet access, so dependencies have **not**
been installed or the dev server tested — do that first on your machine):

```bash
cd railplan-ai
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build a static production bundle:

```bash
npm run build
npm run preview
```

## What's in each page

| Route | Page | What it shows |
|---|---|---|
| `/` | Dashboard | KPI cards, the data→AI→optimization workflow diagram, tasks-by-department donut, tasks-by-priority bar chart |
| `/maintenance` | Maintenance Tasks | Full searchable/filterable/sortable/paginated task table (248 mock tasks) |
| `/prioritization` | AI Prioritization | Same table sorted by AI score, score distribution histogram, click a row for the explainability drawer |
| `/block-planner` | Block Planner | Filters, available block windows, a Gantt of the raw schedule, a "Generate Optimized Plan" button that reveals the coordinated schedule + before/after KPIs |
| `/weekly-plan` | Weekly Plan | Mon–Sun Gantt across all sections, "Generate Weekly Plan" |
| `/monthly-plan` | Monthly Plan | Week 1–4 workload, block utilization, availability trend, department workload charts |
| `/corridor` | Corridor View | Clickable schematic corridor (Nanded → Parbhani) with per-section stats |
| `/what-if` | What-If Analysis | Sliders for block duration/traffic/task count/priority threshold/working hours, "Run Scenario" recomputes Scenario B against the fixed Scenario A baseline |
| `/reports` | Reports | Mock report cards (View / Export PDF / Export CSV — frontend-only actions) |
| `/system-data` | System Data | TMS / SMMS / TDMS / COA-BDMS connection status, record counts, last sync |

## How the mock data works

Everything under `src/data/` is generated once at import time by a **seeded
PRNG** (`src/utils/seededRandom.js`), so the numbers are stable across
reloads instead of re-randomizing every render — important for a demo where
you don't want the KPI cards to change between rehearsal and presentation.

- `maintenanceTasks.js` generates exactly 248 tasks (110 Engineering / 72
  S&T / 66 TRD) and scores each one with the weighted formula in
  `utils/priority.js` (Severity 30% / Safety Impact 25% / Overdue Days 20% /
  Traffic Density 15% / Asset Criticality 10%) — this is what powers the AI
  Explainability panel.
- `blockWindows.js` generates a raw (uncoordinated) weekly demand schedule,
  available supply-side block windows, and an optimized/coordinated schedule
  produced by a simple clustering heuristic in the same file. The headline
  KPIs (126 hrs → 94 hrs, 42 → 29 blocks, 14 → 2 conflicts) are pinned to
  match the SIH demo narrative in the brief; the Gantt charts underneath are
  illustrative synthetic detail.
- `sections.js`, `trains.js`, `systemSources.js` round out the reference
  data (corridor, timetable, source-system status).

Swap any of these for real API calls later without touching the pages —
they only import named values from `src/data/*`.

## Connecting a real backend later

The repo is deliberately structured so a FastAPI backend slots in cleanly:

1. Replace the contents of `src/data/*.js` with `fetch`/React Query calls to
   your FastAPI endpoints, keeping the same exported shape (e.g.
   `maintenanceTasks`, `blockWindows`, `sections`) so no page code changes.
2. Move `utils/priority.js` (scoring) and `utils/optimization.js`
   (clustering/scenario logic) to the backend — have the API return
   `priorityScore`/`priority` already computed, and call an
   `/optimize` endpoint from the "Generate Optimized Plan" / "Run Scenario"
   buttons instead of running the local heuristic.
3. `TaskDetailDrawer`'s explainability panel expects `{ contributions,
   summary }` shaped exactly like `explainTask()` returns — have the model
   endpoint return that same shape.

## What I'd extend first

1. **Real optimization engine integration.** The current "optimizer" is a
   deterministic clustering heuristic for the demo. Swapping in an actual
   OR-Tools/PuLP solver behind `/optimize` is the highest-value next step —
   the UI already expects async optimization (see the `generating` state in
   `BlockPlanner.jsx`).
2. **Auth + division scoping.** The division selector in the navbar is
   currently decorative. Wiring it to actually filter every page's data
   (and adding a login) is needed before this could be used by more than
   one division's controllers.
3. **Persisted plans.** "Generate Weekly Plan" / "Run Scenario" don't save
   anything — once a backend exists, persist generated plans so a user can
   come back and see what was published last week vs. this week's draft.
4. **Real block-window conflict detection** on the Block Planner table
   (currently `available` is a mock boolean) — cross-check against the
   Gantt in real time as filters change.
5. **Export that actually exports.** Reports page buttons currently just
   toast a confirmation; wiring `Export PDF`/`Export CSV` to a real
   generation endpoint (or client-side PDF lib) is a fast, high-visibility
   win for the SIH demo itself.

## Notes on the design brief

Every screen is deliberately labeled **"Prototype · Synthetic / Demo Data"**
per the brief — none of it claims a live connection to Indian Railways
systems. The AI model is represented purely as the **prioritization** step;
scheduling itself is framed as an **optimization engine**, consistent with
section 22 of the brief.
