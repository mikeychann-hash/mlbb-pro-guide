# MLBB App — Plan 2: Live Data Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`).

**Goal:** Make hero/patch data live: a Node scraper (run by a daily GitHub Action) publishes a validated `data.json`; the app fetches it, caches offline, falls back to the bundled seed, and shows "updated X ago" + refresh.

**Architecture:** The bundled seed (129 fully-detailed heroes) is the always-available base. A scraper pulls the live roster from the Fandom MediaWiki API (verified: 158 heroes), merges it onto the seed (new heroes flagged `pending`), validates, and writes `scraper/output/data.json`. The app loads bundled data instantly, then `dataSync` fetches remote + reads cache, keeps the newest by `generatedAt`, and exposes it through a React `DataProvider` / `useData()` hook. Views switch from importing `src/data/index.js` getters to destructuring the same-named getters from `useData()` — one-line change each.

**Tech Stack:** Node 24 (scraper, ESM, global fetch), GitHub Actions, React context.

**Confirmed reality:** Fandom MediaWiki API (`https://mobile-legends.fandom.com/api.php`) returns the full roster reliably. Win/pick/ban-rate aggregators have no stable free API, so stats + patch-notes sources are best-effort stubs that return null today (app uses seed stats); they're isolated so adding a real source later touches one file.

---

## File Structure

```
scraper/
  sources/fandom.js      (fetchRoster — real)
  sources/stats.js       (fetchStats — best-effort, returns null)
  sources/official.js    (fetchPatchNotes — best-effort, returns null)
  normalize.js           (buildDataset: merge seed + roster)
  validate.js            (validate: completeness checks)
  index.js               (orchestrator → output/data.json)
  output/data.json       (committed artifact)
.github/workflows/scrape.yml
src/
  data/
    bundled.js           (BUNDLED_DATA assembled from seed getters)
    dataset.js           (shape helpers shared by app + scraper-free)
    DataContext.jsx      (DataProvider + useData)
  services/dataSync.js   (DATA_URL, syncData: remote+cache+pick-newest)
src/features/**/*.jsx    (swap getter import → useData)
src/components/{SugBox,HeroDetail}.jsx (same swap)
src/App.jsx              (wrap in DataProvider; add updated/refresh bar)
tests/
  dataSync.test.js
  scraper.test.js
```

---

### Task 1: Bundled dataset assembly

**Files:** Create `src/data/dataset.js`, `src/data/bundled.js`. Test: extend `tests/data.test.js`.

- [ ] **Step 1: `src/data/dataset.js`** — pure shape constants/helpers.

```js
export const SCHEMA_VERSION = 1;

// Default field values for a hero that exists in the live roster but has no
// detailed seed entry yet (newly released). Keeps hero-detail pages safe.
export function pendingHero(name) {
  return {
    n: name, r: "Fighter", r2: "", t: "?", l: "—", d: 1,
    wr: 0, pr: 0, br: 0, sp: "Newly released — data pending",
    c: [], s: [], b: [], e: "—", sp2: [], tip: "Stats and build pending next data update.", sy: [],
    pending: true,
  };
}
```

- [ ] **Step 2: `src/data/bundled.js`** — assemble the full dataset object from existing seed getters.

```js
import { SCHEMA_VERSION } from "./dataset.js";
import {
  getHeroes, getItems, getSpells, getMeta, getJungle, getProPicks,
  getGlossary, getLearnPath, getEmblems, getRoam, getMacro,
} from "./index.js";

export function buildBundledData() {
  const meta = getMeta();
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: null,        // seed has no scrape timestamp
    source: "bundled",
    patch: meta.patch,
    heroes: getHeroes(),
    items: getItems(),
    spells: getSpells(),
    meta,
    jungle: getJungle(),
    propicks: getProPicks(),
    glossary: getGlossary(),
    learn: getLearnPath(),
    emblems: getEmblems(),
    roam: getRoam(),
    macro: getMacro(),
  };
}

export const BUNDLED_DATA = buildBundledData();
```

- [ ] **Step 3: Test** — append to `tests/data.test.js`:

