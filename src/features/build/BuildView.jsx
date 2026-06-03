import { useMemo } from "react";
import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";

export function BuildView({ bS, setBS, bC, setBC, savedBuilds, saveBuilds, buildName, setBuildName }) {
  const { getItems } = useData();
  const ITEMS = getItems();
  const bG = useMemo(() => bS.filter(Boolean).reduce((a, i) => a + i.g, 0), [bS]);
  const count = bS.filter(Boolean).length;
  return (
    <>
      <div style={{ background: P.cd, border: `1px solid ${P.brd}`, borderRadius: 12, padding: 12, marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><div style={{ fontSize: 13, fontWeight: 800 }}>Build ({count}/6)</div><div style={{ fontSize: 14, fontWeight: 900, color: P.gold }}>{bG}g</div></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>{bS.map((it, i) => (<div key={i} style={{ background: it ? P.bg2 : P.bg, border: `1px solid ${it ? P.gold + "33" : P.brd}`, borderRadius: 6, padding: 6, textAlign: "center", minHeight: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: it ? "pointer" : "default" }} onClick={() => { if (it) { const n = [...bS]; n[i] = null; setBS(n); } }}>{it ? <><div style={{ fontSize: 10, fontWeight: 700 }}>{it.i} {it.n}</div><div style={{ fontSize: 8, color: P.t3 }}>tap remove</div></> : <div style={{ fontSize: 10, color: P.t3 }}>#{i + 1}</div>}</div>))}</div>
        <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
          <input style={{ ...s.ip, flex: 1, marginBottom: 0, fontSize: 11, padding: "6px 10px" }} placeholder="Build name..." value={buildName} onChange={e => setBuildName(e.target.value)} />
          <button style={{ padding: "6px 12px", background: P.gold, border: "none", borderRadius: 8, color: "#000", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }} onClick={() => {
            if (!buildName || count === 0) return;
            saveBuilds([...savedBuilds, { name: buildName, items: bS.filter(Boolean).map(i => ({ n: i.n, g: i.g, i: i.i, st: i.st, pa: i.pa, tg: i.tg })), date: new Date().toLocaleDateString() }]);
            setBuildName("");
          }}>💾 Save</button>
        </div>
        <button style={{ marginTop: 4, padding: "4px 12px", background: "transparent", border: `1px solid ${P.red}33`, borderRadius: 6, color: P.red, fontSize: 10, cursor: "pointer", fontFamily: "inherit" }} onClick={() => setBS(Array(6).fill(null))}>Clear</button>
      </div>
      {savedBuilds.length > 0 && <><div style={s.sc}>💾 Saved Builds</div>
        {savedBuilds.map((sb, i) => (
          <div key={i} style={{ ...s.cd2, cursor: "default" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: P.gold }}>{sb.name}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 9, color: P.t3 }}>{sb.date}</span>
                <button style={{ fontSize: 9, color: P.nG, background: "transparent", border: `1px solid ${P.nG}33`, borderRadius: 4, padding: "2px 6px", cursor: "pointer", fontFamily: "inherit" }} onClick={() => { const n = Array(6).fill(null); sb.items.forEach((it, j) => { if (j < 6) n[j] = it; }); setBS(n); }}>Load</button>
                <button style={{ fontSize: 9, color: P.red, background: "transparent", border: `1px solid ${P.red}33`, borderRadius: 4, padding: "2px 6px", cursor: "pointer", fontFamily: "inherit" }} onClick={() => { saveBuilds(savedBuilds.filter((_, j) => j !== i)); }}>✕</button>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>{sb.items.map((it, j) => <span key={j} style={{ fontSize: 9, padding: "2px 6px", background: `${P.gold}12`, borderRadius: 4, color: P.goldD }}>{it.i} {it.n}</span>)}</div>
          </div>
        ))}</>}
      <div style={s.fR}>{Object.keys(ITEMS).map(c => <button key={c} style={s.fb(bC === c, P.neon)} onClick={() => setBC(c)}>{c}</button>)}</div>
      {(ITEMS[bC] || []).map(it => (<div key={it.n} style={{ ...s.cd2, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: count >= 6 ? .4 : 1 }} onClick={() => { const idx = bS.findIndex(x => x === null); if (idx !== -1) { const n = [...bS]; n[idx] = it; setBS(n); } }}><div><div style={{ fontSize: 12, fontWeight: 600 }}>{it.i} {it.n} <span style={{ color: P.t3 }}>{it.g}g</span></div><div style={{ fontSize: 10, color: P.t2 }}>{it.st}</div></div>{count < 6 && <span style={{ fontSize: 16, color: P.nG }}>+</span>}</div>))}
    </>
  );
}
