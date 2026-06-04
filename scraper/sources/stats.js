// Win / pick / ban rates from the openmlbb public API, which surfaces Moonton's
// own ranked-match statistics as JSON. Returns a map keyed by hero name:
//   { [name]: { wr, pr, br } }  (percentages, 1 decimal)
// Returns null on failure so a bad run can never break the dataset (the app
// then keeps the bundled/seed stats). Isolated from the other sources.
const URL =
  "https://openmlbb.fastapicloud.dev/api/heroes/rank?days=7&rank=all&size=300&index=1&sort_field=win_rate&sort_order=desc";
const UA = "MLBB-Guide-Scraper/1.0 (https://github.com/mikeychann/mlbb-pro-guide)";

const pct = (x) => (typeof x === "number" ? Math.round(x * 1000) / 10 : null);

export async function fetchStats(fetchImpl = fetch) {
  const r = await fetchImpl(URL, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error("stats HTTP " + r.status);
  const j = await r.json();
  const records = j?.data?.records || [];
  const map = {};
  for (const rec of records) {
    const d = rec?.data || {};
    const name = d?.main_hero?.data?.name;
    if (!name) continue;
    const wr = pct(d.main_hero_win_rate);
    const pr = pct(d.main_hero_appearance_rate);
    const br = pct(d.main_hero_ban_rate);
    map[name] = {};
    if (wr != null) map[name].wr = wr;
    if (pr != null) map[name].pr = pr;
    if (br != null) map[name].br = br;
  }
  return Object.keys(map).length ? map : null;
}
