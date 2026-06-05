// Personal Comfort vs Meta Picker — blends global hero strength with YOUR tracked
// win/loss + favorites to answer "what should I actually play right now?".
// Tags each hero Comfort / Favorite / Meta / Played / Struggling and ranks them.
// Pure functions. tracker entries: { hero, result: "Win"|"Loss"|"MVP" }.
const TIER_RANK = { "S+": 5, S: 4, A: 3, B: 2, C: 1, "?": 0 };
const wrOf = (h) => (Number.isFinite(h.wr) ? h.wr : 50);
const isWin = (m) => m.result === "Win" || m.result === "MVP";

export function playNowPlan(heroes = [], tracker = [], favorites = [], opts = {}) {
  const lane = opts.lane && opts.lane !== "All" ? opts.lane : null;

  // Aggregate personal record per hero.
  const rec = {};
  for (const m of tracker) {
    const k = (m.hero || "").toLowerCase();
    if (!k) continue;
    if (!rec[k]) rec[k] = { w: 0, l: 0 };
    if (isWin(m)) rec[k].w++; else rec[k].l++;
  }
  const favSet = new Set(favorites.map((f) => f.toLowerCase()));
  const pool = heroes.filter((h) => !h.pending && (!lane || h.l === lane));

  const list = pool.map((h) => {
    const s = rec[h.n.toLowerCase()] || { w: 0, l: 0 };
    const games = s.w + s.l;
    const pWRexact = games ? (s.w / games) * 100 : null; // threshold math (unrounded)
    const pWR = pWRexact != null ? Math.round(pWRexact) : null; // display
    const meta = (TIER_RANK[h.t] || 0) * 6 + (wrOf(h) - 50) * 2;
    let score = meta;
    let tag = "Meta";

    if (games >= 3 && pWRexact >= 55) { score += 40 + (pWRexact - 55); tag = "Comfort"; }
    else if (games >= 3 && pWRexact < 45) { score -= 30; tag = "Struggling"; }
    else if (games > 0) { score += 8; tag = "Played"; }

    // Don't let a "favorite" bonus prop a hero you keep losing on above solid meta.
    if (tag !== "Struggling" && favSet.has(h.n.toLowerCase())) { score += 10; if (tag === "Meta") tag = "Favorite"; }

    return { n: h.n, r: h.r, l: h.l, t: h.t, wr: h.wr, games, pWR, tag, score: Math.round(score) };
  }).sort((a, b) => b.score - a.score);

  const comfort = list.find((x) => x.tag === "Comfort") || null;
  const meta = list.find((x) => x.tag === "Meta" || x.tag === "Favorite") || null;
  return { list: list.slice(0, 15), comfort, meta, hasHistory: tracker.length > 0 };
}
