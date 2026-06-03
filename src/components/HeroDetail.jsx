import { s } from "../theme/styles.js";
import { P, tc, rc, ri } from "../theme/palette.js";
import { getHeroByName } from "../data/index.js";

// Full-page hero detail takeover. Renders nothing when no hero is selected.
// Props: { hero, onClose, onSelectHero }
export function HeroDetail({ hero, onClose, onSelectHero }) {
  if (!hero) return null;
  const h = hero;
  return (
    <div style={s.root}>
      <div style={s.hdr}><div style={s.glow} /><div style={s.title}>MLBB GUIDE</div></div>
      <div style={s.ct}>
        <button style={s.bk} onClick={() => onClose()}>← Back</button>
        <div style={{ background: P.cd, border: `1px solid ${P.brd}`, borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.04 }}>{ri(h.r)}</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{ri(h.r)} {h.n}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
            <span style={s.bg(rc(h.r))}>{h.r}</span>
            {h.r2 && <span style={s.bg(rc(h.r2))}>{h.r2}</span>}
            <span style={s.bg(tc(h.t), true)}>{h.t}</span>
            <span style={s.bg(P.neon)}>{h.l}</span>
            <span style={s.bg(P.t2)}>{"⭐".repeat(h.d)}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
            {[["Win", h.wr + "%", h.wr >= 52 ? P.nG : h.wr >= 51 ? P.gold : P.t2], ["Pick", h.pr + "%", P.blue], ["Ban", h.br + "%", h.br >= 30 ? P.red : P.t2]].map(([l, v, c]) => (
              <div key={l} style={{ background: P.bg, borderRadius: 8, padding: "8px", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: c }}>{v}</div>
                <div style={{ fontSize: 8, color: P.t3, letterSpacing: 1, textTransform: "uppercase" }}>{l} Rate</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: P.t2, marginTop: 12, lineHeight: 1.7 }}>
            <div style={{ marginBottom: 4 }}><strong style={{ color: P.gold }}>Specialty:</strong> {h.sp}</div>
            <div style={{ marginBottom: 4 }}><strong style={{ color: P.gold }}>Emblem:</strong> {h.e} · <strong style={{ color: P.gold }}>Spells:</strong> {h.sp2?.join(" / ")}</div>
          </div>
          <div style={s.sc}>Build</div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>{h.b.map((x, i) => <span key={i} style={{ display: "inline-block", padding: "3px 8px", background: `${P.gold}12`, border: `1px solid ${P.gold}30`, borderRadius: 6, fontSize: 10, fontWeight: 600, color: P.goldD, marginRight: 3, marginBottom: 3 }}>{i + 1}. {x}</span>)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
            <div><div style={{ fontSize: 10, fontWeight: 700, color: P.red, letterSpacing: 1, marginBottom: 4 }}>🚫 WEAK VS</div>{h.c.map((x, i) => <div key={i} style={{ fontSize: 11, color: P.red, padding: "2px 0" }}>• {x}</div>)}</div>
            <div><div style={{ fontSize: 10, fontWeight: 700, color: P.nG, letterSpacing: 1, marginBottom: 4 }}>✅ STRONG VS</div>{h.s.map((x, i) => <div key={i} style={{ fontSize: 11, color: P.nG, padding: "2px 0" }}>• {x}</div>)}</div>
          </div>
          {h.sy && <><div style={{ fontSize: 10, fontWeight: 700, color: P.neon, letterSpacing: 1, marginTop: 12, marginBottom: 4 }}>🤝 SYNERGIES</div><div style={{ display: "flex", flexWrap: "wrap" }}>{h.sy.map(x => <span key={x} style={s.ch(P.neon)} onClick={() => { const f = getHeroByName(x); if (f) onSelectHero(f); }}>{x}</span>)}</div></>}
          <div style={s.tp}>💡 {h.tip}</div>
        </div>
      </div>
    </div>
  );
}
