# MLBB App — Plan 1: Foundation (Scaffold + Data Layer) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the single-file `mlbb-pro-guide.jsx` prototype into a runnable, modular Vite + React project whose UI reads all data from a single data-layer API backed by a bundled seed, with device-safe persistence.

**Architecture:** A Vite React app. All hardcoded constants move into `src/data/seed/` JS modules exposed through one `src/data/index.js` API (`getHeroes()`, `getItems()`, `getMeta()`, etc.). Pure helpers and the storage adapter become independently testable units. The 18 tab views are extracted from the monolith into `src/features/*` components that import from the data API and shared theme — no behavior change. This is Phases 1–2 of the spec; remote sync/scraper/Updates/Android are later plans.

**Tech Stack:** Vite, React 18, Vitest + @testing-library/react + jsdom, ESM JS (no TypeScript — match existing `.jsx`).

**Deliberate decision (documented):** The compact hero field keys (`n,r,r2,t,l,d,wr,pr,br,sp,c,s,b,e,sp2,tip,sy`) are KEPT as the data shape. They map 1:1 to what the scraper will later emit, keep the JSON payload small, and avoid risky rename-churn across 700 lines of UI. "Maintainability" here = splitting files, a documented schema (JSDoc typedef), a single data API, named helpers/selectors, and tests — NOT renaming every field. The schema typedef makes the compact keys self-documenting.

---

## File Structure

```
package.json                 (new)
vite.config.js               (new)
index.html                   (new)
src/
  main.jsx                   (new — React entry)
  App.jsx                    (ported app shell + tab router)
  theme/
    palette.js               (P, tc, rc, ri color/role helpers)
    styles.js                (the `s` style object factory)
  data/
    schema.js                (JSDoc typedefs + field-key documentation)
    index.js                 (data API: getHeroes/getItems/getMeta/...)
    seed/
      heroes.js              (RAW array + mapping → hero objects)
      items.js               (ITEMS)
      spells.js              (SPELLS)
      meta.js                (PATCH, BANS, RISING, FALLING, LANES, TEAMS)
      jungle.js              (JG_PATHS, JG_TIMERS, JG_TIPS)
      propicks.js            (PRO_PICKS, PRO_TIPS_DATA)
      glossary.js            (GLOSSARY)
      learn.js               (LEARN_PATH)
      emblems.js             (EMBLEM_SETS)
      roam.js                (ROAM_BOOTS, ROAM_ROTATION, ROAM_TIPS)
      macro.js               (PHASES, MACRO_CATS, ANTI_HEAL)
  services/
    storage.js               (storage adapter: get/set JSON, device-safe)
  features/                  (one file per tab view — extracted from monolith)
    meta/MetaView.jsx
    heroes/HeroesView.jsx
    tiers/TiersView.jsx
    items/ItemsView.jsx
    counter/CounterView.jsx
    teams/TeamsView.jsx
    spells/SpellsView.jsx
    jungle/JungleView.jsx
    roam/RoamView.jsx
    macro/MacroView.jsx
    compare/CompareView.jsx
    emblems/EmblemsView.jsx
    propicks/ProPicksView.jsx
    glossary/GlossaryView.jsx
    learn/LearnView.jsx
    mystats/MyStatsView.jsx
    build/BuildView.jsx
    draft/DraftView.jsx
  components/
    HeroDetail.jsx           (the `sel` modal/detail panel)
    HeroChip.jsx             (shared hero chip)
    SugBox.jsx               (autocomplete input used by Compare/Draft)
tests/
  storage.test.js
  data.test.js
  helpers.test.js
  draft.test.js
  app.smoke.test.jsx
```

**Source of truth for porting:** the original `mlbb-pro-guide.jsx` (preserved in repo). Port tasks cite exact line ranges to MOVE. Logic tasks include full code.

---

### Task 1: Scaffold the Vite + React project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`
- Create: `src/App.jsx` (temporary placeholder, replaced in Task 12)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "mlbb-pro-guide",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.1",
    "@vitejs/plugin-react": "^4.3.1",
    "jsdom": "^25.0.0",
    "vite": "^5.4.8",
    "vitest": "^2.1.2"
  }
}
```

- [ ] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.js"],
  },
});
```

- [ ] **Step 3: Create `tests/setup.js`**

```js
import "@testing-library/jest-dom";
```

- [ ] **Step 4: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>MLBB Pro Guide</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700;900&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;background:#060a13">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `src/main.jsx`**

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 6: Create temporary `src/App.jsx`**

```jsx
export default function App() {
  return <div style={{ color: "#fff", padding: 20 }}>MLBB scaffold OK</div>;
}
```

- [ ] **Step 7: Install and verify dev server boots**

Run: `npm install`
Then: `npm run build`
Expected: build completes with no errors; `dist/` produced.

- [ ] **Step 8: Commit**

```bash
git add package.json vite.config.js index.html src/main.jsx src/App.jsx tests/setup.js
git commit -m "chore: scaffold Vite + React project"
```

