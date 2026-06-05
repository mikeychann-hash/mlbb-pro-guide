import { describe, it, expect } from "vitest";
import { threatRadar } from "../src/features/threats/threatRadar.js";

// Minimal hero fixtures (only the fields the radar reads).
const H = (n, o = {}) => ({ n, r: o.r || "Fighter", r2: o.r2 || "", t: o.t || "A", wr: o.wr ?? 50, br: o.br ?? 0, c: o.c || [], s: o.s || [] });

describe("threatRadar", () => {
  it("returns null with no enemies", () => {
    expect(threatRadar([], [])).toBe(null);
  });

  it("ranks an enemy that counters your heroes above a neutral one", () => {
    const fanny = H("Fanny", { r: "Assassin", t: "S+", wr: 53, s: ["Layla"] });
    const sora = H("Sora", { t: "A", wr: 50 });
    const me = [H("Layla", { r: "Marksman" })];
    const r = threatRadar([sora, fanny], me);
    expect(r.list[0].n).toBe("Fanny"); // counters Layla + assassin + S+ tier
    expect(r.list[0].threatens).toContain("Layla");
    expect(r.banPriority).toBe("Fanny");
  });

  it("lowers threat and flips advice when one of your heroes answers them", () => {
    const ling = H("Ling", { r: "Assassin", t: "S", wr: 52 });
    const noAnswer = threatRadar([ling], []).list[0].score;
    // Khufra counters Ling (Ling countered-by Khufra)
    const ling2 = H("Ling", { r: "Assassin", t: "S", wr: 52, c: ["Khufra"] });
    const answered = threatRadar([ling2], [H("Khufra", { r: "Tank" })]).list[0];
    expect(answered.score).toBeLessThan(noAnswer);
    expect(answered.answeredBy).toContain("Khufra");
    expect(answered.action).toMatch(/Khufra/);
  });

  it("identifies the ally most worth protecting", () => {
    const enemies = [
      H("Lancelot", { r: "Assassin", s: ["Layla"] }),
      H("Saber", { r: "Assassin", s: ["Layla"] }),
    ];
    const me = [H("Layla", { r: "Marksman" }), H("Tigreal", { r: "Tank" })];
    const r = threatRadar(enemies, me);
    expect(r.protect.n).toBe("Layla");
    expect(r.protect.by).toEqual(expect.arrayContaining(["Lancelot", "Saber"]));
  });

  it("never rates an S+ pick as Low even when answered", () => {
    const meta = H("Beatrix", { r: "Marksman", t: "S+", wr: 51, c: ["Tigreal"] });
    const r = threatRadar([meta], [H("Tigreal", { r: "Tank" })]);
    expect(["Critical", "High", "Medium"]).toContain(r.list[0].level);
  });

  it("never produces NaN scores from malformed/missing rates", () => {
    const bad = { n: "Glitch", r: "Mage", r2: "", t: "A", wr: "53%", br: undefined, c: [], s: [] };
    const r = threatRadar([bad, H("Sora")], []);
    expect(r.list.every((x) => Number.isFinite(x.score))).toBe(true);
    expect(["Stacked", "Dangerous", "Even", "Manageable"]).toContain(r.overall);
  });

  it("summarizes overall enemy strength", () => {
    const stacked = threatRadar([H("A", { t: "S+", wr: 55 }), H("B", { t: "S+", wr: 54 })], []);
    expect(["Stacked", "Dangerous"]).toContain(stacked.overall);
  });
});
