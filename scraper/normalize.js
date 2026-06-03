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
