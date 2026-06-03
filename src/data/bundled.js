import { SCHEMA_VERSION } from "./dataset.js";
import {
  getHeroes, getItems, getSpells, getMeta, getJungle, getProPicks,
  getGlossary, getLearnPath, getEmblems, getRoam, getMacro,
} from "./index.js";

export function buildBundledData() {
  const meta = getMeta();
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: null,        // seed has no scrape timestamp
    source: "bundled",
    patch: meta.patch,
    heroes: getHeroes(),
    items: getItems(),
    spells: getSpells(),
    meta,
    jungle: getJungle(),
    propicks: getProPicks(),
    glossary: getGlossary(),
    learn: getLearnPath(),
    emblems: getEmblems(),
    roam: getRoam(),
    macro: getMacro(),
  };
}

export const BUNDLED_DATA = buildBundledData();
