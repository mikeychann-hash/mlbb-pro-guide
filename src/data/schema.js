/**
 * @typedef {Object} Hero
 * @property {string} n   name
 * @property {string} r   primary role (Tank|Fighter|Assassin|Mage|Marksman|Support)
 * @property {string} r2  secondary role ("" if none)
 * @property {string} t   tier (S+|S|A|B|C)
 * @property {string} l   lane (EXP|Mid|Jungle|Gold|Roam)
 * @property {number} d   difficulty 1-3
 * @property {number} wr  win rate %
 * @property {number} pr  pick rate %
 * @property {number} br  ban rate %
 * @property {string} sp  specialty
 * @property {string[]} c counters (heroes that beat this hero)
 * @property {string[]} s strongVs (heroes this hero beats)
 * @property {string[]} b recommended build (item names)
 * @property {string} e   emblem set name
 * @property {string[]} sp2 battle spells
 * @property {string} tip short tip
 * @property {string[]} sy synergies
 * @property {string} [img] portrait image URL (from live data; absent on seed)
 */
export const SCHEMA_VERSION = 1;