---

### Task 2: Extract theme (palette + styles)

The palette `P` and helpers `tc/rc/ri` are at `mlbb-pro-guide.jsx:181-184`. The big `s` style object starts at `mlbb-pro-guide.jsx:335` and continues until the `return(` of the component (read the source to find its closing `};` before the JSX `return`).

**Files:**
- Create: `src/theme/palette.js`
- Create: `src/theme/styles.js`

- [ ] **Step 1: Create `src/theme/palette.js`**

Copy the four definitions from `mlbb-pro-guide.jsx:181-184` and export them:

```js
export const P = { bg:"#060a13", bg2:"#0c1220", cd:"#111a2e", gold:"#f0b232", goldD:"#c8941a", neon:"#00e5ff", nG:"#39ff14", red:"#ff3b5c", blue:"#4d8bff", purp:"#a855f7", pink:"#f472b6", t1:"#eef2f8", t2:"#8899b3", t3:"#4a5873", brd:"#1a2540" };
export const tc = t => ({ "S+":"#ff4d6a", S:"#ffd036", A:"#5ddb6f", B:"#5da8e8", C:"#7a8599" }[t] || P.t3);
export const rc = r => ({ Tank:P.blue, Fighter:P.gold, Assassin:P.red, Mage:P.purp, Marksman:P.nG, Support:P.neon }[r] || P.t3);
export const ri = r => ({ Tank:"🛡️", Fighter:"⚔️", Assassin:"🗡️", Mage:"🔮", Marksman:"🏹", Support:"💚" }[r] || "❓");
export const ROLES = ["Tank","Fighter","Assassin","Mage","Marksman","Support"];
export const TIERS = ["S+","S","A","B","C"];
```

- [ ] **Step 2: Create `src/theme/styles.js`**

The `s` object in the source is built inside the component and references `P`. Move it out as a factory. Read the full `s = { ... };` block from the source (starts line 335), and wrap it:

