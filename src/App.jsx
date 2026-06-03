import { useState, useEffect, useMemo } from "react";
import { P } from "./theme/palette.js";
import { s } from "./theme/styles.js";
import { getHeroes, getMeta } from "./data/index.js";
import { getJSON, setJSON } from "./services/storage.js";
import { emptyDraft, selectHero } from "./features/draft/draftLogic.js";
import { HeroDetail } from "./components/HeroDetail.jsx";

import { MetaView } from "./features/meta/MetaView.jsx";
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

const TABS = ["Meta", "Heroes", "Tiers", "Items", "Counter", "Teams", "Spells", "Jungle", "Roam", "Macro", "Compare", "Emblems", "Pro Picks", "Glossary", "Learn", "My Stats", "Build", "Draft"];

export default function App() {
  const [tab, setTab] = useState("Meta");
  const [sel, setSel] = useState(null);
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
  // Draft
  const [draft, setDraft] = useState(emptyDraft()); const [dQ, setDQ] = useState("");

  useEffect(() => {
    (async () => {
      setTracker(await getJSON("mlbb-tracker", []));
      setSavedBuilds(await getJSON("mlbb-builds", []));
    })();
  }, []);

  const saveTracker = (next) => { setTracker(next); setJSON("mlbb-tracker", next); };
  const saveBuilds = (next) => { setSavedBuilds(next); setJSON("mlbb-builds", next); };
  const onSelectHero = (h) => setSel(h);
  const onDraftSelect = (name) => setDraft((d) => selectHero(d, name));
  const onDraftReset = () => { setDraft(emptyDraft()); setDQ(""); };

  const view = useMemo(() => {
    switch (tab) {
      case "Meta": return <MetaView onSelectHero={onSelectHero} />;
      case "Heroes": return <HeroesView {...{ q, setQ, rF, setRF, tF, setTF, onSelectHero }} />;
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
      case "Build": return <BuildView {...{ bS, setBS, bC, setBC, savedBuilds, saveBuilds, buildName, setBuildName }} />;
      case "Draft": return <DraftView {...{ draft, onSelect: onDraftSelect, onReset: onDraftReset, dQ, setDQ }} />;
      default: return null;
    }
  }, [tab, q, rF, tF, cQ, cmpA, cmpB, iC, bS, bC, buildName, glsCat, tracker, tkHero, tkResult, savedBuilds, draft, dQ]);

  // Hero detail is a full-page takeover.
  if (sel) {
    return <HeroDetail hero={sel} onClose={() => setSel(null)} onSelectHero={onSelectHero} />;
  }

  const PATCH = getMeta().patch;
  const heroCount = getHeroes().length;

  return (
    <div style={s.root}>
      <div style={s.hdr}>
        <div style={s.glow} />
        <div style={s.title}>MOBILE LEGENDS: BANG BANG</div>
        <div style={s.sub}>{heroCount} Heroes · Patch {PATCH.v} · Season {PATCH.s}</div>
      </div>
      <div style={s.tbs}>{TABS.map(t => <button key={t} style={s.tb(tab === t)} onClick={() => setTab(t)}>{t}</button>)}</div>
      <div style={s.ct}>{view}</div>
      <div style={{ textAlign: "center", padding: "16px 12px 24px", fontSize: 9, color: P.t3, borderTop: `1px solid ${P.brd}` }}>MLBB Pro Guide · {heroCount} Heroes · Patch {PATCH.v} · S{PATCH.s} · Not affiliated with Moonton</div>
    </div>
  );
}