```js
import { BUNDLED_DATA } from "../src/data/bundled.js";
describe("bundled dataset", () => {
  it("assembles a complete dataset object", () => {
    expect(BUNDLED_DATA.heroes.length).toBeGreaterThanOrEqual(100);
    expect(BUNDLED_DATA.patch.v).toBeTruthy();
    expect(BUNDLED_DATA.meta.bans.length).toBeGreaterThan(0);
    expect(BUNDLED_DATA.source).toBe("bundled");
  });
});
```

- [ ] **Step 4:** `npx vitest run data` → PASS. Commit `feat: assemble bundled dataset object from seed`.

---

### Task 2: Data sync service (TDD)

**Files:** Create `src/services/dataSync.js`. Test: `tests/dataSync.test.js`.

- [ ] **Step 1: Write failing test** `tests/dataSync.test.js`:

```js
import { describe, it, expect, beforeEach, vi } from "vitest";
import { pickNewest, syncData } from "../src/services/dataSync.js";
import { BUNDLED_DATA } from "../src/data/bundled.js";

describe("pickNewest", () => {
  it("prefers the dataset with the later generatedAt", () => {
    const a = { generatedAt: "2026-01-01T00:00:00Z", source: "a" };
    const b = { generatedAt: "2026-02-01T00:00:00Z", source: "b" };
    expect(pickNewest(a, b).source).toBe("b");
  });
  it("treats null generatedAt (bundled) as oldest", () => {
    const remote = { generatedAt: "2026-01-01T00:00:00Z", source: "remote" };
    expect(pickNewest(BUNDLED_DATA, remote).source).toBe("remote");
  });
  it("returns the only non-null candidate", () => {
    expect(pickNewest(BUNDLED_DATA, null).source).toBe("bundled");
  });
});

describe("syncData", () => {
  beforeEach(() => localStorage.clear());
  it("falls back to bundled when fetch fails and no cache", async () => {
    const res = await syncData({ fetchImpl: () => Promise.reject(new Error("offline")) });
    expect(res.data.source).toBe("bundled");
    expect(res.error).toBeTruthy();
  });
  it("uses and caches remote data when newer", async () => {
    const remote = { ...BUNDLED_DATA, generatedAt: "2030-01-01T00:00:00Z", source: "remote" };
    const fetchImpl = () => Promise.resolve({ ok: true, json: () => Promise.resolve(remote) });
    const res = await syncData({ fetchImpl });
    expect(res.data.source).toBe("remote");
    expect(JSON.parse(localStorage.getItem("mlbb-data")).source).toBe("remote");
  });
});
```

- [ ] **Step 2:** `npx vitest run dataSync` → FAIL (module missing).

- [ ] **Step 3: Implement `src/services/dataSync.js`:**

```js
import { BUNDLED_DATA } from "../data/bundled.js";
import { getJSON, setJSON } from "./storage.js";

// Where the daily GitHub Action publishes data.json. After pushing this repo to
// GitHub, replace USER/REPO with your slug (raw main branch). Until then, the
// fetch simply fails and the app uses cached/bundled data — by design.
export const DATA_URL =
  "https://raw.githubusercontent.com/USER/REPO/main/scraper/output/data.json";

const CACHE_KEY = "mlbb-data";

const ts = (d) => (d && d.generatedAt ? Date.parse(d.generatedAt) || 0 : 0);

export function pickNewest(a, b) {
  if (a && !b) return a;
  if (b && !a) return b;
  if (!a && !b) return BUNDLED_DATA;
  return ts(b) > ts(a) ? b : a;
}

export async function syncData({ fetchImpl = fetch, url = DATA_URL } = {}) {
  const cached = await getJSON(CACHE_KEY, null);
  let remote = null;
  let error = null;
  try {
    const r = await fetchImpl(url, { headers: { "Cache-Control": "no-cache" } });
    if (!r.ok) throw new Error("HTTP " + r.status);
    remote = await r.json();
  } catch (e) {
    error = e.message || String(e);
  }
  // newest of bundled / cached / remote
  let best = pickNewest(BUNDLED_DATA, cached);
  best = pickNewest(best, remote);
  if (remote && best === remote) await setJSON(CACHE_KEY, remote);
  return { data: best, error, updatedAt: best.generatedAt || null };
}
```