```js
import { P } from "./palette.js";

// MOVE the entire object literal that the source assigns to `s` (starts at
// mlbb-pro-guide.jsx:335, ends at its matching `};` just before the component's
// `return(`). Paste it as the body below, unchanged.
export const s = {
  /* <-- paste the ported style object here, verbatim --> */
};
```

If any style entry is a function of P-only values it already works. If any entry referenced component state, leave it in the component (none should — verify while porting).

- [ ] **Step 3: Smoke-check imports compile**

Run: `npm run build`
Expected: build succeeds (these modules are not yet imported anywhere, but must parse).

- [ ] **Step 4: Commit**

```bash
git add src/theme/palette.js src/theme/styles.js
git commit -m "refactor: extract theme palette and styles into modules"
```

---

### Task 3: Storage adapter (TDD)

Replaces `window.storage` (Claude-artifact only). Must work in browser/device via `localStorage`, and degrade safely when storage is unavailable. (Capacitor Preferences is wired in a later plan; the interface stays the same.)

**Files:**
- Create: `src/services/storage.js`
- Test: `tests/storage.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect, beforeEach } from "vitest";
import { getJSON, setJSON } from "../src/services/storage.js";

describe("storage adapter", () => {
  beforeEach(() => localStorage.clear());

  it("returns fallback when key is missing", async () => {
    expect(await getJSON("missing", [])).toEqual([]);
  });

  it("round-trips a JSON value", async () => {
    await setJSON("k", [{ a: 1 }]);
    expect(await getJSON("k", null)).toEqual([{ a: 1 }]);
  });

  it("returns fallback on corrupt JSON", async () => {
    localStorage.setItem("bad", "{not json");
    expect(await getJSON("bad", "fb")).toBe("fb");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- storage`
Expected: FAIL — module/exports not found.

- [ ] **Step 3: Implement `src/services/storage.js`**

```js
// JSON-oriented storage adapter. Async signature so a native backend
// (Capacitor Preferences) can be swapped in later without touching callers.
function backend() {
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch (_) {}
  return null;
}

export async function getJSON(key, fallback = null) {
  const b = backend();
  if (!b) return fallback;
  try {
    const raw = b.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
}

export async function setJSON(key, value) {
  const b = backend();
  if (!b) return false;
  try {
    b.setItem(key, JSON.stringify(value));
    return true;
  } catch (_) {
    return false;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- storage`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/services/storage.js tests/storage.test.js
git commit -m "feat: device-safe JSON storage adapter with tests"
```

---

### Task 4: Seed data modules (move all constants)

Move every hardcoded constant out of the monolith into `src/data/seed/*`, each `export`ed. Cite source lines; MOVE verbatim, only adding `export` and importing `P` where a constant references palette colors (`LANES`, `PRO_PICKS`, `EMBLEM_SETS`, `LEARN_PATH`, `ROAM_*`, `MACRO_*` use `P.*`).

**Files (create each):**

- [ ] **Step 1: `src/data/seed/heroes.js`** — MOVE `RAW` (`mlbb-pro-guide.jsx:5-136`) and the `H` mapping (`:137`).

```js
// RAW: [name, role, role2, tier, lane, difficulty, winRate, pickRate, banRate,
//       specialty, counters, strongVs, build, emblem, spells, tip, synergies]
export const RAW = [ /* <-- paste lines 5..136 verbatim --> */ ];
export const HEROES = RAW.map(r => ({
  n:r[0], r:r[1], r2:r[2], t:r[3], l:r[4], d:r[5], wr:r[6], pr:r[7], br:r[8],
  sp:r[9], c:r[10], s:r[11], b:r[12], e:r[13], sp2:r[14], tip:r[15], sy:r[16]
}));
```

- [ ] **Step 2: `src/data/seed/items.js`** — MOVE `ITEMS` (`:141`). Prefix with `export const ITEMS =`.
- [ ] **Step 3: `src/data/seed/spells.js`** — MOVE `SPELLS` (`:144`). `export const SPELLS =`.
- [ ] **Step 4: `src/data/seed/meta.js`** — MOVE `PATCH` (`:147`), `BANS` (`:148`), `RISING` (`:149`), `FALLING` (`:150`), `LANES` (`:151`), `TEAMS` (`:152`). Add `import { P } from "../../theme/palette.js";` (LANES has no P refs but TEAMS none either — only add P import if a pasted line references `P.`; if none do, omit it). `export const` each.
- [ ] **Step 5: `src/data/seed/jungle.js`** — MOVE `JG_PATHS` (`:155-160`), `JG_TIMERS` (`:161-166`), `JG_TIPS` (`:167-178`). `export const` each.
- [ ] **Step 6: `src/data/seed/propicks.js`** — MOVE `PRO_PICKS` (`:189-195`), `PRO_TIPS_DATA` (`:196`). `export const` each.
- [ ] **Step 7: `src/data/seed/glossary.js`** — MOVE `GLOSSARY` (`:199-236`). `export const GLOSSARY =`.
- [ ] **Step 8: `src/data/seed/learn.js`** — MOVE `LEARN_PATH` (`:239-245`). Add `import { P } from "../../theme/palette.js";` (uses `P.nG`, `P.blue`, etc.). `export const LEARN_PATH =`.
- [ ] **Step 9: `src/data/seed/emblems.js`** — MOVE `EMBLEM_SETS` (`:248-273`). Add `import { P } from "../../theme/palette.js";` (uses `P.blue` etc.). `export const EMBLEM_SETS =`.
- [ ] **Step 10: `src/data/seed/roam.js`** — MOVE `ROAM_BOOTS` (`:276`), `ROAM_ROTATION` (`:277-283`), `ROAM_TIPS` (`:284`). `export const` each.
- [ ] **Step 11: `src/data/seed/macro.js`** — MOVE `PHASES` (`:287-291`), `MACRO_CATS` (`:292-297`), `ANTI_HEAL` (`:298-302`). `export const` each.

- [ ] **Step 12: Build to verify all seed modules parse**

Run: `npm run build`
Expected: success (modules parse; unused for now).

- [ ] **Step 13: Commit**

```bash
git add src/data/seed
git commit -m "refactor: move all hardcoded data into seed modules"
```

---

### Task 5: Data schema + data API (TDD)

One import surface for the whole UI. Documents the compact keys via JSDoc.

**Files:**
- Create: `src/data/schema.js`
- Create: `src/data/index.js`
- Test: `tests/data.test.js`

- [ ] **Step 1: Create `src/data/schema.js`**

```js
/**
 * @typedef {Object} Hero
 * @property {string} n   name
 * @property {string} r   primary role (Tank|Fighter|Assassin|Mage|Marksman|Support)
 * @property {string} r2  secondary role ("" if none)
 * @property {string} t   tier (S+|S|A|B|C)
 * @property {string} l   lane (EXP|Mid|Jungle|Gold|Roam)
 * @property {number} d   difficulty 1-3
 * @property {number} wr  win rate %
 * @property {number} pr  pick rate %
 * @property {number} br  ban rate %
 * @property {string} sp  specialty
 * @property {string[]} c counters (heroes that beat this hero)
 * @property {string[]} s strongVs (heroes this hero beats)
 * @property {string[]} b recommended build (item names)
 * @property {string} e   emblem set name
 * @property {string[]} sp2 battle spells
 * @property {string} tip short tip
 * @property {string[]} sy synergies
 */
export const SCHEMA_VERSION = 1;
```

- [ ] **Step 2: Write the failing test**

```js
import { describe, it, expect } from "vitest";
import { getHeroes, getHeroByName, getItems, getMeta, getSpells } from "../src/data/index.js";

