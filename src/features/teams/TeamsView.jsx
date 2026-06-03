import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { getMeta, getHeroByName } from "../../data/index.js";

export function TeamsView({ onSelectHero }) {
  const { teams: TEAMS } = getMeta();
  return (
    <>
      {TEAMS.map((t, i) => (
        <div key={i} style={{ ...s.cd2, cursor: "default" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: P.gold }}>{t.nm}</div>
          <div style={{ fontSize: 10, color: P.t2, marginTop: 3 }}>{t.ds}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginTop: 8 }}>
            {t.cp.map((slot, j) => (
              <div key={j} style={{ background: P.bg, borderRadius: 6, padding: "5px 8px" }}>
                <div style={{ fontSize: 9, color: P.t3 }}>{slot}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: P.goldD, cursor: "pointer" }} onClick={() => { const f = getHeroByName(t.ex[j]); if (f) onSelectHero(f); }}>{t.ex[j]} →</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
