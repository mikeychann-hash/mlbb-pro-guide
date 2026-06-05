import { describe, it, expect } from "vitest";
import { playNowPlan } from "../src/features/playnow/playNow.js";

const H = (n, o = {}) => ({ n, r: o.r || "Fighter", t: o.t || "A", wr: o.wr ?? 50, l: o.l || "EXP", pending: o.pending || false });

describe("playNowPlan", () => {
  const heroes = [
    H("MetaKing", { t: "S+", wr: 54 }),
    H("MyComfort", { t: "B", wr: 49 }),
    H("MyTrap", { t: "A", wr: 51 }),
    H("FavHero", { t: "A", wr: 50 }),
  ];

  it("excludes pending heroes", () => {
    const r = playNowPlan([...heroes, H("WIP", { pending: true })], [], []);
    expect(r.list.some((x) => x.n === "WIP")).toBe(false);
  });

  it("ranks a proven comfort hero above raw meta", () => {
    const tracker = Array.from({ length: 6 }, () => ({ hero: "MyComfort", result: "Win" }));
    const r = playNowPlan(heroes, tracker, []);
    expect(r.list[0].n).toBe("MyComfort");
    expect(r.list[0].tag).toBe("Comfort");
    expect(r.comfort.n).toBe("MyComfort");
  });

  it("tags and demotes heroes you keep losing on", () => {
    const tracker = Array.from({ length: 5 }, () => ({ hero: "MyTrap", result: "Loss" }));
    const r = playNowPlan(heroes, tracker, []);
    const trap = r.list.find((x) => x.n === "MyTrap");
    expect(trap.tag).toBe("Struggling");
    // a struggling A-tier should not outrank an untouched S+ meta pick
    const meta = r.list.find((x) => x.n === "MetaKing");
    expect(meta.score).toBeGreaterThan(trap.score);
  });

  it("counts MVP as a win in personal WR", () => {
    const tracker = [
      { hero: "MyComfort", result: "MVP" }, { hero: "MyComfort", result: "MVP" },
      { hero: "MyComfort", result: "Win" }, { hero: "MyComfort", result: "Loss" },
    ];
    const c = playNowPlan(heroes, tracker, []).list.find((x) => x.n === "MyComfort");
    expect(c.pWR).toBe(75); // 3 of 4
    expect(c.tag).toBe("Comfort");
  });

  it("does not tag a 54.5% record (6W/5L) as Comfort due to rounding", () => {
    const tracker = [
      ...Array.from({ length: 6 }, () => ({ hero: "MyTrap", result: "Win" })),
      ...Array.from({ length: 5 }, () => ({ hero: "MyTrap", result: "Loss" })),
    ];
    const t = playNowPlan(heroes, tracker, []).list.find((x) => x.n === "MyTrap");
    expect(t.pWR).toBe(55); // display rounds up
    expect(t.tag).not.toBe("Comfort"); // but the unrounded 54.5% must not qualify
  });

  it("keeps a struggling favorite below untouched meta", () => {
    const tracker = Array.from({ length: 5 }, () => ({ hero: "FavHero", result: "Loss" }));
    const r = playNowPlan(heroes, tracker, ["FavHero"]);
    const fav = r.list.find((x) => x.n === "FavHero");
    const meta = r.list.find((x) => x.n === "MetaKing");
    expect(fav.tag).toBe("Struggling");
    expect(meta.score).toBeGreaterThan(fav.score);
  });

  it("boosts favorites and tags them", () => {
    const r = playNowPlan(heroes, [], ["FavHero"]);
    const fav = r.list.find((x) => x.n === "FavHero");
    expect(fav.tag).toBe("Favorite");
  });

  it("filters by lane", () => {
    const r = playNowPlan([H("A", { l: "Mid" }), H("B", { l: "Gold" })], [], [], { lane: "Mid" });
    expect(r.list.map((x) => x.n)).toEqual(["A"]);
  });

  it("reports whether any history exists", () => {
    expect(playNowPlan(heroes, [], []).hasHistory).toBe(false);
    expect(playNowPlan(heroes, [{ hero: "MetaKing", result: "Win" }], []).hasHistory).toBe(true);
  });
});