describe("data API", () => {
  it("returns the full hero roster", () => {
    expect(getHeroes().length).toBeGreaterThanOrEqual(100);
  });
  it("finds a hero by name case-insensitively", () => {
    expect(getHeroByName("tigreal")?.n).toBe("Tigreal");
  });
  it("returns null for unknown hero", () => {
    expect(getHeroByName("nobody")).toBeNull();
  });
  it("exposes items keyed by category", () => {
    expect(Object.keys(getItems())).toContain("Attack");
  });
  it("exposes meta with patch info", () => {
    expect(getMeta().patch.v).toBeTruthy();
  });
  it("exposes spells", () => {
    expect(getSpells().length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- data`
Expected: FAIL — `src/data/index.js` missing.

- [ ] **Step 4: Implement `src/data/index.js`**

```js
import { HEROES } from "./seed/heroes.js";
import { ITEMS } from "./seed/items.js";
import { SPELLS } from "./seed/spells.js";
import { PATCH, BANS, RISING, FALLING, LANES, TEAMS } from "./seed/meta.js";
import { JG_PATHS, JG_TIMERS, JG_TIPS } from "./seed/jungle.js";
import { PRO_PICKS, PRO_TIPS_DATA } from "./seed/propicks.js";
import { GLOSSARY } from "./seed/glossary.js";
import { LEARN_PATH } from "./seed/learn.js";
import { EMBLEM_SETS } from "./seed/emblems.js";
import { ROAM_BOOTS, ROAM_ROTATION, ROAM_TIPS } from "./seed/roam.js";
import { PHASES, MACRO_CATS, ANTI_HEAL } from "./seed/macro.js";

export const getHeroes = () => HEROES;
export const getHeroByName = (name) => {
  if (!name) return null;
  const q = name.toLowerCase();
  return HEROES.find((h) => h.n.toLowerCase() === q) || null;
};
export const getItems = () => ITEMS;
export const getSpells = () => SPELLS;
export const getMeta = () => ({ patch: PATCH, bans: BANS, rising: RISING, falling: FALLING, lanes: LANES, teams: TEAMS });
export const getJungle = () => ({ paths: JG_PATHS, timers: JG_TIMERS, tips: JG_TIPS });
export const getProPicks = () => ({ picks: PRO_PICKS, tips: PRO_TIPS_DATA });
export const getGlossary = () => GLOSSARY;
export const getLearnPath = () => LEARN_PATH;
export const getEmblems = () => EMBLEM_SETS;
export const getRoam = () => ({ boots: ROAM_BOOTS, rotation: ROAM_ROTATION, tips: ROAM_TIPS });
export const getMacro = () => ({ phases: PHASES, cats: MACRO_CATS, antiHeal: ANTI_HEAL });
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- data`
Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add src/data/schema.js src/data/index.js tests/data.test.js
git commit -m "feat: data API and schema over seed modules with tests"
```

---

### Task 6: Pure helpers test (lock theme behavior)

**Files:**
- Test: `tests/helpers.test.js`

- [ ] **Step 1: Write the test**

```js
import { describe, it, expect } from "vitest";
import { tc, rc, ri, P } from "../src/theme/palette.js";

describe("theme helpers", () => {
  it("maps tiers to colors", () => {
    expect(tc("S+")).toBe("#ff4d6a");
    expect(tc("unknown")).toBe(P.t3);
  });
  it("maps roles to colors and icons", () => {
    expect(rc("Mage")).toBe(P.purp);
    expect(ri("Tank")).toBe("🛡️");
    expect(ri("???")).toBe("❓");
  });
});
```

- [ ] **Step 2: Run test**

Run: `npm test -- helpers`
Expected: PASS (2 tests).

- [ ] **Step 3: Commit**

```bash
git add tests/helpers.test.js
git commit -m "test: lock theme helper behavior"
```

---

### Task 7: Extract draft reducer logic (TDD)

The draft ban/pick state machine (`dSl`, `dR` at `mlbb-pro-guide.jsx:332-333`) is the only complex pure logic in the UI. Extract it so it's testable and the DraftView stays thin.

**Files:**
- Create: `src/features/draft/draftLogic.js`
- Test: `tests/draft.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from "vitest";
import { emptyDraft, selectHero } from "../src/features/draft/draftLogic.js";

describe("draft state machine", () => {
  it("starts in ban1 / team 1", () => {
    const d = emptyDraft();
    expect(d.phase).toBe("ban1");
    expect(d.turn).toBe(1);
    expect(d.t1.b).toEqual([]);
  });

  it("alternates teams during ban1 and transitions to pick1 after 6 bans", () => {
    let d = emptyDraft();
    const names = ["A","B","C","D","E","F"];
    names.forEach((n) => { d = selectHero(d, n); });
    expect(d.t1.b.length + d.t2.b.length).toBe(6);
    expect(d.phase).toBe("pick1");
    expect(d.turn).toBe(1);
  });

  it("reaches done after full ban/pick sequence (10 bans + 10 picks)", () => {
    let d = emptyDraft();
    for (let i = 0; i < 20; i++) d = selectHero(d, "H" + i);
    expect(d.phase).toBe("done");
    expect(d.t1.p.length + d.t2.p.length).toBe(10);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- draft`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement `src/features/draft/draftLogic.js`**

Port the logic from `dSl`/`dR` into pure functions (same transitions: ban1→pick1 at 6 bans, pick1→ban2 at 6 picks, ban2→pick2 at 10 bans, pick2→done at 10 picks):

```js
export const emptyDraft = () => ({
  t1: { b: [], p: [] },
  t2: { b: [], p: [] },
  phase: "ban1",   // ban1 | pick1 | ban2 | pick2 | done
  turn: 1,         // 1 = Blue, 2 = Red
});

export function selectHero(draft, name) {
  const t1 = { b: [...draft.t1.b], p: [...draft.t1.p] };
  const t2 = { b: [...draft.t2.b], p: [...draft.t2.p] };
  let { phase, turn } = draft;

  if (phase.startsWith("ban")) {
    (turn === 1 ? t1.b : t2.b).push(name);
    const totalBans = t1.b.length + t2.b.length;
    if (phase === "ban1" && totalBans >= 6) { phase = "pick1"; turn = 1; }
    else if (phase === "ban2" && totalBans >= 10) { phase = "pick2"; turn = 1; }
    else { turn = turn === 1 ? 2 : 1; }
  } else {
    (turn === 1 ? t1.p : t2.p).push(name);
    const totalPicks = t1.p.length + t2.p.length;
    if (phase === "pick1" && totalPicks >= 6) { phase = "ban2"; turn = 1; }
    else if (totalPicks >= 10) { phase = "done"; }
    else { turn = turn === 1 ? 2 : 1; }
  }
  return { t1, t2, phase, turn };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- draft`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/draft/draftLogic.js tests/draft.test.js
git commit -m "feat: extract draft state machine as pure testable logic"
```

---

### Task 8: Extract shared components

Pull the reusable pieces out of the monolith so feature views can import them.

**Files:**
- Create: `src/components/SugBox.jsx` (autocomplete; source `mlbb-pro-guide.jsx:379`)
- Create: `src/components/HeroDetail.jsx` (the `sel` detail panel; source around `:340-378` — read the block that renders when `sel` is set)
- Create: `src/components/HeroChip.jsx` (the repeated `s.ch(...)` hero chip rendered with `ri(h.r)` + name)

- [ ] **Step 1: Create `src/components/SugBox.jsx`**

Port the `SugBox` component (`mlbb-pro-guide.jsx:379`). Convert its closed-over deps to props/imports:

```jsx
import { s } from "../theme/styles.js";
import { P, ri } from "../theme/palette.js";
import { getHeroes } from "../data/index.js";

export function SugBox({ val, onPick, placeholder }) {
  const H = getHeroes();
  const sg = val.length < 1 ? [] : H.filter(h => h.n.toLowerCase().includes(val.toLowerCase())).slice(0, 6);
  const found = H.find(h => h.n.toLowerCase() === val.toLowerCase());
  return (
    <div style={{ position: "relative", flex: 1 }}>
      <input style={{ ...s.ip, marginBottom: 0 }} placeholder={placeholder} value={val} onChange={e => onPick(e.target.value)} />
      {val && !found && sg.length > 0 && (
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, background: P.cd, border: `1px solid ${P.brd}`, borderRadius: 8, zIndex: 10, maxHeight: 180, overflow: "auto" }}>
          {sg.map(h => (
            <div key={h.n} style={{ padding: "5px 10px", fontSize: 12, cursor: "pointer", borderBottom: `1px solid ${P.brd}` }} onClick={() => onPick(h.n)}>
              {ri(h.r)} {h.n}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/HeroDetail.jsx`**

Read the source block that renders the selected-hero detail (the JSX gated on `sel`, includes the `🤝 SYNERGIES` block at `:375`). Extract it into a component with this interface:

```jsx
// Props: { hero, onClose, onSelectHero }  — hero is a Hero object or null.
// onSelectHero(heroObj) lets chips inside the detail (counters/synergies) open another hero.
import { s } from "../theme/styles.js";
import { P, rc, ri } from "../theme/palette.js";
import { getHeroByName } from "../data/index.js";

export function HeroDetail({ hero, onClose, onSelectHero }) {
  if (!hero) return null;
  // <-- paste the ported `sel` detail JSX here; replace `sel` with `hero`,
  //     `setSel(null)` with `onClose()`, and `setSel(f)` with `onSelectHero(f)`.
  //     Use getHeroByName(name) where the source did H.find(z=>z.n===name).
}
```

- [ ] **Step 3: Create `src/components/HeroChip.jsx`**

```jsx
import { s } from "../theme/styles.js";
import { ri } from "../theme/palette.js";

// A clickable hero chip. color defaults to the chip's theme color.
export function HeroChip({ hero, color, onClick, suffix }) {
  return (
    <span style={s.ch(color)} onClick={onClick}>
      {ri(hero.r)} {hero.n}{suffix}
    </span>
  );
}
```

- [ ] **Step 4: Build to verify parse**

Run: `npm run build`
Expected: success.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "refactor: extract SugBox, HeroDetail, HeroChip shared components"
```

---

### Task 9: Extract the 18 feature views

Each tab's JSX is currently inline in `App` gated by `tab==="X"`. Extract each into `src/features/<x>/<X>View.jsx`. These are mechanical ports: MOVE the JSX, replace closed-over data refs with data-API imports, replace `setSel`/`sel` with props, and accept the local UI state the view needs as props from `App`.

**Standard view contract:** each view receives whatever it needs via props. Views that open a hero detail get `onSelectHero`. Views with their own filters/inputs (Heroes, Counter, Compare, Build, Draft, My Stats, Glossary) receive their state + setters as props (kept in `App` for now to minimize behavior change).

Do these one per step; build after each.

- [ ] **Step 1: `MetaView.jsx`** — MOVE the `tab==="Meta"` block (`mlbb-pro-guide.jsx:387-390`). Import `getMeta`, `tc/rc/ri`, `s`, `P`. Props: `{ onSelectHero }`. Use `getHeroByName` where source did `H.find`. Build.
- [ ] **Step 2: `HeroesView.jsx`** — MOVE the Heroes/grid block (the `flt` list rendering). Props: `{ q, setQ, rF, setRF, tF, setTF, onSelectHero }`. Compute the filtered list locally from `getHeroes()` using the existing filter logic from `:323`. Build.
- [ ] **Step 3: `TiersView.jsx`** — MOVE `tab==="Tiers"` (`:394`). Import `getHeroes`, `TIERS`, `tc/ri`. Props: `{ onSelectHero }`. Build.
- [ ] **Step 4: `ItemsView.jsx`** — MOVE the `tab==="Items"` block (item categories + the build-shop list at `:710`). For the plain Items browser, props: `{ iC, setIC }` using `getItems()`. (The build-cart list belongs to BuildView — keep only the item-reference rendering here.) Build.
- [ ] **Step 5: `CounterView.jsx`** — MOVE the Counter block (uses `cQ/setCQ`, `cH`, `cSg`). Props: `{ cQ, setCQ, onSelectHero }`. Compute `cH`/`cSg` locally from `getHeroes()/getHeroByName`. Build.
- [ ] **Step 6: `TeamsView.jsx`** — MOVE `tab==="Teams"` (`:401`). Import `getMeta().teams`, `rc/ri`. Props: `{ onSelectHero }`. Build.
- [ ] **Step 7: `SpellsView.jsx`** — MOVE the Spells block. Import `getSpells()`. No hero selection. Build.
- [ ] **Step 8: `JungleView.jsx`** — MOVE the Jungle block. Import `getJungle()`. Props: `{ onSelectHero }` (paths list heroes). Build.
- [ ] **Step 9: `RoamView.jsx`** — MOVE the Roam block. Import `getRoam()`. Build.
- [ ] **Step 10: `MacroView.jsx`** — MOVE the Macro block. Import `getMacro()`. Build.
- [ ] **Step 11: `CompareView.jsx`** — MOVE the Compare block (`:548` quick-pairs + comparison; uses `cmpA/cmpB`, `heroA/heroB`). Props: `{ cmpA, setCmpA, cmpB, setCmpB }`. Use `SugBox` + `getHeroByName`. Build.
- [ ] **Step 12: `EmblemsView.jsx`** — MOVE the Emblems block. Import `getEmblems()`. Build.
- [ ] **Step 13: `ProPicksView.jsx`** — MOVE `tab` Pro Picks block (`:414` heroes chips). Import `getProPicks()`. Props: `{ onSelectHero }`. Build.
- [ ] **Step 14: `GlossaryView.jsx`** — MOVE the Glossary block (uses `glsCat/setGlsCat`). Props: `{ glsCat, setGlsCat }`. Import `getGlossary()`. Build.
- [ ] **Step 15: `LearnView.jsx`** — MOVE the Learn block. Import `getLearnPath()`. Build.
- [ ] **Step 16: `MyStatsView.jsx`** — MOVE the My Stats / tracker block (`:651` add-entry; uses `tracker`, `tkHero`, `tkResult`). Props: `{ tracker, addEntry, tkHero, setTkHero, tkResult, setTkResult }`. Use `getHeroByName` for validation. Build.
- [ ] **Step 17: `BuildView.jsx`** — MOVE the Build block (`:704` saved-build load, `:710` item cart). Props: `{ bS, setBS, bC, setBC, savedBuilds, saveBuilds, buildName, setBuildName }`. Compute `bG` locally. Import `getItems()`. Build.
- [ ] **Step 18: `DraftView.jsx`** — MOVE the Draft block (`:712`, `:716`). Props: `{ draft, onSelect, onReset, dQ, setDQ }` where `draft`/`onSelect`/`onReset` come from `draftLogic`. Compute available heroes from `getHeroes()` minus drafted. Use `getHeroByName`, `rc/ri`. Build.

- [ ] **Step 19: Commit (after all 18 build cleanly)**

```bash
git add src/features
git commit -m "refactor: extract all 18 tab views into feature modules"
```

---

### Task 10: Rebuild `App.jsx` as a thin shell

Replace the placeholder `App.jsx` with a shell that owns shared state, wires storage, manages the draft via `draftLogic`, renders the tab bar (`TABS`), the active view, and the `HeroDetail` overlay.

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Write `src/App.jsx`**

```jsx
import { useState, useEffect, useMemo } from "react";
import { P } from "./theme/palette.js";
import { s } from "./theme/styles.js";
import { getJSON, setJSON } from "./services/storage.js";
import { emptyDraft, selectHero } from "./features/draft/draftLogic.js";
import { HeroDetail } from "./components/HeroDetail.jsx";

import { MetaView } from "./features/meta/MetaView.jsx";
import { HeroesView } from "./features/heroes/HeroesView.jsx";
import { TiersView } from "./features/tiers/TiersView.jsx";
import { ItemsView } from "./features/items/ItemsView.jsx";
import { CounterView } from "./features/counter/CounterView.jsx";
import { TeamsView } from "./features/teams/TeamsView.jsx";
import { SpellsView } from "./features/spells/SpellsView.jsx";
import { JungleView } from "./features/jungle/JungleView.jsx";
import { RoamView } from "./features/roam/RoamView.jsx";
import { MacroView } from "./features/macro/MacroView.jsx";
import { CompareView } from "./features/compare/CompareView.jsx";
import { EmblemsView } from "./features/emblems/EmblemsView.jsx";
import { ProPicksView } from "./features/propicks/ProPicksView.jsx";
import { GlossaryView } from "./features/glossary/GlossaryView.jsx";
import { LearnView } from "./features/learn/LearnView.jsx";
import { MyStatsView } from "./features/mystats/MyStatsView.jsx";
import { BuildView } from "./features/build/BuildView.jsx";
import { DraftView } from "./features/draft/DraftView.jsx";

const TABS = ["Meta","Heroes","Tiers","Items","Counter","Teams","Spells","Jungle","Roam","Macro","Compare","Emblems","Pro Picks","Glossary","Learn","My Stats","Build","Draft"];

export default function App() {
  const [tab, setTab] = useState("Meta");
  const [sel, setSel] = useState(null);
  // Heroes filters
  const [q, setQ] = useState(""); const [rF, setRF] = useState("All"); const [tF, setTF] = useState("All");
  // Counter / Compare
  const [cQ, setCQ] = useState(""); const [cmpA, setCmpA] = useState(""); const [cmpB, setCmpB] = useState("");
  // Items / Build
  const [iC, setIC] = useState("Attack");
  const [bS, setBS] = useState(Array(6).fill(null)); const [bC, setBC] = useState("Attack"); const [buildName, setBuildName] = useState("");
  // Glossary
  const [glsCat, setGlsCat] = useState("All");
  // Tracker + saved builds (persisted)
  const [tracker, setTracker] = useState([]); const [tkHero, setTkHero] = useState(""); const [tkResult, setTkResult] = useState("Win");
  const [savedBuilds, setSavedBuilds] = useState([]);
  // Draft
  const [draft, setDraft] = useState(emptyDraft()); const [dQ, setDQ] = useState("");

  useEffect(() => {
    (async () => {
      setTracker(await getJSON("mlbb-tracker", []));
      setSavedBuilds(await getJSON("mlbb-builds", []));
    })();
  }, []);

  const addEntry = (entry) => {
    const next = [entry, ...tracker];
    setTracker(next); setJSON("mlbb-tracker", next);
  };
  const saveBuilds = (next) => { setSavedBuilds(next); setJSON("mlbb-builds", next); };
  const onSelectHero = (h) => setSel(h);
  const onDraftSelect = (name) => setDraft((d) => selectHero(d, name));
  const onDraftReset = () => { setDraft(emptyDraft()); setDQ(""); };

  const view = useMemo(() => {
    switch (tab) {
      case "Meta": return <MetaView onSelectHero={onSelectHero} />;
      case "Heroes": return <HeroesView {...{ q, setQ, rF, setRF, tF, setTF, onSelectHero }} />;
      case "Tiers": return <TiersView onSelectHero={onSelectHero} />;
      case "Items": return <ItemsView {...{ iC, setIC }} />;
      case "Counter": return <CounterView {...{ cQ, setCQ, onSelectHero }} />;
      case "Teams": return <TeamsView onSelectHero={onSelectHero} />;
      case "Spells": return <SpellsView />;
      case "Jungle": return <JungleView onSelectHero={onSelectHero} />;
      case "Roam": return <RoamView />;
      case "Macro": return <MacroView />;
      case "Compare": return <CompareView {...{ cmpA, setCmpA, cmpB, setCmpB }} />;
      case "Emblems": return <EmblemsView />;
      case "Pro Picks": return <ProPicksView onSelectHero={onSelectHero} />;
      case "Glossary": return <GlossaryView {...{ glsCat, setGlsCat }} />;
      case "Learn": return <LearnView />;
      case "My Stats": return <MyStatsView {...{ tracker, addEntry, tkHero, setTkHero, tkResult, setTkResult }} />;
      case "Build": return <BuildView {...{ bS, setBS, bC, setBC, savedBuilds, saveBuilds, buildName, setBuildName }} />;
      case "Draft": return <DraftView {...{ draft, onSelect: onDraftSelect, onReset: onDraftReset, dQ, setDQ, onSelectHero }} />;
      default: return null;
    }
  }, [tab, q, rF, tF, cQ, cmpA, cmpB, iC, bS, bC, buildName, glsCat, tracker, tkHero, tkResult, savedBuilds, draft, dQ]);

  return (
    <div style={s.root}>
      <div style={{ display: "flex", overflowX: "auto", gap: 4, padding: 8, position: "sticky", top: 0, background: P.bg, zIndex: 5, borderBottom: `1px solid ${P.brd}` }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 8, border: `1px solid ${tab === t ? P.gold : P.brd}`, background: tab === t ? `${P.gold}22` : "transparent", color: tab === t ? P.gold : P.t2, fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ padding: 10, maxWidth: 520, margin: "0 auto" }}>{view}</div>
      <HeroDetail hero={sel} onClose={() => setSel(null)} onSelectHero={onSelectHero} />
    </div>
  );
}
```

> Note: the original used a different tab-bar style. If you want pixel-identical chrome, paste the original tab-bar/header JSX from the source instead of the simplified bar above; the contract (set `tab`) is unchanged. Reconcile `s.root` and any header styles during the port.

- [ ] **Step 2: Run the dev server and click through every tab**

Run: `npm run dev`
Expected: all 18 tabs render; hero chips open the detail panel; Draft progresses ban→pick→done; Build adds items and shows gold; My Stats adds a tracker entry.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "refactor: rebuild App as thin shell wiring views, storage, draft"
```

---

### Task 11: App smoke test + persistence test

**Files:**
- Test: `tests/app.smoke.test.jsx`

- [ ] **Step 1: Write the test**

```jsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App.jsx";

describe("App shell", () => {
  beforeEach(() => localStorage.clear());

  it("renders the default Meta tab and the tab bar", () => {
    render(<App />);
    expect(screen.getByText("Meta")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("switches tabs when a tab button is clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Glossary"));
    // Glossary content includes the term "Meta" definition; assert a known term renders.
    expect(screen.getByText(/Crowd Control/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test**

Run: `npm test -- app.smoke`
Expected: PASS (2 tests). If a view crashes, fix the port in that view before continuing.

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: ALL pass (storage, data, helpers, draft, app.smoke).

- [ ] **Step 4: Commit**

```bash
git add tests/app.smoke.test.jsx
git commit -m "test: app shell smoke + tab switching"
```

---

### Task 12: Retire the monolith

**Files:**
- Move: `mlbb-pro-guide.jsx` → `legacy/mlbb-pro-guide.jsx` (keep as porting reference, out of build)

- [ ] **Step 1: Move the original out of the source root**

```bash
mkdir -p legacy
git mv mlbb-pro-guide.jsx legacy/mlbb-pro-guide.jsx
```

- [ ] **Step 2: Verify build + tests still pass without it**

Run: `npm run build && npm test`
Expected: build succeeds; all tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: retire monolith to legacy/ after modular port"
```

---

## Self-Review

**Spec coverage (Phases 1–2):**
- Vite+React scaffold → Task 1 ✓
- Split monolith into modules → Tasks 2,4,8,9,10 ✓
- Storage adapter replacing `window.storage` → Task 3, wired in Task 10 ✓
- Data layer + schema + bundled seed; app reads from data layer not hardcoded array → Tasks 4,5,10 ✓
- Runs on web, no behavior change → Tasks 10,11 ✓
- Code cleanup / readable modules → whole plan ✓
- Persistence works (tracker/saved builds) → Task 3 + Task 10 `getJSON/setJSON` wiring ✓

Phases 3–6 (scraper, remote sync, diff/Updates, Android, push) are intentionally out of scope for this plan — covered by Plans 2–4.

**Placeholder scan:** UI port steps reference exact source line ranges to MOVE existing code (not invented placeholders). All logic-bearing units (storage, data API, draft logic, helpers) include complete code. The two "paste verbatim" spots (styles object in Task 2, HeroDetail JSX in Task 8) are explicit move-instructions with defined interfaces, not unfinished work.

**Type/name consistency:** Data API names (`getHeroes`, `getHeroByName`, `getItems`, `getMeta`, `getSpells`, `getJungle`, `getProPicks`, `getGlossary`, `getLearnPath`, `getEmblems`, `getRoam`, `getMacro`) are defined in Task 5 and used identically in Tasks 8–10. Draft API (`emptyDraft`, `selectHero`) defined in Task 7, used in Task 10. Storage API (`getJSON`, `setJSON`) defined in Task 3, used in Task 10. Hero field keys match the schema typedef in Task 5.
