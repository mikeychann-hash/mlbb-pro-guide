import { HEROES } from "./seed/heroes.js";
import { ITEMS } from "./seed/items.js";
import { SPELLS } from "./seed/spells.js";
import { PATCH, BANS, RISING, FALLING, LANES, TEAMS } from "./seed/meta.js";
import { JG_PATHS, JG_TIMERS, JG_TIPS } from "./seed/jungle.js";
import { PRO_PICKS, PRO_TIPS_DATA } from "./seed/propicks.js";
import { GLOSSARY } from "./seed/glossary.js";
import { LEARN_PATH } from "./seed/learn.js";
import { EMBLEM_SETS } from "./seed/emblems.js";
import { ROAM_BOOTS, ROAM_ROTATION, ROAM_TIPS } from "./seed/roam.js";
import { PHASES, MACRO_CATS, ANTI_HEAL } from "./seed/macro.js";

export const getHeroes = () => HEROES;
export const getHeroByName = (name) => {
  if (!name) return null;
  const q = name.toLowerCase();
  return HEROES.find((h) => h.n.toLowerCase() === q) || null;
};
export const getItems = () => ITEMS;
export const getSpells = () => SPELLS;
export const getMeta = () => ({ patch: PATCH, bans: BANS, rising: RISING, falling: FALLING, lanes: LANES, teams: TEAMS });
export const getJungle = () => ({ paths: JG_PATHS, timers: JG_TIMERS, tips: JG_TIPS });
export const getProPicks = () => ({ picks: PRO_PICKS, tips: PRO_TIPS_DATA });
export const getGlossary = () => GLOSSARY;
export const getLearnPath = () => LEARN_PATH;
export const getEmblems = () => EMBLEM_SETS;
export const getRoam = () => ({ boots: ROAM_BOOTS, rotation: ROAM_ROTATION, tips: ROAM_TIPS });
export const getMacro = () => ({ phases: PHASES, cats: MACRO_CATS, antiHeal: ANTI_HEAL });
