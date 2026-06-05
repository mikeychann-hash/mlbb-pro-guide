import { describe, it, expect } from "vitest";
import { emptyDraft, selectHero, undoDraft, stepInfo, DRAFT_MODES } from "../src/features/draft/draftLogic.js";

const run = (d, names) => { names.split("").forEach((n) => { d = selectHero(d, n); }); return d; };

describe("draft state machine", () => {
  it("defaults to the standard 3-bans-per-team format", () => {
    const d = emptyDraft();
    expect(d.mode).toBe("standard");
    expect(d.phase).toBe("ban1");
    expect(d.turn).toBe(1);
    expect(DRAFT_MODES).toEqual(expect.arrayContaining(["standard", "mythic"]));
  });

  it("standard: 6 bans (3 each), then the 1-2-2-1-1-2 snake picks", () => {
    let d = run(emptyDraft(), "ABCDEF"); // 6 bans
    expect(d.t1.b).toEqual(["A", "C", "E"]);
    expect(d.t2.b).toEqual(["B", "D", "F"]);
    expect(d.phase).toBe("pick1");
    d = run(d, "GHIJKL"); // 6 picks: B R R B B R
    expect(d.t1.p).toEqual(["G", "J", "K"]);
    expect(d.t2.p).toEqual(["H", "I", "L"]);
  });

  it("standard: reaches done after 6 bans + 10 picks (16 steps)", () => {
    let d = emptyDraft();
    for (let i = 0; i < 16; i++) d = selectHero(d, "H" + i);
    expect(d.phase).toBe("done");
    expect(d.t1.b.length + d.t2.b.length).toBe(6);
    expect(d.t1.p.length + d.t2.p.length).toBe(10);
    // extra selects after done are no-ops
    expect(selectHero(d, "extra")).toBe(d);
  });

  it("mythic: 10 bans (5 each) split into two phases + 10 picks (20 steps)", () => {
    let d = emptyDraft("mythic");
    expect(d.mode).toBe("mythic");
    for (let i = 0; i < 20; i++) d = selectHero(d, "M" + i);
    expect(d.phase).toBe("done");
    expect(d.t1.b.length + d.t2.b.length).toBe(10);
    expect(d.t1.p.length + d.t2.p.length).toBe(10);
  });

  it("mythic: second ban phase starts after the first 6 picks (Red first)", () => {
    let d = emptyDraft("mythic");
    for (let i = 0; i < 12; i++) d = selectHero(d, "x" + i); // 6 bans + 6 picks
    expect(d.phase).toBe("ban2");
    expect(d.turn).toBe(2); // Red bans first in phase 2
  });

  it("undo reverses the last action and preserves mode", () => {
    let d = selectHero(emptyDraft("mythic"), "Sora");
    expect(d.t1.b).toEqual(["Sora"]);
    d = undoDraft(d);
    expect(d.t1.b).toEqual([]);
    expect(d.step).toBe(0);
    expect(d.mode).toBe("mythic");
    expect(undoDraft(emptyDraft()).step).toBe(0); // undo at start is a no-op
  });

  it("rejects duplicate picks regardless of case", () => {
    let d = selectHero(emptyDraft(), "Fanny");
    d = selectHero(d, "fanny"); // duplicate, different case
    expect(d.t1.b).toEqual(["Fanny"]);
    expect(d.step).toBe(1);
  });

  it("stepInfo reports per-phase progress (Ban 1/6 standard, 1/4 in mythic ban2)", () => {
    expect(stepInfo(emptyDraft())).toEqual({ action: "ban", index: 1, total: 6 });
    let d = emptyDraft("mythic");
    for (let i = 0; i < 12; i++) d = selectHero(d, "y" + i); // into ban2
    expect(stepInfo(d)).toEqual({ action: "ban", index: 1, total: 4 });
  });

  it("mythic follows the exact action/team order across all 20 steps", () => {
    const expected = [
      ["ban", 1], ["ban", 2], ["ban", 1], ["ban", 2], ["ban", 1], ["ban", 2],
      ["pick", 1], ["pick", 2], ["pick", 2], ["pick", 1], ["pick", 1], ["pick", 2],
      ["ban", 2], ["ban", 1], ["ban", 2], ["ban", 1],
      ["pick", 2], ["pick", 1], ["pick", 1], ["pick", 2],
    ];
    let d = emptyDraft("mythic");
    for (const [action, team] of expected) {
      const si = stepInfo(d);
      expect([si.action, d.turn]).toEqual([action, team]);
      d = selectHero(d, action[0] + d.step);
    }
    expect(d.phase).toBe("done");
  });

  it("falls back to standard for an unknown/corrupt mode without crashing", () => {
    let d = selectHero({ ...emptyDraft(), mode: "bogus" }, "Sora");
    expect(d.mode).toBe("standard");
    expect(d.t1.b).toEqual(["Sora"]);
    expect(() => undoDraft({ ...emptyDraft(), mode: "bogus", step: 99 })).not.toThrow();
  });

  it("stepInfo is null at done and undo-from-done steps back into picks", () => {
    let d = emptyDraft();
    for (let i = 0; i < 16; i++) d = selectHero(d, "z" + i); // standard complete
    expect(stepInfo(d)).toBe(null);
    d = undoDraft(d);
    expect(d.phase).toBe("pick1");
    expect(stepInfo(d)).toEqual({ action: "pick", index: 10, total: 10 });
  });
});
