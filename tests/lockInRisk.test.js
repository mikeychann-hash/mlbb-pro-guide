import { describe, it, expect } from "vitest";
import { lockInRisk } from "../src/features/lockin/lockInRisk.js";

const H = (n, o = {}) => ({ n, r: o.r || "Fighter", t: o.t || "A", wr: o.wr ?? 50, l: o.l || "EXP", c: o.c || [], s: o.s || [], sy: o.sy || [] });

describe("lockInRisk", () => {
  it("returns null without a hero", () => {
    expect(lockInRisk(null, [], [])).toBe(null);
  });

  it("says Safe to lock when nothing counters the pick", () => {
    const r = lockInRisk(H("Sora", { s: ["Esmeralda"] }), [H("Esmeralda")], []);
    expect(r.verdict).toBe("Safe to lock");
    expect(r.tone).toBe("good");
    expect(r.youBeat).toContain("Esmeralda");
  });

  it("flags Risky when two enemies counter the pick", () => {
    const pick = H("Layla", { r: "Marksman", c: ["Lancelot", "Saber"] });
    const r = lockInRisk(pick, [H("Lancelot"), H("Saber")], []);
    expect(r.verdict).toMatch(/Risky/);
    expect(r.tone).toBe("bad");
    expect(r.counteredBy).toEqual(expect.arrayContaining(["Lancelot", "Saber"]));
  });

  it("warns Playable on a single counter", () => {
    const r = lockInRisk(H("Ling", { c: ["Khufra"] }), [H("Khufra")], []);
    expect(r.verdict).toMatch(/Playable/);
    expect(r.tone).toBe("warn");
  });

  it("detects a lane clash with your own team", () => {
    const r = lockInRisk(H("Fanny", { l: "Jungle" }), [], [H("Ling", { l: "Jungle" })]);
    expect(r.verdict).toMatch(/Lane clash/);
    expect(r.laneClash).toContain("Ling");
    expect(r.tone).toBe("bad");
  });

  it("calls out both lane clash and counters when both apply", () => {
    const pick = H("Ling", { l: "Jungle", c: ["Khufra", "Saber"] });
    const r = lockInRisk(pick, [H("Khufra"), H("Saber")], [H("Hayabusa", { l: "Jungle" })]);
    expect(r.verdict).toMatch(/Lane clash \+ countered/);
    expect(r.counteredBy.length).toBe(2);
    expect(r.laneClash).toContain("Hayabusa");
  });

  it("surfaces synergy with allies", () => {
    const r = lockInRisk(H("Pharsa", { sy: ["Tigreal"] }), [], [H("Tigreal", { l: "Roam" })]);
    expect(r.synergy).toContain("Tigreal");
    expect(r.advice.join(" ")).toMatch(/Synergy/);
  });
});
