// Draft Coach — recommends ban / pick / avoid for the team whose turn it is,
// from bans, ally + enemy picks, role/lane gaps, counters (c=weak-vs, s=strong-vs),
// synergies (sy), win/ban rates, tier, and the user's favorites.
const TIER_RANK = { "S+": 5, S: 4, A: 3, B: 2, C: 1, "?": 0 };
const ALL_ROLES = ["Tank", "Fighter", "Assassin", "Mage", "Marksman", "Support"];

export function draftCoach(draft, heroes, favorites = []) {
  if (!draft || draft.phase === "done") return null;
  const banPhase = draft.phase.startsWith("ban");
  const team = draft.turn === 1 ? draft.t1 : draft.t2;
  const enemy = draft.turn === 1 ? draft.t2 : draft.t1;
  const teamLabel = draft.turn === 1 ? "Blue" : "Red";

  const byName = new Map(heroes.map((h) => [h.n.toLowerCase(), h]));
  const taken = new Set([...draft.t1.b, ...draft.t2.b, ...draft.t1.p, ...draft.t2.p].map((x) => x.toLowerCase()));
  const avail = heroes.filter((h) => !taken.has(h.n.toLowerCase()));
  const myPicks = team.p.map((n) => byName.get(n.toLowerCase())).filter(Boolean);
  const enemyPicks = enemy.p.map((n) => byName.get(n.toLowerCase())).filter(Boolean);
  const myRoles = new Set(myPicks.flatMap((h) => [h.r, h.r2].filter(Boolean)));
  const favSet = new Set(favorites.map((f) => f.toLowerCase()));

  if (banPhase) {
    const picks = avail.map((h) => {
      let score = (h.br || 0) * 0.6 + (TIER_RANK[h.t] || 0) * 4 + ((h.wr || 50) - 50) * 1.5;
      let reason = (h.br >= 15) ? `${h.br}% ban rate` : `${h.t}-tier meta threat`;
      const countersUs = myPicks.filter((p) => (h.s || []).includes(p.n)).map((p) => p.n);
      if (countersUs.length) { score += 7 * countersUs.length; reason = `Counters your ${countersUs.join(", ")}`; }
      return { n: h.n, reason, score };
    }).sort((a, b) => b.score - a.score).slice(0, 5);
    return { phase: "ban", team: teamLabel, picks, avoid: [] };
  }

  const missingRoles = ALL_ROLES.filter((r) => !myRoles.has(r));
  const scored = avail.map((h) => {
    let score = (TIER_RANK[h.t] || 0) * 5 + ((h.wr || 50) - 50) * 2;
    const reasons = [];
    const beats = enemyPicks.filter((e) => (h.s || []).includes(e.n)).map((e) => e.n);
    const losesTo = enemyPicks.filter((e) => (h.c || []).includes(e.n)).map((e) => e.n);
    if (beats.length) { score += 5 * beats.length; reasons.push(`counters ${beats.join(", ")}`); }
    if (losesTo.length) score -= 5 * losesTo.length;
    const synergy = myPicks.filter((p) => (h.sy || []).includes(p.n) || (p.sy || []).includes(h.n)).map((p) => p.n);
    if (synergy.length) { score += 3 * synergy.length; reasons.push(`synergy with ${synergy.join(", ")}`); }
    if (missingRoles.includes(h.r) || (h.r2 && missingRoles.includes(h.r2))) { score += 4; reasons.push(`fills ${missingRoles.includes(h.r) ? h.r : h.r2}`); }
    else if (myRoles.has(h.r)) score -= 3;
    if (favSet.has(h.n.toLowerCase())) { score += 3; reasons.push("your favorite"); }
    const reason = reasons.length ? reasons.join(" · ") : `${h.t}-tier · ${h.wr}% WR`;
    return { n: h.n, reason, score };
  });
  const picks = scored.slice().sort((a, b) => b.score - a.score).slice(0, 5);
  const avoid = avail
    .map((h) => ({ n: h.n, losesTo: enemyPicks.filter((e) => (h.c || []).includes(e.n)).map((e) => e.n) }))
    .filter((x) => x.losesTo.length)
    .slice(0, 4)
    .map((x) => ({ n: x.n, reason: `countered by ${x.losesTo.join(", ")}` }));
  return { phase: "pick", team: teamLabel, picks, avoid };
}
