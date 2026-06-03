import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";

export function MetaView({ onSelectHero }) {
  const { getMeta, getHeroByName } = useData();
  const { patch: PATCH, bans: BANS, rising: RISING, falling: FALLING, lanes: LANES } = getMeta();
  const open = (name) => { const f = getHeroByName(name); if (f) onSelectHero(f); };
  return (
    <>
      <div style={{ background: `linear-gradient(135deg,${P.gold}0c,${P.pink}08)`, border: `1px solid ${P.gold}33`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: P.gold }}>Season {PATCH.s} Meta</div>
        <div style={{ fontSize: 10, color: P.t2, marginTop: 2 }}>Patch {PATCH.v} · {PATCH.d}</div>
        <div style={{ fontSize: 11, color: P.t2, marginTop: 8, lineHeight: 1.6 }}>Utility junglers + mobility assassins + dominant mages. 13 mages buffed, 6 nerfed. Fighters dominate EXP with 8 S-tier heroes.</div>
      </div>
      <div style={s.sc}>🚫 Top Bans</div>
      {BANS.map(h => (
        <div key={h.n} style={{ ...s.cd2, display: "flex", alignItems: "center", gap: 10 }} onClick={() => open(h.n)}>
          <div style={{ fontSize: 18, fontWeight: 900, color: P.red, minWidth: 38 }}>{h.r}%</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{h.n} <span style={{ color: h.tr === "↑" ? P.nG : h.tr === "↓" ? P.red : P.t3 }}>{h.tr}</span></div>
            <div style={s.br2(h.r, P.red)}><div style={s.bf2(h.r, P.red)} /></div>
          </div>
        </div>
      ))}
      <div style={s.sc}>📈 Rising</div>
      {RISING.map(h => (
        <div key={h.n} style={{ ...s.cd2, borderLeft: `3px solid ${P.nG}` }} onClick={() => open(h.n)}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, fontWeight: 700 }}>{h.n}</span><span style={{ fontSize: 10, color: P.nG, fontWeight: 700 }}>{h.ch}</span></div>
          <div style={{ fontSize: 10, color: P.t2, marginTop: 2 }}>{h.w}</div>
        </div>
      ))}
      <div style={s.sc}>📉 Falling</div>
      {FALLING.map(h => (
        <div key={h.n} style={{ ...s.cd2, borderLeft: `3px solid ${P.red}` }} onClick={() => open(h.n)}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, fontWeight: 700 }}>{h.n}</span><span style={{ fontSize: 10, color: P.red, fontWeight: 700 }}>{h.ch}</span></div>
          <div style={{ fontSize: 10, color: P.t2, marginTop: 2 }}>{h.w}</div>
        </div>
      ))}
      <div style={s.sc}>🗺️ Lane Meta</div>
      {LANES.map(ln => (
        <div key={ln.l} style={{ ...s.cd2, cursor: "default" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: P.gold }}>{ln.i} {ln.l}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginTop: 4 }}>{ln.top.map((n, i) => <span key={n} style={s.ch(i === 0 ? P.gold : P.blue)} onClick={() => open(n)}>{i === 0 ? "👑 " : ""}{n}</span>)}</div>
          <div style={{ fontSize: 10, color: P.t2, marginTop: 4, lineHeight: 1.5 }}>{ln.nt}</div>
        </div>
      ))}
    </>
  );
}
