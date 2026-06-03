# MLBB App — Plan 3: Updates Tab + Diff Engine + Badges

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans.

**Goal:** Surface what changed between data updates — a diff engine computes new heroes + buffs/nerfs, an "Updates" tab shows them with patch notes, and NEW/↑/↓ badges appear across Tiers/Heroes views.

**Architecture:** A pure `diffEngine` compares the previous "seen" hero snapshot (in storage) to the current dataset. `DataProvider` runs it after each sync, exposes a per-hero `changes` map + a `diff` summary + `getChange(name)`. A `Badge` component renders NEW/↑/↓. New `UpdatesView` consumes `diff` + `data.patchNotes`. First launch (no prior snapshot) establishes a baseline silently — diffs only show on real changes.

**Tech Stack:** React context, pure JS diff, existing storage adapter.

---

### Task 1: Diff engine (TDD)

**Files:** Create `src/services/diffEngine.js`. Test: `tests/diffEngine.test.js`.

- [ ] **Step 1: Test `tests/diffEngine.test.js`:**

```js
import { describe, it, expect } from "vitest";
import { computeDiff, buildChangeMap, TIER_ORDER } from "../src/services/diffEngine.js";

const H = (n, wr, t = "A", extra = {}) => ({ n, wr, t, ...extra });

describe("computeDiff", () => {
  it("detects new and removed heroes", () => {
    const prev = [H("A", 50), H("B", 50)];
    const curr = [H("A", 50), H("C", 50)];
    const d = computeDiff(prev, curr);
    expect(d.newHeroes).toEqual(["C"]);
    expect(d.removed).toEqual(["B"]);
  });
  it("detects buffs and nerfs by win rate", () => {
    const prev = [H("A", 50.0), H("B", 52.0)];
    const curr = [H("A", 51.0), H("B", 51.0)];
    const d = computeDiff(prev, curr);
    expect(d.buffed.map((x) => x.n)).toContain("A");
    expect(d.nerfed.map((x) => x.n)).toContain("B");
  });
  it("detects tier changes", () => {
    const prev = [H("A", 50, "B")];
    const curr = [H("A", 50, "S")];
    const d = computeDiff(prev, curr);
    expect(d.tierUp.map((x) => x.n)).toContain("A");
  });
  it("ignores tiny win-rate noise below threshold", () => {
    const prev = [H("A", 50.0)];
    const curr = [H("A", 50.1)];
    const d = computeDiff(prev, curr);
    expect(d.buffed).toEqual([]);
  });
});

describe("buildChangeMap", () => {
  it("marks new (pending) heroes and trends", () => {
    const prev = [H("A", 50.0)];
    const curr = [H("A", 51.0), H("Z", 0, "?", { pending: true })];
    const map = buildChangeMap(computeDiff(prev, curr), curr);
    expect(map.Z.isNew).toBe(true);
    expect(map.A.trend).toBe("up");
  });
});

describe("TIER_ORDER", () => {
  it("ranks S+ above C", () => {
    expect(TIER_ORDER["S+"]).toBeGreaterThan(TIER_ORDER["C"]);
  });
});
```

- [ ] **Step 2:** `npx vitest run diffEngine` → FAIL.

- [ ] **Step 3: `src/services/diffEngine.js`:**

```js
export const TIER_ORDER = { "S+": 5, S: 4, A: 3, B: 2, C: 1, "?": 0 };
const WR_THRESHOLD = 0.3;

export function computeDiff(prevHeroes, currHeroes) {
  const prev = new Map((prevHeroes || []).map((h) => [h.n, h]));
  const curr = new Map((currHeroes || []).map((h) => [h.n, h]));

  const newHeroes = [];
  const removed = [];
  const buffed = [];
  const nerfed = [];
  const tierUp = [];
  const tierDown = [];

  for (const [n, h] of curr) {
    const p = prev.get(n);
    if (!p) { newHeroes.push(n); continue; }
    const dwr = (h.wr || 0) - (p.wr || 0);
    if (dwr >= WR_THRESHOLD) buffed.push({ n, from: p.wr, to: h.wr });
    else if (dwr <= -WR_THRESHOLD) nerfed.push({ n, from: p.wr, to: h.wr });
    const dt = (TIER_ORDER[h.t] ?? 0) - (TIER_ORDER[p.t] ?? 0);
    if (dt > 0) tierUp.push({ n, from: p.t, to: h.t });
    else if (dt < 0) tierDown.push({ n, from: p.t, to: h.t });
  }
  for (const n of prev.keys()) if (!curr.has(n)) removed.push(n);

  return { newHeroes, removed, buffed, nerfed, tierUp, tierDown };
}

// name -> { isNew, trend: 'up'|'down'|null }
export function buildChangeMap(diff, currHeroes) {
  const map = {};
  for (const h of currHeroes || []) {
    if (h.pending) map[h.n] = { isNew: true, trend: null };
  }
  for (const n of diff.newHeroes) map[n] = { ...(map[n] || {}), isNew: true };
  for (const x of diff.buffed) map[x.n] = { ...(map[x.n] || {}), trend: "up" };
  for (const x of diff.tierUp) map[x.n] = { ...(map[x.n] || {}), trend: "up" };
  for (const x of diff.nerfed) if (!map[x.n]?.trend) map[x.n] = { ...(map[x.n] || {}), trend: "down" };
  for (const x of diff.tierDown) if (!map[x.n]?.trend) map[x.n] = { ...(map[x.n] || {}), trend: "down" };
  return map;
}
```

