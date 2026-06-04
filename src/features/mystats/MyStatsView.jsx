import { s } from "../../theme/styles.js";
import { P, ri } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";

export function MyStatsView({ tracker, saveTracker, tkHero, setTkHero, tkResult, setTkResult }) {
  const { getHeroes, getHeroByName } = useData();
  const H = getHeroes();
  const suggestions = tkHero && !getHeroByName(tkHero)
    ? H.filter(x => x.n.toLowerCase().includes(tkHero.toLowerCase())).slice(0, 5)
    : [];
  const logMatch = () => {
    const found = getHeroByName(tkHero);
    if (!found) return;
    const entry = { hero: found.n, result: tkResult, date: new Date().toLocaleDateString() };
    saveTracker([entry, ...tracker]);
    setTkHero("");
  };

  // Session review (tracker[0] is the most recent entry)
  const isWin = (m) => m.result === "Win" || m.result === "MVP";
  const streakWin = tracker.length ? isWin(tracker[0]) : true;
  let streak = 0;
  for (const m of tracker) { if (isWin(m) === streakWin) streak++; else break; }
  const losing = !streakWin && streak >= 3;
  const laneAgg = {};
  for (const m of tracker) {
    const h = getHeroByName(m.hero);
    const l = (h && h.l) || "?";
    if (!laneAgg[l]) laneAgg[l] = { w: 0, t: 0 };
    laneAgg[l].t++;
    if (isWin(m)) laneAgg[l].w++;
  }
  return (
    <>
      <div style={{ background: `linear-gradient(135deg,${P.purp}0c,${P.pink}08)`, border: `1px solid ${P.purp}33`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: P.purp }}>📊 My Stats Tracker</div>
        <div style={{ fontSize: 11, color: P.t2, marginTop: 4 }}>Log your matches to track win rate per hero. Data saves between sessions.</div>
      </div>
      <div style={{ background: P.cd, border: `1px solid ${P.brd}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Log a Match</div>
        <div style={{ position: "relative", marginBottom: 6 }}>
          <input style={{ ...s.ip, marginBottom: 0 }} placeholder="Hero name..." value={tkHero} onChange={e => setTkHero(e.target.value)} />
          {suggestions.length > 0 && (
            <div style={{ position: "absolute", top: 40, left: 0, right: 0, background: P.cd, border: `1px solid ${P.brd}`, borderRadius: 8, zIndex: 10 }}>
              {suggestions.map(h => (<div key={h.n} style={{ padding: "5px 10px", fontSize: 12, cursor: "pointer", borderBottom: `1px solid ${P.brd}` }} onClick={() => setTkHero(h.n)}>{ri(h.r)} {h.n}</div>))}
            </div>)}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Win", "Loss", "MVP"].map(r => (<button key={r} style={{ ...s.fb(tkResult === r, r === "Win" ? P.nG : r === "Loss" ? P.red : P.gold), flex: 1, textAlign: "center", padding: "8px" }} onClick={() => setTkResult(r)}>{r}</button>))}
        </div>
        <button style={{ marginTop: 8, padding: "8px 0", background: P.gold, border: "none", borderRadius: 8, color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "inherit" }} onClick={logMatch}>+ Log Match</button>
      </div>
      {tracker.length > 0 && <>
        <div style={s.sc}>📈 My Performance</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[["Total", tracker.length, P.blue], ["Wins", tracker.filter(m => m.result === "Win" || m.result === "MVP").length, P.nG], ["Win Rate", tracker.length ? (((tracker.filter(m => m.result === "Win" || m.result === "MVP").length / tracker.length) * 100).toFixed(0) + "%") : "0%", P.gold]].map(([l, v, c]) => (
            <div key={l} style={{ background: P.cd, borderRadius: 8, padding: 8, textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: c }}>{v}</div><div style={{ fontSize: 8, color: P.t3, letterSpacing: 1 }}>{l}</div></div>))}
        </div>
        <div style={s.sc}>🎯 Session Review</div>
        <div style={{ ...s.cd2, cursor: "default" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: P.t2 }}>Current streak</span>
            <span style={{ fontSize: 15, fontWeight: 900, color: streakWin ? P.nG : P.red }}>{streak}{streakWin ? "W" : "L"}</span>
          </div>
          {losing && <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: P.red, background: `${P.red}14`, border: `1px solid ${P.red}44`, borderRadius: 8, padding: "8px 10px" }}>🛑 {streak}-loss streak — take a break before you tilt away more stars.</div>}
          {streakWin && streak >= 3 && <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: P.nG, background: `${P.nG}12`, border: `1px solid ${P.nG}44`, borderRadius: 8, padding: "8px 10px" }}>🔥 {streak}-win streak — ride it, keep your hero pool tight.</div>}
        </div>
        <div style={s.sc}>🗺️ Lane Win Rates</div>
        {Object.entries(laneAgg).sort((a, b) => (b[1].w / b[1].t) - (a[1].w / a[1].t)).map(([lane, st]) => {
          const wr = Math.round((st.w / st.t) * 100);
          return (
            <div key={lane} style={{ ...s.cd2, cursor: "default", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{lane}</span>
              <span style={{ fontSize: 11, color: P.t3 }}>{st.w}W {st.t - st.w}L</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: wr >= 60 ? P.nG : wr >= 50 ? P.gold : P.red }}>{wr}%</span>
            </div>
          );
        })}
        <div style={s.sc}>🦸 Hero Win Rates</div>
        {Object.entries(tracker.reduce((acc, m) => { if (!acc[m.hero]) acc[m.hero] = { w: 0, l: 0, mvp: 0 }; if (m.result === "Win") acc[m.hero].w++; else if (m.result === "MVP") { acc[m.hero].w++; acc[m.hero].mvp++; } else acc[m.hero].l++; return acc; }, {})).sort((a, b) => (b[1].w + b[1].mvp) / (b[1].w + b[1].l || 1) - (a[1].w + a[1].mvp) / (a[1].w + a[1].l || 1)).map(([hero, st]) => {
          const total = st.w + st.l; const wr = total ? (st.w / total * 100).toFixed(0) : 0;
          return (<div key={hero} style={{ ...s.cd2, cursor: "default", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 12, fontWeight: 700 }}>{hero}</div><div style={{ fontSize: 10, color: P.t3 }}>{st.w}W {st.l}L {st.mvp > 0 ? `${st.mvp} MVP` : ""}</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 14, fontWeight: 900, color: wr >= 60 ? P.nG : wr >= 50 ? P.gold : P.red }}>{wr}%</div></div>
          </div>);
        })}
        <div style={s.sc}>📋 Recent Matches</div>
        {tracker.slice(0, 15).map((m, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: `1px solid ${P.brd}` }}>
          <span style={{ fontSize: 11 }}>{m.hero}</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: P.t3 }}>{m.date}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: m.result === "Loss" ? P.red : P.nG }}>{m.result}</span>
          </div>
        </div>))}
        <button style={{ marginTop: 8, padding: "6px 0", background: "transparent", border: `1px solid ${P.red}33`, borderRadius: 6, color: P.red, fontSize: 10, cursor: "pointer", width: "100%", fontFamily: "inherit" }} onClick={() => saveTracker([])}>🗑️ Clear All Data</button>
      </>}
      {tracker.length === 0 && <div style={{ textAlign: "center", padding: 30, color: P.t3 }}><div style={{ fontSize: 36 }}>📊</div><div style={{ fontSize: 13, marginTop: 8 }}>No matches logged yet. Start tracking above!</div></div>}
    </>
  );
}
