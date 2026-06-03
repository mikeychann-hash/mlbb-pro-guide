import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { getRoam, getMacro } from "../../data/index.js";

export function RoamView() {
  const { boots: ROAM_BOOTS, rotation: ROAM_ROTATION, tips: ROAM_TIPS } = getRoam();
  const { antiHeal: ANTI_HEAL } = getMacro();
  return (
    <>
      <div style={{ background: `linear-gradient(135deg,${P.neon}0c,${P.blue}08)`, border: `1px solid ${P.neon}33`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: P.neon }}>🛡️ Roaming Guide</div>
        <div style={{ fontSize: 11, color: P.t2, marginTop: 4, lineHeight: 1.6 }}>The most impactful early game role. Control pace through ganks, vision, and objectives. Sacrifice personal gold to create map-wide advantages.</div>
      </div>
      <div style={s.sc}>👢 Roaming Boots</div>
      {ROAM_BOOTS.map(b => (
        <div key={b.n} style={{ ...s.cd2, cursor: "default" }}><div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: 13, fontWeight: 700 }}>{b.i} {b.n}</div></div><div style={{ fontSize: 10, color: P.neon, marginTop: 3 }}>{b.e}</div><div style={{ fontSize: 10, color: P.t2, marginTop: 2 }}>{b.use}</div></div>
      ))}
      <div style={s.sc}>🗺️ Rotation Timeline</div>
      {ROAM_ROTATION.map((r, i) => (
        <div key={i} style={{ ...s.cd2, cursor: "default", borderLeft: `3px solid ${P.neon}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 13, fontWeight: 800, color: P.gold }}>{r.nm}</div><span style={{ fontSize: 10, color: P.neon, fontWeight: 700 }}>{r.t}</span></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginTop: 6 }}>{r.st.map((st, j) => (<div key={j} style={{ display: "flex", alignItems: "center" }}><span style={{ padding: "2px 7px", background: P.bg, borderRadius: 5, fontSize: 10, fontWeight: 600, color: P.neon, border: `1px solid ${P.neon}33` }}>{j + 1}. {st}</span>{j < r.st.length - 1 && <span style={{ color: P.t3, margin: "0 3px", fontSize: 10 }}>→</span>}</div>))}</div>
          <div style={{ fontSize: 10, color: P.t3, marginTop: 4, fontStyle: "italic" }}>💡 {r.tp}</div>
        </div>
      ))}
      <div style={s.sc}>👁️ Vision Tips</div>
      {ROAM_TIPS.map((tip, i) => (<div key={i} style={{ padding: "5px 0", borderBottom: i < ROAM_TIPS.length - 1 ? `1px solid ${P.brd}` : "none", fontSize: 11, color: P.t2, lineHeight: 1.5 }}><span style={{ color: P.neon, fontWeight: 700 }}>{i + 1}.</span> {tip}</div>))}
      <div style={s.sc}>💊 Anti-Heal Guide</div>
      <div style={{ ...s.cd2, cursor: "default", borderLeft: `3px solid ${P.red}` }}>
        <div style={{ fontSize: 11, color: P.t2, marginBottom: 6 }}><strong style={{ color: P.red }}>When:</strong> {ANTI_HEAL.when}</div>
        {ANTI_HEAL.items.map(it => (<div key={it.n} style={{ background: P.bg, borderRadius: 6, padding: "6px 8px", marginBottom: 3 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 11, fontWeight: 700 }}>{it.n}</span><span style={{ fontSize: 9, color: P.gold }}>{it.r}</span></div><div style={{ fontSize: 10, color: P.neon }}>{it.e}</div></div>))}
        <div style={{ fontSize: 10, color: P.t3, marginTop: 4, fontStyle: "italic" }}>💡 {ANTI_HEAL.tip}</div>
      </div>
    </>
  );
}
