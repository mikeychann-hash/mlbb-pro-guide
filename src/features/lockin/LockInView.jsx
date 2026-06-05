import { useMemo, useState } from "react";
import { s } from "../../theme/styles.js";
import { P, tc, rc, ri } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";
import { SugBox } from "../../components/SugBox.jsx";
import { Portrait } from "../../components/Portrait.jsx";
import { lockInRisk } from "./lockInRisk.js";

const TONE = { good: P.nG, warn: P.gold, bad: P.red };
const MAX = 5;

export function LockInView({ hero, setHero, enemy, setEnemy, mine, setMine }) {
  const { getHeroByName } = useData();
  const [hq, setHq] = useState("");
  const [eq, setEq] = useState("");
  const [mq, setMq] = useState("");

  const taken = (n) => n === hero || enemy.includes(n) || mine.includes(n);
  const pickHero = (v) => { const h = getHeroByName(v); if (h && !taken(h.n)) { setHero(h.n); setHq(""); } else setHq(v); };
  const addTo = (team, set, setQ) => (v) => { const h = getHeroByName(v); if (h && team.length < MAX && !taken(h.n)) { set([...team, h.n]); setQ(""); } else setQ(v); };
  const rm = (team, set) => (n) => set(team.filter((x) => x !== n));

  const theHero = useMemo(() => getHeroByName(hero), [hero, getHeroByName]);
  const enemyH = useMemo(() => enemy.map(getHeroByName).filter(Boolean), [enemy, getHeroByName]);
  const mineH = useMemo(() => mine.map(getHeroByName).filter(Boolean), [mine, getHeroByName]);
  const risk = useMemo(() => lockInRisk(theHero, enemyH, mineH), [theHero, enemyH, mineH]);

  const Chips = ({ names, color, set }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: names.length ? 7 : 0 }}>
      {names.map((n) => { const h = getHeroByName(n); return (
        <button key={n} type="button" onClick={() => rm(names, set)(n)} style={{ ...s.btnReset, width: "auto", display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px 4px 4px", background: color + "14", border: `1px solid ${color}3a`, borderRadius: 999, color, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          {h ? <Portrait hero={h} size={20} radius={999} /> : <span>{ri("?")}</span>}{n} <span style={{ opacity: .6, fontWeight: 800 }}>×</span>
        </button>); })}
    </div>
  );

  return (
    <>
      <div style={{ fontSize: 11, color: P.t2, marginBottom: 12, lineHeight: 1.5 }}>
        Considering a pick? Add it + the enemy lineup to see if it's <strong style={{ color: P.gold }}>punishable</strong> — lock, swap, or wait.
      </div>

      <div style={{ fontFamily: "'Oxanium',sans-serif", fontSize: 12, fontWeight: 800, color: P.gold, letterSpacing: .5, marginBottom: 5 }}>🎯 CONSIDERING</div>
      {!hero ? <SugBox val={hq} onPick={pickHero} placeholder="Hero you want to pick…" />
        : <Chips names={[hero]} color={P.gold} set={() => setHero("")} />}

      <div style={{ fontFamily: "'Oxanium',sans-serif", fontSize: 12, fontWeight: 800, color: P.red, letterSpacing: .5, margin: "12px 0 5px" }}>🔴 ENEMY TEAM <span style={{ color: P.t3, fontWeight: 600 }}>{enemy.length}/{MAX}</span></div>
      {enemy.length < MAX && <SugBox val={eq} onPick={addTo(enemy, setEnemy, setEq)} placeholder="Add enemy hero…" />}
      <Chips names={enemy} color={P.red} set={setEnemy} />

      <div style={{ fontFamily: "'Oxanium',sans-serif", fontSize: 12, fontWeight: 800, color: P.blue, letterSpacing: .5, margin: "12px 0 5px" }}>🔵 YOUR TEAM <span style={{ color: P.t3, fontWeight: 600 }}>(optional) {mine.length}/{MAX}</span></div>
      {mine.length < MAX && <SugBox val={mq} onPick={addTo(mine, setMine, setMq)} placeholder="Add ally hero…" />}
      <Chips names={mine} color={P.blue} set={setMine} />

      {(hero || enemy.length || mine.length) > 0 && (
        <button type="button" onClick={() => { setHero(""); setEnemy([]); setMine([]); setHq(""); setEq(""); setMq(""); }} style={{ ...s.btnReset, width: "auto", padding: "5px 12px", background: "transparent", border: `1px solid ${P.brd}`, borderRadius: 8, color: P.t3, fontSize: 11, fontWeight: 700, cursor: "pointer", margin: "10px 0" }}>Clear all</button>
      )}

      {!risk ? (
        <div style={{ textAlign: "center", padding: "26px 10px", color: P.t3 }}>
          <div style={{ fontSize: 38, marginBottom: 8 }}>🔒</div>
          <div style={{ fontSize: 13 }}>Choose a hero you're considering to scan the risk.</div>
        </div>
      ) : (
        <div style={{ ...s.cd2, cursor: "default", borderLeft: `4px solid ${TONE[risk.tone]}`, marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {theHero && <Portrait hero={theHero} size={44} radius={10} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: P.t1 }}>{risk.hero}</span>
                {theHero && <span style={s.bg(tc(theHero.t), true)}>{theHero.t}</span>}
                {theHero && <span style={s.bg(rc(theHero.r))}>{ri(theHero.r)} {theHero.r}</span>}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: TONE[risk.tone], marginTop: 3 }}>
                {risk.tone === "good" ? "✅" : risk.tone === "warn" ? "⚠️" : "🛑"} {risk.verdict}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 9, display: "flex", flexDirection: "column", gap: 5 }}>
            {risk.advice.map((a, i) => <div key={i} style={{ fontSize: 11.5, color: P.t2, lineHeight: 1.5 }}>• {a}</div>)}
          </div>
        </div>
      )}
    </>
  );
}
