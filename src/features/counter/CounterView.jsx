import { useMemo } from "react";
import { s } from "../../theme/styles.js";
import { P, ri } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";

export function CounterView({ cQ, setCQ }) {
  const { getHeroes, getHeroByName } = useData();
  const H = getHeroes();
  const cH = useMemo(() => getHeroByName(cQ), [cQ]);
  const cSg = useMemo(() => cQ.length < 1 ? [] : H.filter(h => h.n.toLowerCase().includes(cQ.toLowerCase())).slice(0, 8), [H, cQ]);
  return (
    <>
      <div style={{ position: "relative" }}>
        <input style={s.ip} placeholder="🔍 Search hero..." value={cQ} onChange={e => setCQ(e.target.value)} />
        {cQ && !cH && cSg.length > 0 && <div style={{ position: "absolute", top: 40, left: 0, right: 0, background: P.cd, border: `1px solid ${P.brd}`, borderRadius: 8, zIndex: 10, maxHeight: 200, overflow: "auto" }}>{cSg.map(h => <div key={h.n} style={{ padding: "6px 12px", fontSize: 12, cursor: "pointer", borderBottom: `1px solid ${P.brd}` }} onClick={() => setCQ(h.n)}>{ri(h.r)} {h.n}</div>)}</div>}
      </div>
      {cH ? (
        <div style={{ background: P.cd, border: `1px solid ${P.brd}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>{ri(cH.r)} {cH.n}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ textAlign: "center" }}><div style={s.wr(cH.wr)}>{cH.wr}%</div><div style={{ fontSize: 8, color: P.t3 }}>WR</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 800, color: cH.br >= 30 ? P.red : P.t2 }}>{cH.br}%</div><div style={{ fontSize: 8, color: P.t3 }}>BAN</div></div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><div style={{ fontSize: 10, fontWeight: 700, color: P.red, letterSpacing: 1, marginBottom: 4 }}>🚫 COUNTERED BY</div>{cH.c.map((x, i) => <div key={i} style={{ fontSize: 11, color: P.red, padding: "2px 0", cursor: "pointer" }} onClick={() => setCQ(x)}>{x}</div>)}</div>
            <div><div style={{ fontSize: 10, fontWeight: 700, color: P.nG, letterSpacing: 1, marginBottom: 4 }}>✅ STRONG VS</div>{cH.s.map((x, i) => <div key={i} style={{ fontSize: 11, color: P.nG, padding: "2px 0" }}>{x}</div>)}</div>
          </div>
          {cH.sy && <><div style={{ fontSize: 10, fontWeight: 700, color: P.neon, letterSpacing: 1, marginTop: 10, marginBottom: 4 }}>🤝 SYNERGIES</div><div style={{ display: "flex", flexWrap: "wrap" }}>{cH.sy.map(x => <span key={x} style={s.ch(P.neon)} onClick={() => setCQ(x)}>{x}</span>)}</div></>}
          <div style={{ marginTop: 10 }}><div style={{ fontSize: 10, fontWeight: 700, color: P.gold, letterSpacing: 1, marginBottom: 4 }}>🛡️ BUILD</div><div style={{ display: "flex", flexWrap: "wrap" }}>{cH.b.map((x, i) => <span key={i} style={{ display: "inline-block", padding: "3px 8px", background: `${P.gold}12`, border: `1px solid ${P.gold}30`, borderRadius: 6, fontSize: 10, fontWeight: 600, color: P.goldD, marginRight: 3, marginBottom: 3 }}>{x}</span>)}</div></div>
          <div style={s.tp}>💡 {cH.tip}</div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "30px", color: P.t3 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚔️</div>
          <div style={{ fontSize: 13 }}>Search hero for counters & matchups</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, marginTop: 12 }}>{["Sora", "Fredrinn", "Julian", "Zhuxin", "Joy", "Helcurt", "Saber", "Ling"].map(n => <span key={n} style={s.ch(P.gold)} onClick={() => setCQ(n)}>{n}</span>)}</div>
        </div>
      )}
    </>
  );
}
