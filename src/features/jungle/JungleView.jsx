import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";

export function JungleView({ onSelectHero }) {
  const { getJungle, getHeroByName } = useData();
  const { paths: JG_PATHS, timers: JG_TIMERS, tips: JG_TIPS } = getJungle();
  return (
    <>
      <div style={{ background: `linear-gradient(135deg,${P.nG}0c,${P.gold}08)`, border: `1px solid ${P.nG}33`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: P.nG }}>🗡️ Jungle Guide</div>
        <div style={{ fontSize: 11, color: P.t2, marginTop: 4, lineHeight: 1.6 }}>Jungle = farm camps, secure buffs, gank lanes, control Turtle/Lord. Hit Level 4 by 1:45-2:00. Rotate 60% farm / 40% ganks in first 8 minutes.</div>
      </div>
      <div style={s.sc}>📍 Jungle Paths</div>
      {JG_PATHS.map((p, i) => (
        <div key={i} style={{ ...s.cd2, cursor: "default", borderLeft: `3px solid ${P.nG}` }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: P.gold }}>{p.name}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginTop: 6 }}>{p.steps.map((st, j) => (<div key={j} style={{ display: "flex", alignItems: "center" }}><span style={{ padding: "3px 8px", background: P.bg, borderRadius: 6, fontSize: 10, fontWeight: 600, color: P.neon, border: `1px solid ${P.neon}33` }}>{j + 1}. {st}</span>{j < p.steps.length - 1 && <span style={{ color: P.t3, margin: "0 4px", fontSize: 12 }}>→</span>}</div>))}</div>
          <div style={{ fontSize: 10, color: P.t2, marginTop: 6, lineHeight: 1.5 }}>{p.note}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>{p.heroes.map(h => <span key={h} style={s.ch(P.gold)} onClick={() => { const f = getHeroByName(h); if (f) onSelectHero(f); }}>{h}</span>)}</div>
        </div>
      ))}
      <div style={s.sc}>⏱️ Objective Timers</div>
      {JG_TIMERS.map(t => (
        <div key={t.obj} style={{ ...s.cd2, cursor: "default" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 13, fontWeight: 800, color: P.gold }}>{t.obj}</div><span style={{ fontSize: 11, color: P.neon, fontWeight: 700 }}>{t.spawn}</span></div>
          <div style={{ fontSize: 10, color: P.t2, marginTop: 4 }}>Respawn: {t.respawn} · Ends: {t.despawn}</div>
          <div style={{ fontSize: 10, color: P.nG, marginTop: 3 }}>🎁 {t.reward}</div>
          <div style={{ fontSize: 10, color: P.t3, marginTop: 3, fontStyle: "italic" }}>💡 {t.tip}</div>
        </div>
      ))}
      <div style={s.sc}>🧠 Pro Jungle Tips</div>
      {JG_TIPS.map((tip, i) => (<div key={i} style={{ padding: "6px 0", borderBottom: i < JG_TIPS.length - 1 ? `1px solid ${P.brd}` : "none", fontSize: 11, color: P.t2, lineHeight: 1.5 }}><span style={{ color: P.gold, fontWeight: 700 }}>{i + 1}.</span> {tip}</div>))}
    </>
  );
}
