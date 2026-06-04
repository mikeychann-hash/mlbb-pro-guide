import { describe, it, expect } from "vitest";
import { emptyDraft, selectHero, undoDraft, stepInfo, DRAFT_STEPS } from "../src/features/draft/draftLogic.js";

describe("draft state machine", () => {
  it("uses the real snake order: ban1 alternates B,R then pick1 is B,R,R,B,B,R", () => {
    let d = emptyDraft();
    "ABCDEF".split("").forEach((n) => { d = selectHero(d, n); }); // 6 bans
    expect(d.t1.b).toEqual(["A", "C", "E"]);
    expect(d.t2.b).toEqual(["B", "D", "F"]);
    "GHIJKL".split("").forEach((n) => { d = selectHero(d, n); }); // 6 picks (B R R B B R)
    expect(d.t1.p).toEqual(["G", "J", "K"]);
    expect(d.t2.p).toEqual(["H", "I", "L"]);
  });

  it("undo reverses the last action", () => {
    let d = selectHero(emptyDraft(), "Sora");
    expect(d.t1.b).toEqual(["Sora"]);
    d = undoDraft(d);
    expect(d.t1.b).toEqual([]);
    expect(d.step).toBe(0);
    expect(undoDraft(emptyDraft()).step).toBe(0); // undo at start is a no-op
  });

  it("stepInfo reports progress like Ban 1/6", () => {
    const si = stepInfo(emptyDraft());
    expect(si).toEqual({ action: "ban", index: 1, total: 6 });
    expect(DRAFT_STEPS).toBe(20);
  });

  it("starts in ban1 / team 1", () => {
    const d = emptyDraft();
    expect(d.phase).toBe("ban1");
    expect(d.turn).toBe(1);
    expect(d.t1.b).toEqual([]);
  });

  it("alternates teams during ban1 and transitions to pick1 after 6 bans", () => {
    let d = emptyDraft();
    const names = ["A","B","C","D","E","F"];
    names.forEach((n) => { d = selectHero(d, n); });
    expect(d.t1.b.length + d.t2.b.length).toBe(6);
    expect(d.phase).toBe("pick1");
    expect(d.turn).toBe(1);
  });

  it("reaches done after full ban/pick sequence (10 bans + 10 picks)", () => {
    let d = emptyDraft();
    for (let i = 0; i < 20; i++) d = selectHero(d, "H" + i);
    expect(d.phase).toBe("done");
    expect(d.t1.p.length + d.t2.p.length).toBe(10);
  });
});
