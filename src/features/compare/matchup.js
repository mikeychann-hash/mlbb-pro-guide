// Derives an actionable matchup plan for hero `a` vs hero `b` from the hero data
// (counters c, strongVs s, role, specialty sp, tip, spells sp2). Heuristic but
// grounded in the dataset — the kind of "how do I actually play this" guidance
// free lookup tools don't give.
const rx = (h) => `${h.sp || ""} ${h.tip || ""}`.toLowerCase();

export function matchupPlan(a, b) {
  if (!a || !b) return null;
  const aBeatsB = (a.s || []).includes(b.n) || (b.c || []).includes(a.n);
  const bBeatsA = (a.c || []).includes(b.n) || (b.s || []).includes(a.n);

  let verdict, tone;
  if (bBeatsA && !aBeatsB) { verdict = `${b.n} counters ${a.n} — hard matchup`; tone = "bad"; }
  else if (aBeatsB && !bBeatsA) { verdict = `${a.n} counters ${b.n} — favorable`; tone = "good"; }
  else { verdict = "Even — skill & itemization decide"; tone = "even"; }

  const tips = [];
  if (tone === "bad") tips.push(`Play safe early vs ${b.n} (${b.sp}). Farm, scale, and avoid 1v1s until you're itemized.`);
  else if (tone === "good") tips.push(`Press your advantage early — fight ${b.n} before they out-scale you.`);
  else tips.push(`Trade when ${b.n}'s key skill is on cooldown; respect their ${(b.sp || "kit").toLowerCase()}.`);

  // defensive itemization by enemy damage type
  const enemyMagic = b.r === "Mage" || b.r2 === "Mage";
  tips.push(enemyMagic
    ? "Itemize magic defense (Athena's Shield / Radiant Armor)."
    : "Itemize physical defense (Antique Cuirass) + the right boots.");

  // anti-heal
  if (/(sustain|lifesteal|heal|regen|drain|vampire|spell vamp|unkillable)/.test(rx(b)))
    tips.push(`${b.n} sustains hard — buy anti-heal (Dominance Ice / Sea Halberd / Necklace of Durance).`);

  // mobility / dash threat
  if (/(dash|mobil|blink|charge|stealth|wall)/.test(rx(b)))
    tips.push(`${b.n} is slippery — bring CC / anti-dash and save Flicker to reposition.`);

  // spell suggestion
  if (a.sp2 && a.sp2.length) {
    const pick = tone === "bad" && a.sp2.includes("Purify") ? "Purify"
      : tone === "bad" && a.sp2.includes("Flicker") ? "Flicker"
        : a.sp2[0];
    tips.push(`Battle spell: ${pick}.`);
  }

  tips.push(`Win condition: ${a.sp}.`);
  return { verdict, tone, tips };
}
