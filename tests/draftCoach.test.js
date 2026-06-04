import { describe, it, expect } from "vitest";
import { draftCoach } from "../src/features/draft/draftCoach.js";
import { emptyDraft } from "../src/features/draft/draftLogic.js";

const H = (n, r, t, wr, br, extra = {}) => ({ n, r, r2: "", t, l: "Mid", wr, pr: 5, br, c: [], s: [], sy: [], ...extra });
const heroes = [
  H("Khufra", "Tank", "S+", 51.5, 14, { s: ["Fanny", "Ling"] }),
  H("Joy", "Assassin", "S", 51.8, 82),
  H("Ling", "Assassin", "A", 50.6, 61),
  H("Pharsa", "Mage", "S", 51.9, 6, { c: ["Ling"] }),
  H("Tigreal", "Tank", "S+", 51.2, 8, { sy: ["Pharsa"] }),
  H("Layla", "Marksman", "B", 49.5, 0),
];

describe("draftCoach", () => {
  it("returns null when draft is done", () => {
    expect(draftCoach({ ...emptyDraft(), phase: "done" }, heroes)).toBeNull();
  });

  it("recommends high ban-rate / threat heroes during ban phase", () => {
    const c = draftCoach(emptyDraft(), heroes, []);
    expect(c.phase).toBe("ban");
    expect(c.team).toBe("Blue");
    expect(c.picks[0].n).toBe("Joy"); // 82% ban rate dominates
  });

  it("during pick phase, favors heroes that counter the enemy", () => {
    // Blue to pick; Red has Ling picked. Khufra is strong vs Ling.
    const d = { t1: { b: [], p: [] }, t2: { b: [], p: ["Ling"] }, phase: "pick1", turn: 1 };
    const c = draftCoach(d, heroes, []);
    expect(c.phase).toBe("pick");
    const khufra = c.picks.find((p) => p.n === "Khufra");
    expect(khufra).toBeTruthy();
    expect(khufra.reason).toMatch(/counters Ling/);
  });

  it("flags heroes countered by the enemy in avoid", () => {
    const d = { t1: { b: [], p: [] }, t2: { b: [], p: ["Ling"] }, phase: "pick1", turn: 1 };
    const c = draftCoach(d, heroes, []);
    expect(c.avoid.some((a) => a.n === "Pharsa")).toBe(true); // Pharsa.c includes Ling
  });

  it("detects counters via the ENEMY's weakness data too (bidirectional)", () => {
    // Saber is weak to Khufra (Saber.c includes Khufra); enemy picked Saber.
    const hs = [...heroes, H("Saber", "Assassin", "S", 51, 41, { c: ["Khufra"] })];
    const d = { t1: { b: [], p: [] }, t2: { b: [], p: ["Saber"] }, phase: "pick1", turn: 1 };
    const c = draftCoach(d, hs, []);
    const khufra = c.picks.find((p) => p.n === "Khufra");
    expect(khufra.reason).toMatch(/counters Saber/);
  });

  it("never recommends data-pending heroes", () => {
    const hs = [...heroes, H("NewHero", "Mage", "?", 0, 0, { pending: true })];
    const d = { t1: { b: [], p: [] }, t2: { b: [], p: [] }, phase: "pick1", turn: 1 };
    const c = draftCoach(d, hs, ["NewHero"]);
    expect(c.picks.some((p) => p.n === "NewHero")).toBe(false);
  });

  it("boosts the user's favorites", () => {
    const d = { t1: { b: [], p: [] }, t2: { b: [], p: [] }, phase: "pick1", turn: 1 };
    const c = draftCoach(d, heroes, ["Khufra"]);
    const khufra = c.picks.find((p) => p.n === "Khufra");
    expect(khufra).toBeTruthy();
    expect(khufra.reason).toMatch(/favorite/);
  });
});
