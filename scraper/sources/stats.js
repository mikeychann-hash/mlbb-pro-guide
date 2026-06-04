// Win / pick / ban rates from the openmlbb public API, which surfaces Moonton's
// own ranked-match statistics as JSON. Returns a map keyed by hero name:
//   { [name]: { wr, pr, br } }  (percentages, 1 decimal)
// Returns null on failure so a bad run can never break the dataset (the app
// then keeps the bundled/seed stats). Isolated from the other sources.
const URL =
  "https://openmlbb.fastapicloud.dev/api/heroes/rank?days=7&rank=all&size=300&index=1&sort_field=win_rate&sort_order=desc";
const UA = "MLBB-Guide-Scraper/1.0 (https://github.com/mikeychann-hash/mlbb-pro-guide)";

// The API reports rates as fractions (0.231 = 23.1%). A win/pick/ban rate can
// never exceed 100%, so reject anything outside [0,1] — a single bad upstream
// value (e.g. Marcel's ban_rate of 1.23) must not leak a "123.1%" into the app.
const pct = (x) =>
  typeof x === "number" && x >= 0 && x <= 1 ? Math.round(x * 1000) / 10 : null;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export async function fetchStats(fetchImpl = fetch) {
  // The upstream API 502s intermittently; retry a few times before giving up.
  let r = null;
  let lastErr = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      r = await fetchImpl(URL, { headers: { "User-Agent": UA } });
      if (r.ok) break;
      lastErr = new Error("stats HTTP " + r.status);
    } catch (e) {
      lastErr = e;
    }
    r = null;
    await sleep(1500 * (attempt + 1));
  }
  if (!r) throw lastErr || new Error("stats fetch failed");
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
    const img = d?.main_hero?.data?.head;
    map[name] = {};
    if (wr != null) map[name].wr = wr;
    if (pr != null) map[name].pr = pr;
    if (br != null) map[name].br = br;
    if (img) map[name].img = img;
  }
  return Object.keys(map).length ? map : null;
}
