import { describe, it, expect } from "vitest";
import { getHeroes, getHeroByName, getItems, getMeta, getSpells } from "../src/data/index.js";

describe("data API", () => {
  it("returns the full hero roster", () => {
    expect(getHeroes().length).toBeGreaterThanOrEqual(100);
  });
  it("finds a hero by name case-insensitively", () => {
    expect(getHeroByName("tigreal")?.n).toBe("Tigreal");
  });
  it("returns null for unknown hero", () => {
    expect(getHeroByName("nobody")).toBeNull();
  });
  it("exposes items keyed by category", () => {
    expect(Object.keys(getItems())).toContain("Attack");
  });
  it("exposes meta with patch info", () => {
    expect(getMeta().patch.v).toBeTruthy();
  });
  it("exposes spells", () => {
    expect(getSpells().length).toBeGreaterThan(0);
  });
});
