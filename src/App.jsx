import { useState, useEffect, useMemo } from "react";
import { P } from "./theme/palette.js";
import { s } from "./theme/styles.js";
import { useData } from "./data/DataContext.jsx";
import { getJSON, setJSON } from "./services/storage.js";
import { initPush } from "./services/notify.js";
import { emptyDraft, selectHero } from "./features/draft/draftLogic.js";
import { HeroDetail } from "./components/HeroDetail.jsx";

import { MetaView } from "./features/meta/MetaView.jsx";
import { UpdatesView } from "./features/updates/UpdatesView.jsx";
import { HeroesView } from "./features/heroes/HeroesView.jsx";
import { TiersView } from "./features/tiers/TiersView.jsx";
import { ItemsView } from "./features/items/ItemsView.jsx";
import { CounterView } from "./features/counter/CounterView.jsx";
import { TeamsView } from "./features/teams/TeamsView.jsx";
import { SpellsView } from "./features/spells/SpellsView.jsx";
import { JungleView } from "./features/jungle/JungleView.jsx";
import { RoamView } from "./features/roam/RoamView.jsx";
import { MacroView } from "./features/macro/MacroView.jsx";
import { CompareView } from "./features/compare/CompareView.jsx";
import { EmblemsView } from "./features/emblems/EmblemsView.jsx";
import { ProPicksView } from "./features/propicks/ProPicksView.jsx";
import { GlossaryView } from "./features/glossary/GlossaryView.jsx";
import { LearnView } from "./features/learn/LearnView.jsx";
import { MyStatsView } from "./features/mystats/MyStatsView.jsx";
import { BuildView } from "./features/build/BuildView.jsx";
import { DraftView } from "./features/draft/DraftView.jsx";
import { ClimbView } from "./features/climb/ClimbView.jsx";

const GROUPS = [
  { name: "Meta", tabs: ["Meta", "Updates", "Tiers", "Pro Picks"] },
  { name: "Heroes", tabs: ["Heroes", "Counter", "Compare"] },
  { name: "Loadout", tabs: ["Build", "Items", "Emblems", "Spells", "Draft"] },
  { name: "Guides", tabs: ["Jungle", "Roam", "Macro", "Teams", "Learn", "Glossary"] },
  { name: "You", tabs: ["My Stats", "Climb"] },
];
const groupOf = (tab) => (GROUPS.find((g) => g.tabs.includes(tab)) || GROUPS[0]).name;

