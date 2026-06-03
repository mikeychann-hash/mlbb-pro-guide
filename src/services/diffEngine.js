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
