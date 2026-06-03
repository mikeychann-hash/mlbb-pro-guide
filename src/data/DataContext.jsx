import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { BUNDLED_DATA } from "./bundled.js";
import { syncData } from "../services/dataSync.js";
import { computeDiff, buildChangeMap } from "../services/diffEngine.js";
import { getJSON, setJSON } from "../services/storage.js";

const DataCtx = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(BUNDLED_DATA);
  const [status, setStatus] = useState("idle"); // idle | syncing | ok | error
  const [error, setError] = useState(null);
  const [diff, setDiff] = useState(null);
  const [changes, setChanges] = useState({});

  const refresh = useCallback(async () => {
    setStatus("syncing");
    const res = await syncData();
    setData(res.data);
    setError(res.error);
    setStatus(res.error && res.data.source === "bundled" ? "error" : "ok");

    const currentHeroes = res.data.heroes;
    const seen = await getJSON("mlbb-seen", null);
    if (seen && seen.generatedAt !== res.data.generatedAt) {
      const d = computeDiff(seen.heroes, currentHeroes);
      setDiff(d);
      setChanges(buildChangeMap(d, currentHeroes));
    } else if (!seen) {
      // First launch: establish a baseline silently, but still flag any
      // pending (brand-new) heroes as NEW.
      const d = computeDiff(currentHeroes, currentHeroes);
      setDiff(d);
      setChanges(buildChangeMap(d, currentHeroes));
    }
    await setJSON("mlbb-seen", {
      generatedAt: res.data.generatedAt,
      heroes: currentHeroes.map((h) => ({ n: h.n, wr: h.wr, t: h.t, pending: !!h.pending })),
    });
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Same-named getters as src/data/index.js, bound to the live dataset, so views
  // only swap their import + add one destructure line.
  const value = {
    data,
    status,
    error,
    lastUpdated: data.generatedAt || null,
    source: data.source,
    refresh,
    diff,
    changes,
    getChange: (name) => changes[name] || null,
    getHeroes: () => data.heroes,
    getHeroByName: (name) => {
      if (!name) return null;
      const q = name.toLowerCase();
      return data.heroes.find((h) => h.n.toLowerCase() === q) || null;
    },
    getItems: () => data.items,
    getSpells: () => data.spells,
    getMeta: () => data.meta,
    getJungle: () => data.jungle,
    getProPicks: () => data.propicks,
    getGlossary: () => data.glossary,
    getLearnPath: () => data.learn,
    getEmblems: () => data.emblems,
    getRoam: () => data.roam,
    getMacro: () => data.macro,
  };
  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

export function useData() {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
