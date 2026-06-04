// Derives multiple situational item sets for a hero from its core build + role,
// so every hero has more than one build to reference. The core build is the
// curated one; the rest swap the last slot for a situational item.
const isMagic = (h) => h.r === "Mage" || h.r2 === "Mage";

export function buildSets(hero) {
  const core = hero.b || [];
  if (!core.length) return [];
  const magic = isMagic(hero);

  const swapLast = (item) => {
    if (core.includes(item)) return core.slice();
    const c = core.slice();
    c[c.length - 1] = item;
    return c;
  };

  const penItem = magic ? "Divine Glaive" : "Malefic Roar";
  const antiHeal = magic ? "Necklace of Durance" : hero.r === "Tank" || hero.r === "Support" ? "Dominance Ice" : "Sea Halberd";
  const surviveItem = hero.r === "Marksman" ? "Wind of Nature" : magic ? "Winter Truncheon" : "Immortality";

  return [
    { name: "Core", items: core, note: "Recommended standard build." },
    { name: "vs Tanks", items: swapLast(penItem), note: `Swap in ${penItem} to punch through high HP & defense.` },
    { name: "vs Sustain", items: swapLast(antiHeal), note: `${antiHeal} cuts enemy healing ~50% (anti-heal).` },
    { name: "vs Burst / Dive", items: swapLast(surviveItem), note: `${surviveItem} helps survive assassin all-ins.` },
  ];
}
