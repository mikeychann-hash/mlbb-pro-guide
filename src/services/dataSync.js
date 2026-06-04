import { BUNDLED_DATA } from "../data/bundled.js";
import { getJSON, setJSON } from "./storage.js";

// Where the daily GitHub Action publishes data.json (raw main branch). If the
// repo isn't pushed/public yet, the fetch simply fails and the app uses
// cached/bundled data — by design.
export const DATA_URL =
  "https://raw.githubusercontent.com/mikeychann/mlbb-pro-guide/main/scraper/output/data.json";

const CACHE_KEY = "mlbb-data";

const ts = (d) => (d && d.generatedAt ? Date.parse(d.generatedAt) || 0 : 0);

export function pickNewest(a, b) {
  if (a && !b) return a;
  if (b && !a) return b;
  if (!a && !b) return BUNDLED_DATA;
  return ts(b) > ts(a) ? b : a;
}

export async function syncData({ fetchImpl = fetch, url = DATA_URL } = {}) {
  const cached = await getJSON(CACHE_KEY, null);
  let remote = null;
  let error = null;
  try {
    const r = await fetchImpl(url, { headers: { "Cache-Control": "no-cache" } });
    if (!r.ok) throw new Error("HTTP " + r.status);
    remote = await r.json();
  } catch (e) {
    error = e.message || String(e);
  }
  // newest of bundled / cached / remote
  let best = pickNewest(BUNDLED_DATA, cached);
  best = pickNewest(best, remote);
  if (remote && best === remote) await setJSON(CACHE_KEY, remote);
  return { data: best, error, updatedAt: best.generatedAt || null };
}
