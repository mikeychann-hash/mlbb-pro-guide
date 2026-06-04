import { describe, it, expect } from "vitest";
import { climbPlan } from "../src/features/climb/climbPlan.js";

const H = (n, l, t, wr, br) => ({ n, r: "Fighter", l, t, wr, br });
const heroes = [
  H("Sora", "EXP", "S+", 52, 22),
  H("Arlott", "EXP", "S", 51, 9),
  H("Aulus", "EXP", "C", 48.9, 0),
  H("Pharsa", "Mid", "S", 51.9, 6),
  H("Cyclops", "Mid", "C", 49.2, 0),
];

describe("climbPlan", () => {
  it("limits the pool to the chosen lanes", () => {
    const p = climbPlan(heroes, ["Mid"], []);
    expect(p.count).toBe(2);
  });
  it("puts favorited heroes in mains (strongest first)", () => {
    const p = climbPlan(heroes, ["EXP"], ["Arlott", "Sora"]);
    expect(p.mains.map((h) => h.n)).toEqual(["Sora", "Arlott"]); // sorted by tier
  });
  it("recommends top-tier non-favorites to learn", () => {
    const p = climbPlan(heroes, ["EXP"], []);
    expect(p.learn.map((h) => h.n)).toContain("Sora");
  });
  it("flags ban threats and weak-tier avoids", () => {
    const p = climbPlan(heroes, ["EXP"], []);
    expect(p.banThreats[0].n).toBe("Sora"); // 22% ban
    expect(p.avoid.map((h) => h.n)).toContain("Aulus"); // C tier
  });
  it("empty lanes = whole roster", () => {
    expect(climbPlan(heroes, [], []).count).toBe(5);
  });
});
