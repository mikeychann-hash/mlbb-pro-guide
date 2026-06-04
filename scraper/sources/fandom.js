const API = "https://mobile-legends.fandom.com/api.php";
const UA = "MLBB-Guide-Scraper/1.0 (https://github.com/mikeychann-hash/mlbb-pro-guide)";

// Returns array of hero names from Category:Heroes (paginated). Throws on failure.
export async function fetchRoster(fetchImpl = fetch) {
  const names = [];
  let cont = "";
  for (let i = 0; i < 6; i++) {
    const url = `${API}?action=query&list=categorymembers&cmtitle=Category:Heroes&cmlimit=500&cmtype=page&format=json${cont}`;
    const r = await fetchImpl(url, { headers: { "User-Agent": UA } });
    if (!r.ok) throw new Error("Fandom HTTP " + r.status);
    const j = await r.json();
    for (const m of j.query?.categorymembers || []) names.push(m.title);
    if (j.continue?.cmcontinue) cont = "&cmcontinue=" + encodeURIComponent(j.continue.cmcontinue);
    else break;
  }
  // Filter out non-hero meta pages that live in Category:Heroes (roles, lanes,
  // squads/factions, list/subpages).
  const DENY = new Set([
    "Assassin", "Fighter", "Mage", "Marksman", "Support", "Tank",
    "EXP Laner", "Gold Laner", "Mid Laner", "Jungler", "Roamer",
    "Cancelled heroes", "Hero roles", "Heavenly Artifacts", "Heroes",
    // squads / factions
    "Lightborn", "Oriental Fighters", "The Exorcists", "V.E.N.O.M.", "S.A.B.E.R.",
    "Northern Vale", "Cadia Riverlands", "Los Pecados", "Eruditio", "Moniyan Empire",
    "Abyss", "Dragon Altar", "Land of Dawn", "Necrokeep", "Agelta Drylands",
  ]);
  const DENY_RE = /(:|\/|\b(Laner|Jungler|Roamer|roles?|Artifacts?|heroes|Squad)\b)/i;
  // Heroes never use dotted acronyms (V.E.N.O.M., S.A.B.E.R.).
  const isAcronym = (n) => (n.match(/\./g) || []).length >= 2;
  return names.filter((n) => !DENY.has(n) && !DENY_RE.test(n) && !isAcronym(n));
}

// Returns a map of hero name -> portrait image URL via the wiki's pageimages
// (the official HeroNNN-portrait.png splash on the stable wikia CDN). Covers the
// whole roster. Throws on failure (caller wraps in safe()).
export async function fetchImages(names, fetchImpl = fetch) {
  const map = {};
  const CHUNK = 50;
  for (let i = 0; i < names.length; i += CHUNK) {
    const batch = names.slice(i, i + CHUNK);
    const url = `${API}?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=240&titles=${encodeURIComponent(batch.join("|"))}`;
    const r = await fetchImpl(url, { headers: { "User-Agent": UA } });
    if (!r.ok) throw new Error("Fandom images HTTP " + r.status);
    const j = await r.json();
    const pages = j.query?.pages || {};
    for (const k in pages) {
      const p = pages[k];
      if (p && p.title && p.thumbnail && p.thumbnail.source) map[p.title] = p.thumbnail.source;
    }
  }
  return Object.keys(map).length ? map : null;
}
