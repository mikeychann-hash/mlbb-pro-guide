import { describe, it, expect } from "vitest";
import { matchupPlan } from "../src/features/compare/matchup.js";

const A = { n: "Chou", r: "Fighter", sp: "Kick Isolation", tip: "", c: ["Phoveus"], s: ["Layla"], sp2: ["Flicker", "Purify"] };
const Ling = { n: "Ling", r: "Assassin", sp: "Wall Walker", tip: "Walls = unmatched mobility", c: [], s: ["Chou"] };
const Estes = { n: "Estes", r: "Support", sp: "Fountain Healer", tip: "Best healer", c: [], s: [] };
const Pharsa = { n: "Pharsa", r: "Mage", sp: "Artillery Zone", tip: "", c: [], s: [] };

describe("matchupPlan", () => {
  it("returns null without both heroes", () => {
    expect(matchupPlan(A, null)).toBeNull();
  });
  it("marks a hard matchup when enemy counters you", () => {
    const p = matchupPlan(A, Ling); // Ling.s includes Chou -> Ling beats Chou
    expect(p.tone).toBe("bad");
    expect(p.verdict).toMatch(/Ling counters Chou/);
  });
  it("suggests anti-heal vs a sustain hero", () => {
    const p = matchupPlan(A, Estes);
    expect(p.tips.some((t) => /anti-heal/i.test(t))).toBe(true);
  });
  it("suggests magic defense vs a mage", () => {
    const p = matchupPlan(A, Pharsa);
    expect(p.tips.some((t) => /magic defense/i.test(t))).toBe(true);
  });
  it("always states a win condition", () => {
    const p = matchupPlan(A, Pharsa);
    expect(p.tips.some((t) => /Win condition/i.test(t))).toBe(true);
  });
});
