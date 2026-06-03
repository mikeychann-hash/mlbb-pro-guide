import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fetchRoster } from "./sources/fandom.js";
import { fetchStats } from "./sources/stats.js";
import { fetchPatchNotes } from "./sources/official.js";
import { buildDataset } from "./normalize.js";
import { validate } from "./validate.js";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "output", "data.json");

async function safe(fn, label) {
  try { return await fn(); }
  catch (e) { console.warn(`[scrape] ${label} failed: ${e.message}`); return null; }
}

async function main() {
  const roster = await safe(() => fetchRoster(), "fandom roster");
  const stats = await safe(() => fetchStats(), "stats");
  const patchNotes = await safe(() => fetchPatchNotes(), "patch notes");

  const now = new Date().toISOString();
  const ds = buildDataset({ roster, stats, patchNotes, now });
  const { ok, errors } = validate(ds);
  if (!ok) {
    console.error("[scrape] validation failed:", errors.join("; "));
    process.exit(1); // keep previously committed data.json
  }
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(ds, null, 2) + "\n", "utf8");
  console.log(`[scrape] wrote ${ds.heroes.length} heroes (roster ${roster ? roster.length : "n/a"}) at ${now}`);
}

main();
