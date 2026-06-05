// Enemy Threat Radar — given the enemy lineup (and optionally your own team),
// rank which enemies are the biggest problem and give a concrete action for
// each: who to ban/focus/avoid, and which of your heroes already answers them.
// Pure functions only (no React) so the logic is unit-testable.
// Hero data: t = tier, wr/pr/br = rates, r/r2 = roles, c = countered-by, s = strong-vs.
const TIER_RANK = { "S+": 5, S: 4, A: 3, B: 2, C: 1, "?": 0 };
const wrOf = (h) => (Number.isFinite(h.wr) ? h.wr : 50);
const brOf = (h) => (Number.isFinite(h.br) ? h.br : 0);

// "x beats y" — true if x is strong vs y OR y is countered-by x (both data directions).
const beats = (x, y) => (x.s || []).includes(y.n) || (y.c || []).includes(x.n);
const rolesOf = (h) => [h.r, h.r2].filter(Boolean);
const isRole = (h, role) => rolesOf(h).includes(role);

function levelOf(score) {
  if (score >= 18) return "Critical";
  if (score >= 12) return "High";
  if (score >= 6) return "Medium";
  return "Low";
}

// One-line, actionable advice for dealing with a single enemy hero.
function adviceFor(e, threatens, answeredBy) {
  if (answeredBy.length) return `Your ${answeredBy.join(", ")} answers them — match the lane.`;
  const lead = threatens.length ? `Counters your ${threatens.join(", ")}. ` : "";
  if (isRole(e, "Assassin")) return lead + "Burst assassin — group up, ward, never walk alone.";
  if (isRole(e, "Marksman")) return lead + "Main carry — deny farm early, focus & dive in fights.";
  if (isRole(e, "Mage")) return lead + "Burst mage — dodge skillshots, itemize magic resist.";
  if (isRole(e, "Tank") || isRole(e, "Support")) return lead + "Engage threat — respect their initiation, don't get chain-CC'd.";
  if (isRole(e, "Fighter")) return lead + "Strong duelist — avoid 1v1 side lane, collapse with team.";
  return lead + "Play around their cooldowns; group for objectives.";
}

export function threatRadar(enemy = [], mine = []) {
  if (!enemy.length) return null;
  const list = enemy.map((e) => {
    const threatens = mine.filter((m) => beats(e, m)).map((m) => m.n); // enemy beats my heroes
    const answeredBy = mine.filter((m) => beats(m, e)).map((m) => m.n); // my heroes beat enemy
    let score = (TIER_RANK[e.t] || 0) * 4 + (wrOf(e) - 50) * 1.5 + brOf(e) * 0.25;
    score += threatens.length * 6;
    score -= answeredBy.length * 4;
    if (isRole(e, "Assassin")) score += 4;
    if (isRole(e, "Marksman")) score += 3;
    score = Math.max(0, Math.round(score));
    // A genuine S/S+ meta pick is never dismissed as Low, even when answered.
    let level = levelOf(score);
    if ((e.t === "S+" || e.t === "S") && level === "Low") level = "Medium";
    return { n: e.n, r: e.r, t: e.t, score, level, threatens, answeredBy, action: adviceFor(e, threatens, answeredBy) };
  }).sort((a, b) => b.score - a.score);

  // Which of YOUR heroes is targeted by the most enemies → who to peel/protect.
  let protect = null;
  if (mine.length) {
    const counted = mine
      .map((m) => ({ n: m.n, by: enemy.filter((e) => beats(e, m)).map((e) => e.n) }))
      .filter((x) => x.by.length)
      .sort((a, b) => b.by.length - a.by.length);
    if (counted.length) protect = counted[0];
  }

  const avg = list.reduce((a, x) => a + x.score, 0) / list.length;
  const overall = avg >= 14 ? "Stacked" : avg >= 9 ? "Dangerous" : avg >= 5 ? "Even" : "Manageable";

  return { list, banPriority: list[0]?.n || null, protect, overall };
}
