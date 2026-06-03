import { describe, it, expect } from "vitest";
import { computeDiff, buildChangeMap, TIER_ORDER } from "../src/services/diffEngine.js";

const H = (n, wr, t = "A", extra = {}) => ({ n, wr, t, ...extra });

describe("computeDiff", () => {
  it("detects new and removed heroes", () => {
    const prev = [H("A", 50), H("B", 50)];
    const curr = [H("A", 50), H("C", 50)];
    const d = computeDiff(prev, curr);
    expect(d.newHeroes).toEqual(["C"]);
    expect(d.removed).toEqual(["B"]);
  });
  it("detects buffs and nerfs by win rate", () => {
    const prev = [H("A", 50.0), H("B", 52.0)];
    const curr = [H("A", 51.0), H("B", 51.0)];
    const d = computeDiff(prev, curr);
    expect(d.buffed.map((x) => x.n)).toContain("A");
    expect(d.nerfed.map((x) => x.n)).toContain("B");
  });
  it("detects tier changes", () => {
    const prev = [H("A", 50, "B")];
    const curr = [H("A", 50, "S")];
    const d = computeDiff(prev, curr);
    expect(d.tierUp.map((x) => x.n)).toContain("A");
  });
  it("ignores tiny win-rate noise below threshold", () => {
    const prev = [H("A", 50.0)];
    const curr = [H("A", 50.1)];
    const d = computeDiff(prev, curr);
    expect(d.buffed).toEqual([]);
  });
});

describe("buildChangeMap", () => {
  it("marks new (pending) heroes and trends", () => {
    const prev = [H("A", 50.0)];
    const curr = [H("A", 51.0), H("Z", 0, "?", { pending: true })];
    const map = buildChangeMap(computeDiff(prev, curr), curr);
    expect(map.Z.isNew).toBe(true);
    expect(map.A.trend).toBe("up");
  });
});

describe("TIER_ORDER", () => {
  it("ranks S+ above C", () => {
    expect(TIER_ORDER["S+"]).toBeGreaterThan(TIER_ORDER["C"]);
  });
});