- [ ] **Step 4:** `npx vitest run dataSync` → PASS. Commit `feat: data sync service with offline cache + bundled fallback`.

---

### Task 3: DataProvider + useData

**Files:** Create `src/data/DataContext.jsx`. Modify `src/main.jsx` (wrap App).

- [ ] **Step 1: `src/data/DataContext.jsx`:**

```jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { BUNDLED_DATA } from "./bundled.js";
import { syncData } from "../services/dataSync.js";

const DataCtx = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(BUNDLED_DATA);
  const [status, setStatus] = useState("idle"); // idle | syncing | ok | error
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setStatus("syncing");
    const res = await syncData();
    setData(res.data);
    setError(res.error);
    setStatus(res.error && res.data.source === "bundled" ? "error" : "ok");
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Same-named getters as src/data/index.js, bound to the live dataset, so views
  // only swap their import + add one destructure line.
  const value = {
    data,
    status,
    error,
    lastUpdated: data.generatedAt || null,
    source: data.source,
    refresh,
    getHeroes: () => data.heroes,
    getHeroByName: (name) => {
      if (!name) return null;
      const q = name.toLowerCase();
      return data.heroes.find((h) => h.n.toLowerCase() === q) || null;
    },
    getItems: () => data.items,
    getSpells: () => data.spells,
    getMeta: () => data.meta,
    getJungle: () => data.jungle,
    getProPicks: () => data.propicks,
    getGlossary: () => data.glossary,
    getLearnPath: () => data.learn,
    getEmblems: () => data.emblems,
    getRoam: () => data.roam,
    getMacro: () => data.macro,
  };
  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

export function useData() {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
```

- [ ] **Step 2: Wrap App in `src/main.jsx`:**

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { DataProvider } from "./data/DataContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>
);
```

- [ ] **Step 3:** `npm run build` → success. Commit `feat: DataProvider + useData live-data context`.

---

### Task 4: Point views/components at useData

Mechanical: in each file below, remove the `import { getX } from ".../data/index.js"` line and instead `import { useData } from ".../data/DataContext.jsx"`, then inside the component add `const { getX, getHeroByName } = useData();` (only the getters that file used). Leave all call-sites unchanged. App.jsx also reads `meta`/`heroes` and gains the updated/refresh bar (Task 5).

- [ ] **Step 1:** Update components: `src/components/SugBox.jsx` (`getHeroes`), `src/components/HeroDetail.jsx` (`getHeroByName`).
- [ ] **Step 2:** Update views (getters each uses):
  - meta: `getMeta, getHeroByName`
  - heroes: `getHeroes`
  - tiers: `getHeroes`
  - items: `getItems`
  - counter: `getHeroes, getHeroByName`
  - teams: `getMeta, getHeroByName`
  - spells: `getSpells`
  - jungle: `getJungle, getHeroByName`
  - roam: `getRoam, getMacro`
  - macro: `getMacro`
  - compare: `getHeroByName` (SugBox already self-syncs)
  - emblems: `getEmblems`
  - propicks: `getProPicks, getHeroByName`
  - glossary: `getGlossary`
  - learn: `getLearnPath`
  - mystats: `getHeroes, getHeroByName`
  - build: `getItems`
  - draft: `getHeroes, getHeroByName`
- [ ] **Step 3:** `npm run build` → success; `npx vitest run` → all green (smoke test renders inside DataProvider — see Task 6 for wrapper).

> Note: CompareView/HeroesView/CounterView/DraftView call getters inside `useMemo`. Calling `useData()` at the top of the component and referencing `getHeroes` in the memo is fine; add `getHeroes`/the data to the memo deps where lint requires.

- [ ] **Step 4:** Commit `refactor: views consume live data via useData`.

---

### Task 5: "Last updated" + refresh bar in App

**Files:** Modify `src/App.jsx`.

- [ ] **Step 1:** Replace the static seed reads with `useData()` and add a status bar under the header.

```jsx
// near top of App():
const { getHeroes, getMeta, status, lastUpdated, source, refresh } = useData();
// ...
const PATCH = getMeta().patch;
const heroCount = getHeroes().length;