function agoLabel(iso) {
  if (!iso) return "bundled data";
  const diff = Date.now() - Date.parse(iso);
  if (Number.isNaN(diff)) return "bundled data";
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

export default function App() {
  const { getHeroes, getMeta, status, lastUpdated, source, refresh, syncMsg } = useData();
  const [tab, setTab] = useState("Meta");
  const [group, setGroup] = useState("Meta");
  const [sel, setSel] = useState(null);

  const selectGroup = (name) => {
    setGroup(name);
    const g = GROUPS.find((x) => x.name === name);
    if (g && !g.tabs.includes(tab)) setTab(g.tabs[0]);
  };
  // Heroes filters
  const [q, setQ] = useState(""); const [rF, setRF] = useState("All"); const [tF, setTF] = useState("All");
  // Counter / Compare
  const [cQ, setCQ] = useState(""); const [cmpA, setCmpA] = useState(""); const [cmpB, setCmpB] = useState("");
  // Items / Build
  const [iC, setIC] = useState("Attack");
  const [bS, setBS] = useState(Array(6).fill(null)); const [bC, setBC] = useState("Attack"); const [buildName, setBuildName] = useState("");
  // Glossary
  const [glsCat, setGlsCat] = useState("All");
  // Tracker + saved builds (persisted)
  const [tracker, setTracker] = useState([]); const [tkHero, setTkHero] = useState(""); const [tkResult, setTkResult] = useState("Win");
  const [savedBuilds, setSavedBuilds] = useState([]);
  // Favorites (persisted)
  const [favorites, setFavorites] = useState([]);
  // Draft
  const [draft, setDraft] = useState(emptyDraft()); const [dQ, setDQ] = useState("");

  useEffect(() => {
    (async () => {
      setTracker(await getJSON("mlbb-tracker", []));
      setSavedBuilds(await getJSON("mlbb-builds", []));
      setFavorites(await getJSON("mlbb-favorites", []));
      initPush();
    })();
  }, []);

  const saveTracker = (next) => { setTracker(next); setJSON("mlbb-tracker", next); };
  const saveBuilds = (next) => { setSavedBuilds(next); setJSON("mlbb-builds", next); };
  const toggleFav = (name) => {
    setFavorites((cur) => {
      const next = cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name];
      setJSON("mlbb-favorites", next);
      return next;
    });
  };
  const onSelectHero = (h) => setSel(h);
  const onDraftSelect = (name) => setDraft((d) => selectHero(d, name));
  const onDraftReset = () => { setDraft(emptyDraft()); setDQ(""); };

  const view = useMemo(() => {
    switch (tab) {
      case "Meta": return <MetaView onSelectHero={onSelectHero} />;
      case "Updates": return <UpdatesView onSelectHero={onSelectHero} favorites={favorites} />;
      case "Heroes": return <HeroesView {...{ q, setQ, rF, setRF, tF, setTF, onSelectHero, favorites, toggleFav }} />;
      case "Tiers": return <TiersView onSelectHero={onSelectHero} />;
      case "Items": return <ItemsView {...{ iC, setIC }} />;
      case "Counter": return <CounterView {...{ cQ, setCQ }} />;
      case "Teams": return <TeamsView onSelectHero={onSelectHero} />;
      case "Spells": return <SpellsView />;
      case "Jungle": return <JungleView onSelectHero={onSelectHero} />;
      case "Roam": return <RoamView />;
      case "Macro": return <MacroView />;
      case "Compare": return <CompareView {...{ cmpA, setCmpA, cmpB, setCmpB }} />;
      case "Emblems": return <EmblemsView />;
      case "Pro Picks": return <ProPicksView onSelectHero={onSelectHero} />;
      case "Glossary": return <GlossaryView {...{ glsCat, setGlsCat }} />;
      case "Learn": return <LearnView />;
      case "My Stats": return <MyStatsView {...{ tracker, saveTracker, tkHero, setTkHero, tkResult, setTkResult }} />;
      case "Climb": return <ClimbView favorites={favorites} onSelectHero={onSelectHero} />;
      case "Build": return <BuildView {...{ bS, setBS, bC, setBC, savedBuilds, saveBuilds, buildName, setBuildName }} />;
      case "Draft": return <DraftView {...{ draft, onSelect: onDraftSelect, onReset: onDraftReset, dQ, setDQ, favorites }} />;
      default: return null;
    }
  }, [tab, q, rF, tF, cQ, cmpA, cmpB, iC, bS, bC, buildName, glsCat, tracker, tkHero, tkResult, savedBuilds, favorites, draft, dQ]);

  // Hero detail is a full-page takeover.
  if (sel) {
    return <HeroDetail hero={sel} onClose={() => setSel(null)} onSelectHero={onSelectHero} isFav={favorites.includes(sel.n)} onToggleFav={() => toggleFav(sel.n)} />;
  }

  const PATCH = getMeta().patch;
  const heroCount = getHeroes().length;

  const live = source !== "bundled";

  return (
    <div style={s.root}>
      <div style={s.wrap}>
        <div style={s.hdr}>
          <div style={s.glow} />
          <div style={s.title}>MOBILE LEGENDS: BANG BANG</div>
          <div style={s.sub}>{heroCount} Heroes · Patch {PATCH.v} · Season {PATCH.s}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 10, padding: "4px 5px 4px 12px", background: "rgba(17,26,46,.6)", border: `1px solid ${P.brd}`, borderRadius: 999, fontSize: 10, color: P.t2, fontWeight: 600 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: syncMsg ? (syncMsg.startsWith("⚠") ? P.gold : P.nG) : P.t2 }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: live ? P.nG : P.gold, boxShadow: `0 0 8px ${live ? P.nG : P.gold}` }} />
              {syncMsg ? syncMsg : `${live ? "LIVE" : "BUNDLED"} · ${agoLabel(lastUpdated)}`}
            </span>
            <button onClick={refresh} disabled={status === "syncing"} style={{ background: status === "syncing" ? "transparent" : `${P.neon}1a`, border: `1px solid ${P.neon}55`, borderRadius: 999, color: P.neon, fontSize: 10, fontWeight: 700, padding: "3px 11px", cursor: "pointer", fontFamily: "'Oxanium',sans-serif", letterSpacing: .3 }}>
              {status === "syncing" ? "SYNCING…" : "↻ REFRESH"}
            </button>
          </div>
        </div>
        <div style={s.navShell}>
          <div style={s.gtabs} role="tablist" aria-label="Sections">
            {GROUPS.map(g => <button key={g.name} type="button" role="tab" aria-selected={group === g.name} style={s.gtab(group === g.name)} onClick={() => selectGroup(g.name)}>{g.name}</button>)}
          </div>
          <div style={s.stabs} role="tablist" aria-label={`${group} tabs`}>
            {(GROUPS.find(g => g.name === group) || GROUPS[0]).tabs.map(t => <button key={t} type="button" role="tab" aria-selected={tab === t} style={s.tb(tab === t)} onClick={() => setTab(t)}>{t}</button>)}
          </div>
        </div>
        <div key={tab} className="view-enter" style={s.ct}>{view}</div>
        <div style={{ textAlign: "center", padding: "18px 12px 26px", fontSize: 9.5, color: P.t3, letterSpacing: .5, borderTop: `1px solid ${P.brd}` }}>MLBB PRO GUIDE · {heroCount} HEROES · PATCH {PATCH.v} · S{PATCH.s} · Not affiliated with Moonton</div>
      </div>
    </div>
  );
}
