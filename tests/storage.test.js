import { describe, it, expect, beforeEach } from "vitest";
import { getJSON, setJSON } from "../src/services/storage.js";

describe("storage adapter", () => {
  beforeEach(() => localStorage.clear());

  it("returns fallback when key is missing", async () => {
    expect(await getJSON("missing", [])).toEqual([]);
  });

  it("round-trips a JSON value", async () => {
    await setJSON("k", [{ a: 1 }]);
    expect(await getJSON("k", null)).toEqual([{ a: 1 }]);
  });

  it("returns fallback on corrupt JSON", async () => {
    localStorage.setItem("bad", "{not json");
    expect(await getJSON("bad", "fb")).toBe("fb");
  });
});