function agoLabel(iso) {
  if (!iso) return "bundled data";
  const diff = Date.now() - Date.parse(iso);
  if (Number.isNaN(diff)) return "bundled data";
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}
```

Render bar (place between `s.hdr` and `s.tbs`):

```jsx
<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "4px 8px", background: P.bg2, borderBottom: `1px solid ${P.brd}`, fontSize: 9, color: P.t3 }}>
  <span>{source === "bundled" ? "📦" : "🛰️"} Data: {agoLabel(lastUpdated)}</span>
  <button onClick={refresh} disabled={status === "syncing"} style={{ background: "transparent", border: `1px solid ${P.brd}`, borderRadius: 6, color: status === "syncing" ? P.t3 : P.neon, fontSize: 9, padding: "2px 8px", cursor: "pointer", fontFamily: "inherit" }}>
    {status === "syncing" ? "Syncing…" : "↻ Refresh"}
  </button>
</div>
```

- [ ] **Step 2:** `npm run build` → success. Commit `feat: data freshness bar with manual refresh`.

---

### Task 6: Fix smoke test to render within DataProvider

**Files:** Modify `tests/app.smoke.test.jsx`.

- [ ] **Step 1:** Wrap renders. Add helper at top:

```jsx
import { DataProvider } from "../src/data/DataContext.jsx";
const renderApp = () => render(<DataProvider><App /></DataProvider>);
```

Replace each `render(<App />)` with `renderApp()`. Stub global fetch to reject so sync falls back to bundled deterministically:

```jsx
import { vi, afterEach } from "vitest";
beforeEach(() => { localStorage.clear(); vi.stubGlobal("fetch", () => Promise.reject(new Error("offline"))); });
afterEach(() => { vi.unstubAllGlobals(); });
```

- [ ] **Step 2:** `npx vitest run` → all green. Commit `test: render app within DataProvider`.

---

### Task 7: Scraper — Fandom source (real)

**Files:** Create `scraper/sources/fandom.js`. Test: `tests/scraper.test.js` (logic only, no network).

- [ ] **Step 1: `scraper/sources/fandom.js`:**

```js
const API = "https://mobile-legends.fandom.com/api.php";
const UA = "MLBB-Guide-Scraper/1.0 (https://github.com/USER/REPO)";

// Returns array of hero names from Category:Heroes (paginated). Throws on failure.
export async function fetchRoster(fetchImpl = fetch) {
  const names = [];
  let cont = "";
  for (let i = 0; i < 6; i++) {
    const url = `${API}?action=query&list=categorymembers&cmtitle=Category:Heroes&cmlimit=500&cmtype=page&format=json${cont}`;
    const r = await fetchImpl(url, { headers: { "User-Agent": UA } });
    if (!r.ok) throw new Error("Fandom HTTP " + r.status);
    const j = await r.json();
    for (const m of j.query?.categorymembers || []) names.push(m.title);
    if (j.continue?.cmcontinue) cont = "&cmcontinue=" + encodeURIComponent(j.continue.cmcontinue);
    else break;
  }
  // Filter out non-hero meta pages defensively.
  return names.filter((n) => !/:/.test(n));
}
```

- [ ] **Step 2:** Commit `feat(scraper): Fandom roster source`.

---

### Task 8: Scraper — stats/official stubs

**Files:** Create `scraper/sources/stats.js`, `scraper/sources/official.js`.

- [ ] **Step 1: `scraper/sources/stats.js`:**

```js
// Win/pick/ban-rate scraping. No stable free API confirmed, so this is a
// best-effort stub returning null today; the app falls back to bundled seed
// stats. To enable: implement fetch+parse here and return a map keyed by hero
// name: { [name]: { wr, pr, br, tier } }. Isolated so failure can't break a run.
export async function fetchStats(_fetchImpl = fetch) {
  return null;
}
```

- [ ] **Step 2: `scraper/sources/official.js`:**

```js
// Official patch notes. Best-effort stub; returns null today. Implement to
// return [{ version, date, summary, changes: [{hero, type, text}] }].
export async function fetchPatchNotes(_fetchImpl = fetch) {
  return null;
}
```

- [ ] **Step 3:** Commit `feat(scraper): stats and patch-notes source stubs`.

---

### Task 9: Scraper — normalize + validate (TDD)

**Files:** Create `scraper/normalize.js`, `scraper/validate.js`. Test: `tests/scraper.test.js`.

- [ ] **Step 1: Write failing test `tests/scraper.test.js`:**

```js
import { describe, it, expect } from "vitest";
import { buildDataset } from "../scraper/normalize.js";
import { validate } from "../scraper/validate.js";
import { BUNDLED_DATA } from "../src/data/bundled.js";

