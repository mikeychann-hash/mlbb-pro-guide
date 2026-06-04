import { describe, it, expect } from "vitest";
import { buildDataset } from "../scraper/normalize.js";
import { validate } from "../scraper/validate.js";
import { BUNDLED_DATA } from "../src/data/bundled.js";

const seedNames = BUNDLED_DATA.heroes.map((h) => h.n);

describe("buildDataset", () => {
  it("keeps all seed heroes and adds new roster heroes as pending", () => {
    const roster = [...seedNames, "BrandNewHero"];
    const ds = buildDataset({ roster, stats: null, patchNotes: null, now: "2030-01-01T00:00:00Z" });
    expect(ds.heroes.length).toBe(seedNames.length + 1);
    const nu = ds.heroes.find((h) => h.n === "BrandNewHero");
    expect(nu.pending).toBe(true);
    expect(ds.generatedAt).toBe("2030-01-01T00:00:00Z");
    expect(ds.source).toBe("scraped");
  });
  it("with null roster falls back to seed heroes only", () => {
    const ds = buildDataset({ roster: null, stats: null, patchNotes: null, now: "2030-01-01T00:00:00Z" });
    expect(ds.heroes.length).toBe(seedNames.length);
  });
  it("applies stats overrides when provided", () => {
    const ds = buildDataset({ roster: seedNames, stats: { Tigreal: { wr: 99, tier: "S+" } }, patchNotes: null, now: "2030-01-01T00:00:00Z" });
    expect(ds.heroes.find((h) => h.n === "Tigreal").wr).toBe(99);
  });
  it("rejects out-of-range rates and applies valid ones (no '123.1% ban rate')", () => {
    const ds = buildDataset({ roster: seedNames, stats: { Tigreal: { wr: 52.3, pr: 45, br: 123.1 } }, patchNotes: null, now: "2030-01-01T00:00:00Z" });
    const t = ds.heroes.find((h) => h.n === "Tigreal");
    expect(t.wr).toBe(52.3); // valid → applied
    expect(t.pr).toBe(45);   // valid → applied
    expect(t.br).not.toBe(123.1); // impossible ban rate → dropped, seed value kept
  });
});

describe("validate", () => {
  it("passes a complete dataset", () => {
    const ds = buildDataset({ roster: seedNames, stats: null, patchNotes: null, now: "2030-01-01T00:00:00Z" });
    expect(validate(ds).ok).toBe(true);
  });
  it("fails when too few heroes", () => {
    expect(validate({ heroes: [], patch: { v: "x" } }).ok).toBe(false);
  });
});
