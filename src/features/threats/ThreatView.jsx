import { useMemo, useState } from "react";
import { s } from "../../theme/styles.js";
import { P, tc, rc, ri } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";
import { SugBox } from "../../components/SugBox.jsx";
import { Portrait } from "../../components/Portrait.jsx";
import { threatRadar } from "./threatRadar.js";

const LVL = { Critical: P.red, High: P.gold, Medium: P.neon, Low: P.t3 };
const MAX = 5;

export function ThreatView({ mine, setMine, enemy, setEnemy }) {
  const { getHeroByName } = useData();
  const [mq, setMq] = useState("");
  const [eq, setEq] = useState("");

  const onTeam = (n) => mine.includes(n) || enemy.includes(n);
  const addTo = (team, setTeam, setQ) => (v) => {
    const h = getHeroByName(v);
    if (h && team.length < MAX && !onTeam(h.n)) { setTeam([...team, h.n]); setQ(""); }
    else setQ(v);
  };
  const removeFrom = (team, setTeam) => (n) => setTeam(team.filter((x) => x !== n));

  const myHeroes = useMemo(() => mine.map(getHeroByName).filter(Boolean), [mine, getHeroByName]);
  const enemyHeroes = useMemo(() => enemy.map(getHeroByName).filter(Boolean), [enemy, getHeroByName]);
  const radar = useMemo(() => threatRadar(enemyHeroes, myHeroes), [enemyHeroes, myHeroes]);

  const Team = ({ label, color, names, q, setQ, set, ph }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontFamily: "'Oxanium',sans-serif", fontSize: 12, fontWeight: 800, color, letterSpacing: .5 }}>{label}</span>
        <span style={{ fontSize: 10, color: P.t3 }}>{names.length}/{MAX}</span>
      </div>
      {names.length < MAX && <SugBox val={q} onPick={addTo(names, set, setQ)} placeholder={ph} />}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: names.length ? 7 : 0 }}>
        {names.map((n) => {
          const h = getHeroByName(n);
          return (
            <button key={n} type="button" onClick={() => removeFrom(names, set)(n)} style={{ ...s.btnReset, width: "auto", display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px 4px 4px", background: color + "14", border: `1px solid ${color}3a`, borderRadius: 999, color, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {h ? <Portrait hero={h} size={20} radius={999} /> : <span>{ri("?")}</span>}
              {n} <span style={{ opacity: .6, fontWeight: 800 }}>×</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div style={{ fontSize: 11, color: P.t2, marginBottom: 12, lineHeight: 1.5 }}>
        Add the <strong style={{ color: P.red }}>enemy</strong> lineup (and your team) to see who to <strong style={{ color: P.gold }}>ban, focus, and avoid</strong> — with the one move that handles each threat.
      </div>

      <Team label="🔴 ENEMY TEAM" color={P.red} names={enemy} q={eq} setQ={setEq} set={setEnemy} ph="Add enemy hero…" />
      <Team label="🔵 YOUR TEAM (optional)" color={P.blue} names={mine} q={mq} setQ={setMq} set={setMine} ph="Add your hero…" />

      {(mine.length || enemy.length) > 0 && (
        <button type="button" onClick={() => { setMine([]); setEnemy([]); setMq(""); setEq(""); }} style={{ ...s.btnReset, width: "auto", padding: "5px 12px", background: "transparent", border: `1px solid ${P.brd}`, borderRadius: 8, color: P.t3, fontSize: 11, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>Clear all</button>
      )}

      {!radar ? (
        <div style={{ textAlign: "center", padding: "30px 10px", color: P.t3 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🛰️</div>
          <div style={{ fontSize: 13 }}>Add at least one enemy hero to scan threats.</div>
          <div style={{ fontSize: 11, marginTop: 6, color: P.t3 }}>Add your team too for tailored counters & who to protect.</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <div style={{ flex: 1, ...s.cd2, cursor: "default", marginBottom: 0, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: P.t3, letterSpacing: .5 }}>ENEMY THREAT</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: radar.overall === "Stacked" ? P.red : radar.overall === "Dangerous" ? P.gold : P.nG, fontFamily: "'Oxanium',sans-serif" }}>{radar.overall}</div>
            </div>
            <div style={{ flex: 1, ...s.cd2, cursor: "default", marginBottom: 0, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: P.t3, letterSpacing: .5 }}>BAN PRIORITY</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: P.red, fontFamily: "'Oxanium',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>🚫 {radar.banPriority}</div>
            </div>
          </div>

          {radar.protect && (
            <div style={{ ...s.cd2, cursor: "default", borderLeft: `3px solid ${P.blue}`, marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: P.t1 }}><strong style={{ color: P.blue }}>🛡️ Protect {radar.protect.n}</strong> — targeted by {radar.protect.by.join(", ")}. Peel and position them safely.</span>
            </div>
          )}

          {radar.list.map((x, i) => {
            const h = getHeroByName(x.n);
            const col = LVL[x.level];
            return (
              <div key={x.n} style={{ ...s.cd2, cursor: "default", borderLeft: `3px solid ${col}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ position: "relative" }}>
                    {h ? <Portrait hero={h} size={38} radius={9} /> : <span style={{ fontSize: 22 }}>{ri(x.r)}</span>}
                    <span style={{ position: "absolute", top: -6, left: -6, width: 17, height: 17, borderRadius: 999, background: P.bg, border: `1px solid ${col}`, color: col, fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: P.t1 }}>{x.n}</span>
                      <span style={s.bg(tc(x.t), true)}>{x.t}</span>
                      <span style={s.bg(rc(x.r))}>{ri(x.r)} {x.r}</span>
                    </div>
                    <div style={{ fontSize: 11, color: P.t2, marginTop: 3, lineHeight: 1.45 }}>{x.action}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 900, color: col, background: col + "1c", border: `1px solid ${col}55`, borderRadius: 7, padding: "3px 7px", letterSpacing: .3, whiteSpace: "nowrap" }}>{x.level.toUpperCase()}</span>
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
