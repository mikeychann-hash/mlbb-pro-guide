// Builds a personalized ranked hero pool for the lanes a player queues, from
// their favorites + the live meta. Personalization is the paid hook — generic
// tier lists are free.
const TIER_RANK = { "S+": 5, S: 4, A: 3, B: 2, C: 1, "?": 0 };
const byStrength = (a, b) => (TIER_RANK[b.t] || 0) - (TIER_RANK[a.t] || 0) || (b.wr - a.wr);

export function climbPlan(heroes, lanes = [], favorites = []) {
  const laneSet = new Set(lanes);
  const inLane = (h) => laneSet.size === 0 || laneSet.has(h.l);
  const favSet = new Set(favorites.map((f) => f.toLowerCase()));
  const pool = (heroes || []).filter(inLane);
  const fav = pool.filter((h) => favSet.has(h.n.toLowerCase())).sort(byStrength);
  const nonFav = pool.filter((h) => !favSet.has(h.n.toLowerCase()));
  return {
    count: pool.length,
    mains: fav.slice(0, 3),
    backups: fav.slice(3, 5),
    learn: nonFav.filter((h) => (TIER_RANK[h.t] || 0) >= 4).sort(byStrength).slice(0, 4),
    banThreats: pool.slice().sort((a, b) => (b.br || 0) - (a.br || 0)).filter((h) => (h.br || 0) > 0).slice(0, 4),
    avoid: pool.filter((h) => (TIER_RANK[h.t] || 0) <= 2).sort((a, b) => a.wr - b.wr).slice(0, 4),
  };
}
