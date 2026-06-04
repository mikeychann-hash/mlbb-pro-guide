import { describe, it, expect } from "vitest";
import { buildSets } from "../src/features/heroes/buildSets.js";

const phys = { n: "Lancelot", r: "Assassin", r2: "", b: ["Warrior Boots", "Blade of Despair", "Endless Battle", "Hunter Strike", "Malefic Roar", "Immortality"] };
const mage = { n: "Pharsa", r: "Mage", r2: "", b: ["Arcane Boots", "Clock of Destiny", "Lightning Truncheon", "Holy Crystal", "Genius Wand", "Blood Wings"] };

describe("buildSets", () => {
  it("returns [] for a hero with no build", () => {
    expect(buildSets({ n: "X", r: "Fighter", b: [] })).toEqual([]);
  });
  it("always includes a Core set equal to the hero build", () => {
    const sets = buildSets(phys);
    expect(sets[0].name).toBe("Core");
    expect(sets[0].items).toEqual(phys.b);
  });
  it("offers multiple situational sets", () => {
    expect(buildSets(phys).length).toBeGreaterThanOrEqual(4);
  });
  it("uses physical anti-heal/pen for physical heroes", () => {
    const sets = buildSets(phys);
    expect(sets.find((s) => s.name === "vs Sustain").items).toContain("Sea Halberd");
  });
  it("uses magic pen/anti-heal for mages", () => {
    const sets = buildSets(mage);
    expect(sets.find((s) => s.name === "vs Tanks").items).toContain("Divine Glaive");
    expect(sets.find((s) => s.name === "vs Sustain").items).toContain("Necklace of Durance");
  });
});
