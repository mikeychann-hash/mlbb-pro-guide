// Lock-In Risk Scanner — "is this pick punishable right now?" Given a hero you
// are considering plus the visible enemy lineup (and your team), return a clear
// LOCK / RISKY / AVOID verdict with the reasons and the move to make.
// Pure functions only. Hero data: c = countered-by, s = strong-vs, sy = synergy,
// t = tier, wr = win rate, l = lane.
const TIER_RANK = { "S+": 5, S: 4, A: 3, B: 2, C: 1, "?": 0 };
const wrOf = (h) => (Number.isFinite(h.wr) ? h.wr : 50);

// "x beats y" — x strong-vs y OR y countered-by x (both data directions).
const beats = (x, y) => (x.s || []).includes(y.n) || (y.c || []).includes(x.n);
const synergyWith = (h, m) => (h.sy || []).includes(m.n) || (m.sy || []).includes(h.n);

export function lockInRisk(hero, enemy = [], mine = []) {
  if (!hero) return null;
  const counteredBy = enemy.filter((e) => beats(e, hero)).map((e) => e.n); // enemy beats hero
  const youBeat = enemy.filter((e) => beats(hero, e)).map((e) => e.n); // hero beats enemy
  const synergy = mine.filter((m) => m.n !== hero.n && synergyWith(hero, m)).map((m) => m.n);
  const laneClash = mine.filter((m) => m.n !== hero.n && m.l && m.l === hero.l).map((m) => m.n);

  let score = youBeat.length * 3 - counteredBy.length * 5 + (TIER_RANK[hero.t] || 0) * 2 + (wrOf(hero) - 50);
  score += synergy.length * 2;
  if (laneClash.length) score -= 8;

  let verdict, tone;
  if (laneClash.length && counteredBy.length) { verdict = "Lane clash + countered — reconsider"; tone = "bad"; }
  else if (laneClash.length) { verdict = "Lane clash — reconsider"; tone = "bad"; }
  else if (counteredBy.length >= 2) { verdict = "Risky — heavily countered"; tone = "bad"; }
  else if (counteredBy.length === 1) { verdict = "Playable — one threat"; tone = "warn"; }
  else { verdict = "Safe to lock"; tone = "good"; }

  const advice = [];
  if (laneClash.length) advice.push(`${laneClash.join(", ")} already on ${hero.l} — switch lane or pick another role.`);
  if (counteredBy.length) advice.push(`Countered by ${counteredBy.join(", ")} — itemize/bait their cooldowns, or swap if you're unsure.`);
  if (youBeat.length) advice.push(`You beat ${youBeat.join(", ")} — lane and duel them with confidence.`);
  if (synergy.length) advice.push(`Synergy with ${synergy.join(", ")} — coordinate your combo.`);
  if (!counteredBy.length && !laneClash.length) advice.push("No hard counters in their lineup — comfortable lock.");

  return { hero: hero.n, verdict, tone, score: Math.round(score), counteredBy, youBeat, synergy, laneClash, advice };
}
