import { BUNDLED_DATA } from "../src/data/bundled.js";
import { pendingHero } from "../src/data/dataset.js";

// Merge live roster onto the rich seed. Seed heroes keep full detail; roster
// heroes not in the seed are added as `pending`. stats/patchNotes are applied
// when available (null today).
export function buildDataset({ roster, stats, images, patchNotes, now }) {
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
    const idx = {};
    for (const k of Object.keys(stats)) idx[k.toLowerCase()] = stats[k];
    for (const h of heroes) {
      const s = idx[h.n.toLowerCase()];
      if (s) {
        if (typeof s.wr === "number") h.wr = s.wr;
        if (typeof s.pr === "number") h.pr = s.pr;
        if (typeof s.br === "number") h.br = s.br;
        if (s.tier) h.t = s.tier;
        h.pending = false;
      }
    }
  }

  // Portraits (Fandom) applied to the whole roster for a consistent look.
  if (images) {
    const idx = {};
    for (const k of Object.keys(images)) idx[k.toLowerCase()] = images[k];
    for (const h of heroes) {
      const im = idx[h.n.toLowerCase()];
      if (im) h.img = im;
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
