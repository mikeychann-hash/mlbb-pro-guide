import { describe, it, expect } from "vitest";
import { tc, rc, ri, P } from "../src/theme/palette.js";

describe("theme helpers", () => {
  it("maps tiers to colors", () => {
    expect(tc("S+")).toBe("#ff4d6a");
    expect(tc("unknown")).toBe(P.t3);
  });
  it("maps roles to colors and icons", () => {
    expect(rc("Mage")).toBe(P.purp);
    expect(ri("Tank")).toBe("🛡️");
    expect(ri("???")).toBe("❓");
  });
});