const seedNames = BUNDLED_DATA.heroes.map((h) => h.n);

describe("buildDataset", () => {
  it("keeps all seed heroes and adds new roster heroes as pending", () => {
    const roster = [...seedNames, "BrandNewHero"];
    const ds = buildDataset({ roster, stats: null, patchNotes: null, now: "2030-01-01T00:00:00Z" });
    expect(ds.heroes.length).toBe(seedNames.length + 1);
    const nu = ds.heroes.find((h) => h.n === "BrandNewHero");
    expect(nu.pending).toBe(true);
    expect(ds.generatedAt).toBe("2030-01-01T00:00:00Z");
    expect(ds.source).toBe("scraped");
  });
  it("with null roster falls back to seed heroes only", () => {
    const ds = buildDataset({ roster: null, stats: null, patchNotes: null, now: "2030-01-01T00:00:00Z" });
    expect(ds.heroes.length).toBe(seedNames.length);
  });
});

describe("validate", () => {
  it("passes a complete dataset", () => {
    const ds = buildDataset({ roster: seedNames, stats: null, patchNotes: null, now: "2030-01-01T00:00:00Z" });
    expect(validate(ds).ok).toBe(true);
  });
  it("fails when too few heroes", () => {
    expect(validate({ heroes: [], patch: { v: "x" } }).ok).toBe(false);
  });
});
```

- [ ] **Step 2:** `npx vitest run scraper` → FAIL.

- [ ] **Step 3: `scraper/normalize.js`:**

```js
import { BUNDLED_DATA } from "../src/data/bundled.js";
import { pendingHero } from "../src/data/dataset.js";

// Merge live roster onto the rich seed. Seed heroes keep full detail; roster
// heroes not in the seed are added as `pending`. stats/patchNotes are applied
// when available (null today).
export function buildDataset({ roster, stats, patchNotes, now }) {
  const heroes = BUNDLED_DATA.heroes.map((h) => ({ ...h }));
  const have = new Set(heroes.map((h) => h.n.toLowerCase()));

  if (Array.isArray(roster)) {
    for (const name of roster) {
      if (!have.has(name.toLowerCase())) {
        heroes.push(pendingHero(name));
        have.add(name.toLowerCase());
      }
    }
  }

  if (stats) {
    for (const h of heroes) {
      const s = stats[h.n];
      if (s) {
        if (typeof s.wr === "number") h.wr = s.wr;
        if (typeof s.pr === "number") h.pr = s.pr;
        if (typeof s.br === "number") h.br = s.br;
        if (s.tier) h.t = s.tier;
        h.pending = false;
      }
    }
  }

  return {
    ...BUNDLED_DATA,
    source: "scraped",
    generatedAt: now,
    heroes,
    patchNotes: Array.isArray(patchNotes) ? patchNotes : [],
    rosterCount: heroes.length,
  };
}
```

- [ ] **Step 4: `scraper/validate.js`:**

```js
export function validate(ds) {
  const errors = [];
  if (!ds || !Array.isArray(ds.heroes)) errors.push("heroes missing");
  else {
    if (ds.heroes.length < 100) errors.push(`too few heroes: ${ds.heroes.length}`);
    if (ds.heroes.some((h) => !h.n)) errors.push("hero with no name");
    if (ds.heroes.some((h) => h.t == null)) errors.push("hero with null tier");
  }
  if (!ds || !ds.patch || !ds.patch.v) errors.push("patch version missing");
  return { ok: errors.length === 0, errors };
}
```

- [ ] **Step 5:** `npx vitest run scraper` → PASS. Commit `feat(scraper): normalize + validate with seed merge`.

---

### Task 10: Scraper orchestrator

**Files:** Create `scraper/index.js`, `scraper/output/.gitkeep`.

- [ ] **Step 1: `scraper/index.js`:**

```js
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fetchRoster } from "./sources/fandom.js";
import { fetchStats } from "./sources/stats.js";
import { fetchPatchNotes } from "./sources/official.js";
import { buildDataset } from "./normalize.js";
import { validate } from "./validate.js";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "output", "data.json");