- [ ] **Step 4:** `npx vitest run diffEngine` → PASS. Commit `feat: hero diff engine (new/buff/nerf/tier) with tests`.

---

### Task 2: Integrate diff into DataProvider

**Files:** Modify `src/data/DataContext.jsx`.

- [ ] **Step 1:** Import diff + storage; after sync, diff vs stored snapshot and expose results.

Add imports:
```js
import { computeDiff, buildChangeMap } from "../services/diffEngine.js";
import { getJSON, setJSON } from "../services/storage.js";
```

Add state: `const [diff, setDiff] = useState(null); const [changes, setChanges] = useState({});`

In `refresh`, after `setData(res.data)`:
```js
    const seen = await getJSON("mlbb-seen", null);
    const currentHeroes = res.data.heroes;
    if (seen && seen.generatedAt !== res.data.generatedAt) {
      const d = computeDiff(seen.heroes, currentHeroes);
      setDiff(d);
      setChanges(buildChangeMap(d, currentHeroes));
    } else if (!seen) {
      // establish baseline silently; still flag pending heroes as new
      const d = computeDiff(currentHeroes, currentHeroes);
      setChanges(buildChangeMap(d, currentHeroes));
      setDiff(d);
    }
    await setJSON("mlbb-seen", { generatedAt: res.data.generatedAt, heroes: currentHeroes.map((h) => ({ n: h.n, wr: h.wr, t: h.t, pending: !!h.pending })) });
```

Add to context `value`: `diff, changes, getChange: (name) => changes[name] || null,`

- [ ] **Step 2:** `npm run build` → success. Commit `feat: compute hero diff on sync and expose via context`.

---

### Task 3: Badge component + Tiers/Heroes badges

**Files:** Create `src/components/Badge.jsx`. Modify `src/features/tiers/TiersView.jsx`, `src/features/heroes/HeroesView.jsx`.

- [ ] **Step 1: `src/components/Badge.jsx`:**

```jsx
import { P } from "../theme/palette.js";

// Renders NEW / ↑ / ↓ for a hero change record, or null.
export function Badge({ change }) {
  if (!change) return null;
  const items = [];
  if (change.isNew) items.push(["NEW", P.neon]);
  if (change.trend === "up") items.push(["↑", P.nG]);
  if (change.trend === "down") items.push(["↓", P.red]);
  if (!items.length) return null;
  return (
    <>
      {items.map(([t, c]) => (
        <span key={t} style={{ fontSize: 8, fontWeight: 900, color: c, marginLeft: 4, verticalAlign: "middle" }}>{t}</span>
      ))}
    </>
  );
}
```

- [ ] **Step 2: TiersView** — destructure `getChange` from `useData()` and render `<Badge change={getChange(h.n)} />` inside each hero chip (after the name). Import Badge.

- [ ] **Step 3: HeroesView** — same: add `getChange` and `<Badge change={getChange(h.n)} />` next to the hero name in each row.

- [ ] **Step 4:** `npm run build` → success. Commit `feat: NEW/up/down badges in Tiers and Heroes`.

---

### Task 4: Updates view + tab

**Files:** Create `src/features/updates/UpdatesView.jsx`. Modify `src/App.jsx` (add tab + route).

- [ ] **Step 1: `src/features/updates/UpdatesView.jsx`:**

