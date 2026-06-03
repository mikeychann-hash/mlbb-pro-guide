import { describe, it, expect, beforeEach } from "vitest";
import { pickNewest, syncData } from "../src/services/dataSync.js";
import { BUNDLED_DATA } from "../src/data/bundled.js";

describe("pickNewest", () => {
  it("prefers the dataset with the later generatedAt", () => {
    const a = { generatedAt: "2026-01-01T00:00:00Z", source: "a" };
    const b = { generatedAt: "2026-02-01T00:00:00Z", source: "b" };
    expect(pickNewest(a, b).source).toBe("b");
  });
  it("treats null generatedAt (bundled) as oldest", () => {
    const remote = { generatedAt: "2026-01-01T00:00:00Z", source: "remote" };
    expect(pickNewest(BUNDLED_DATA, remote).source).toBe("remote");
  });
  it("returns the only non-null candidate", () => {
    expect(pickNewest(BUNDLED_DATA, null).source).toBe("bundled");
  });
});

describe("syncData", () => {
  beforeEach(() => localStorage.clear());
  it("falls back to bundled when fetch fails and no cache", async () => {
    const res = await syncData({ fetchImpl: () => Promise.reject(new Error("offline")) });
    expect(res.data.source).toBe("bundled");
    expect(res.error).toBeTruthy();
  });
  it("uses and caches remote data when newer", async () => {
    const remote = { ...BUNDLED_DATA, generatedAt: "2030-01-01T00:00:00Z", source: "remote" };
    const fetchImpl = () => Promise.resolve({ ok: true, json: () => Promise.resolve(remote) });
    const res = await syncData({ fetchImpl });
    expect(res.data.source).toBe("remote");
    expect(JSON.parse(localStorage.getItem("mlbb-data")).source).toBe("remote");
  });
});
