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
    // Final gate before write: rates are percentages, so anything outside
    // [0,100] is corrupt — drop it and keep the existing seed value.
    const rate = (x) => (typeof x === "number" && x >= 0 && x <= 100 ? x : null);
    const idx = {};
    for (const k of Object.keys(stats)) idx[k.toLowerCase()] = stats[k];
    for (const h of heroes) {
      const s = idx[h.n.toLowerCase()];
      if (s) {
        const wr = rate(s.wr); if (wr != null) h.wr = wr;
        const pr = rate(s.pr); if (pr != null) h.pr = pr;
        const br = rate(s.br); if (br != null) h.br = br;
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

  // Compile a structured patch-notes changelog from new heroes + meta movement
  // (used unless a real official-notes source provides one).
  const newNames = heroes.filter((h) => h.pending).map((h) => h.n);
  const meta = BUNDLED_DATA.meta || {};
  const compiledNotes = [{
    version: BUNDLED_DATA.patch?.v,
    date: BUNDLED_DATA.patch?.d,
    summary: `${newNames.length} new hero(es), ${(meta.rising || []).length} rising, ${(meta.falling || []).length} falling.`,
    changes: [
      ...newNames.map((n) => ({ hero: n, type: "new", text: "Newly added to roster" })),
      ...(meta.rising || []).map((r) => ({ hero: r.n, type: "buff", text: `${r.ch} — ${r.w}` })),
      ...(meta.falling || []).map((f) => ({ hero: f.n, type: "nerf", text: `${f.ch} — ${f.w}` })),
    ],
  }];

  return {
    ...BUNDLED_DATA,
    source: "scraped",
    generatedAt: now,
    heroes,
    patchNotes: Array.isArray(patchNotes) && patchNotes.length ? patchNotes : compiledNotes,
    rosterCount: heroes.length,
  };
}
