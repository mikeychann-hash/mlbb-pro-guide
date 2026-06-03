// Win/pick/ban-rate scraping. No stable free API confirmed, so this is a
// best-effort stub returning null today; the app falls back to bundled seed
// stats. To enable: implement fetch+parse here and return a map keyed by hero
// name: { [name]: { wr, pr, br, tier } }. Isolated so failure can't break a run.
export async function fetchStats(_fetchImpl = fetch) {
  return null;
}
