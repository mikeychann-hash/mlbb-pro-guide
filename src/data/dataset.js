export const SCHEMA_VERSION = 1;

// Default field values for a hero that exists in the live roster but has no
// detailed seed entry yet (newly released). Keeps hero-detail pages safe.
export function pendingHero(name) {
  return {
    n: name, r: "Fighter", r2: "", t: "?", l: "—", d: 1,
    wr: 0, pr: 0, br: 0, sp: "Newly released — data pending",
    c: [], s: [], b: [], e: "—", sp2: [], tip: "Stats and build pending next data update.", sy: [],
    img: null,
    pending: true,
  };
}