async function safe(fn, label) {
  try { return await fn(); }
  catch (e) { console.warn(`[scrape] ${label} failed: ${e.message}`); return null; }
}

async function main() {
  const roster = await safe(() => fetchRoster(), "fandom roster");
  const stats = await safe(() => fetchStats(), "stats");
  const patchNotes = await safe(() => fetchPatchNotes(), "patch notes");

  const now = new Date().toISOString();
  const ds = buildDataset({ roster, stats, patchNotes, now });
  const { ok, errors } = validate(ds);
  if (!ok) {
    console.error("[scrape] validation failed:", errors.join("; "));
    process.exit(1); // keep previously committed data.json
  }
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(ds, null, 2) + "\n", "utf8");
  console.log(`[scrape] wrote ${ds.heroes.length} heroes (roster ${roster ? roster.length : "n/a"}) at ${now}`);
}

main();
```

- [ ] **Step 2:** Add npm script to `package.json`: `"scrape": "node scraper/index.js"`.
- [ ] **Step 3: Run it for real:** `npm run scrape`. Expected: writes `scraper/output/data.json` with ≥129 heroes (158 from Fandom). Verify file exists and `generatedAt` set.
- [ ] **Step 4:** Commit `feat(scraper): orchestrator writes validated data.json` (including the generated `output/data.json`).

---

### Task 11: GitHub Action — daily scrape

**Files:** Create `.github/workflows/scrape.yml`.

- [ ] **Step 1: `.github/workflows/scrape.yml`:**

```yaml
name: Scrape MLBB data
on:
  schedule:
    - cron: "17 5 * * *"   # daily 05:17 UTC
  workflow_dispatch: {}
permissions:
  contents: write
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run scrape
      - name: Commit updated data
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          if ! git diff --quiet -- scraper/output/data.json; then
            git add scraper/output/data.json
            git commit -m "data: daily scrape $(date -u +%FT%TZ)"
            git push
          else
            echo "No data changes."
          fi
```

- [ ] **Step 2:** Commit `ci: daily scrape workflow`.

---

## Self-Review

**Spec coverage (Phase 3):** scraper combining sources (Fandom real + stats/official isolated stubs) → Tasks 7–10; normalize+validate with last-good retention (exit 1 on invalid) → Tasks 9–10; daily GitHub Action publishing data.json → Task 11; app fetches remote, offline cache, bundled fallback, last-updated + refresh → Tasks 2–5. Multi-source resilience (one failing source can't break a run) → `safe()` wrapper in Task 10.

**Placeholder scan:** `USER/REPO` in `DATA_URL` and UA string are intentional config the user fills after creating the GitHub repo; both documented and fail safely (fetch error → bundled). stats/official stubs are deliberate, documented best-effort isolation, not unfinished logic.

**Type consistency:** dataset shape (`schemaVersion, generatedAt, source, patch, heroes, items, spells, meta, jungle, propicks, glossary, learn, emblems, roam, macro`) defined in `bundled.js`, reused by `normalize.js` (spreads BUNDLED_DATA) and consumed by `DataContext` getters (same getter names as `src/data/index.js`). `pickNewest`/`syncData` in `dataSync.js` used by `DataProvider`. `buildDataset`/`validate` shared by scraper + tests.