```jsx
import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";

function agoLabel(iso) {
  if (!iso) return "bundled (no live sync yet)";
  const diff = Date.now() - Date.parse(iso);
  if (Number.isNaN(diff)) return "bundled";
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "less than an hour ago";
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

export function UpdatesView({ onSelectHero }) {
  const { data, diff, lastUpdated, source, status, error, refresh } = useData();
  const open = (n) => { const f = data.heroes.find((h) => h.n === n); if (f) onSelectHero(f); };
  const Section = ({ title, color, names, render }) => (
    names && names.length ? (
      <>
        <div style={s.sc}>{title} <span style={{ fontSize: 10, color: P.t3 }}>({names.length})</span></div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>{names.map(render)}</div>
      </>
    ) : null
  );
  return (
    <>
      <div style={{ background: `linear-gradient(135deg,${P.neon}0c,${P.gold}08)`, border: `1px solid ${P.neon}33`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: P.neon }}>🛰️ Updates</div>
        <div style={{ fontSize: 11, color: P.t2, marginTop: 4 }}>Patch {data.patch?.v} · Data {source === "bundled" ? "bundled" : "live"} · updated {agoLabel(lastUpdated)}</div>
        <button onClick={refresh} disabled={status === "syncing"} style={{ marginTop: 8, padding: "6px 14px", background: "transparent", border: `1px solid ${P.neon}55`, borderRadius: 8, color: P.neon, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{status === "syncing" ? "Syncing…" : "↻ Check for updates"}</button>
        {error && <div style={{ fontSize: 9, color: P.t3, marginTop: 6 }}>Offline or remote unavailable — showing last known data.</div>}
      </div>

      {(!diff || (!diff.newHeroes.length && !diff.buffed.length && !diff.nerfed.length && !diff.tierUp.length && !diff.tierDown.length)) && (
        <div style={{ textAlign: "center", padding: 24, color: P.t3 }}>
          <div style={{ fontSize: 34 }}>✅</div>
          <div style={{ fontSize: 13, marginTop: 8 }}>No changes since your last update.</div>
          <div style={{ fontSize: 10, marginTop: 4 }}>New heroes and buff/nerf changes will appear here after the next data sync.</div>
        </div>
      )}

      {diff && <>
        <Section title="🆕 New Heroes" names={diff.newHeroes} render={(n) => <span key={n} style={s.ch(P.neon)} onClick={() => open(n)}>{n}</span>} />
        <Section title="📈 Buffed (↑ win rate)" names={diff.buffed.map((x) => x.n)} render={(n) => <span key={n} style={s.ch(P.nG)} onClick={() => open(n)}>{n} ↑</span>} />
        <Section title="📉 Nerfed (↓ win rate)" names={diff.nerfed.map((x) => x.n)} render={(n) => <span key={n} style={s.ch(P.red)} onClick={() => open(n)}>{n} ↓</span>} />
        <Section title="⬆️ Tier Up" names={diff.tierUp.map((x) => `${x.n} ${x.from}→${x.to}`)} render={(n) => <span key={n} style={s.ch(P.gold)}>{n}</span>} />
        <Section title="⬇️ Tier Down" names={diff.tierDown.map((x) => `${x.n} ${x.from}→${x.to}`)} render={(n) => <span key={n} style={s.ch(P.t2)}>{n}</span>} />
      </>}

      <div style={s.sc}>📋 Patch Notes</div>
      {data.patchNotes && data.patchNotes.length ? data.patchNotes.map((p, i) => (
        <div key={i} style={{ ...s.cd2, cursor: "default" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: P.gold }}>{p.version} <span style={{ fontSize: 10, color: P.t3 }}>{p.date}</span></div>
          {p.summary && <div style={{ fontSize: 11, color: P.t2, marginTop: 3 }}>{p.summary}</div>}
          {(p.changes || []).map((c, j) => <div key={j} style={{ fontSize: 10, color: P.t2, marginTop: 2 }}>• {c.hero ? <strong>{c.hero}: </strong> : null}{c.text}</div>)}
        </div>
      )) : <div style={{ fontSize: 11, color: P.t3, padding: "8px 0" }}>Patch notes will populate when the official-notes source is enabled. For now, see the Meta tab for the current patch summary.</div>}
    </>
  );
}
```

- [ ] **Step 2: App.jsx** — add `"Updates"` to TABS (after `"Meta"`), import `UpdatesView`, add case: `case "Updates": return <UpdatesView onSelectHero={onSelectHero} />;`

- [ ] **Step 3:** `npm run build` → success.

- [ ] **Step 4: Update smoke test** — add `"Updates"` to the TABS array in `tests/app.smoke.test.jsx` so the "renders every tab" test covers it. Run `npx vitest run` → all green.

- [ ] **Step 5:** Commit `feat: Updates tab showing new heroes, buffs/nerfs, patch notes`.

---

## Self-Review

**Spec coverage (Phase 4):** diff engine → Task 1; Updates feed tab (new heroes, buff/nerf, patch notes) → Task 4; NEW/↑/↓ badges woven into Tiers/Heroes → Task 3; "last updated" + refresh already in App (Plan 2) and echoed in Updates. First-launch baseline avoids false "everything is new" → Task 2.

**Placeholder scan:** Patch-notes section shows an honest "will populate when official-notes source is enabled" message (the source is a documented stub from Plan 2), not a fake placeholder. No TODOs.

**Type consistency:** `computeDiff`/`buildChangeMap`/`TIER_ORDER` defined Task 1, used in Task 2 (`DataProvider`) and indirectly via `getChange`/`Badge` (Task 3) and `diff` (Task 4). `getChange(name)` added to context in Task 2, consumed in Task 3. Snapshot key `mlbb-seen` written/read only in `DataContext`.
