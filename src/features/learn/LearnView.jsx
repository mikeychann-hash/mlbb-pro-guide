import { P } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";

export function LearnView() {
  const { getLearnPath } = useData();
  const LEARN_PATH = getLearnPath();
  return (
    <>
      <div style={{ background: `linear-gradient(135deg,${P.nG}0c,${P.gold}08)`, border: `1px solid ${P.nG}33`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: P.nG }}>🏅 Learning Path</div>
        <div style={{ fontSize: 11, color: P.t2, marginTop: 4 }}>Step-by-step progression from complete beginner to Mythical Glory.</div>
      </div>
      {LEARN_PATH.map((lv, i) => (
        <div key={i} style={{ background: P.cd, border: `1px solid ${lv.color}33`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>{lv.icon}</span>
            <div><div style={{ fontSize: 15, fontWeight: 900, color: lv.color }}>{lv.level}</div>
              <div style={{ fontSize: 10, color: P.t3 }}>{lv.rank} · {lv.hours}</div></div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: P.gold, letterSpacing: 1, marginBottom: 4 }}>GOALS</div>
          {lv.goals.map((g, j) => (<div key={j} style={{ padding: "3px 0", fontSize: 11, color: P.t2, lineHeight: 1.5 }}>☐ {g}</div>))}
          <div style={{ marginTop: 8, fontSize: 10, color: P.neon }}>🎮 <strong>Recommended Heroes:</strong> {lv.heroes}</div>
          <div style={{ marginTop: 4, padding: "6px 8px", background: `${lv.color}12`, borderRadius: 6, fontSize: 11, color: lv.color, fontWeight: 600 }}>🎯 Focus: {lv.focus}</div>
        </div>
      ))}
    </>
  );
}
