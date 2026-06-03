import { describe, it, expect } from "vitest";
import { emptyDraft, selectHero } from "../src/features/draft/draftLogic.js";

describe("draft state machine", () => {
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
