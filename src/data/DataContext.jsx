import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { BUNDLED_DATA } from "./bundled.js";
import { syncData } from "../services/dataSync.js";

const DataCtx = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(BUNDLED_DATA);
  const [status, setStatus] = useState("idle"); // idle | syncing | ok | error
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setStatus("syncing");
    const res = await syncData();
    setData(res.data);
    setError(res.error);
    setStatus(res.error && res.data.source === "bundled" ? "error" : "ok");
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
