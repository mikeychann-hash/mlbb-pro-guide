import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";

export function EmblemsView() {
  const { getEmblems } = useData();
  const EMBLEM_SETS = getEmblems();
  return (
    <>
      <div style={{ fontSize: 11, color: P.t2, marginBottom: 10, lineHeight: 1.6 }}>Choose Tier 3 FIRST — it's your win condition. Then T2 for the matchup. Then T1 for lane comfort. Change emblems during hero select based on enemy comp.</div>
      {EMBLEM_SETS.map(em => (
        <div key={em.name} style={{ background: P.cd, border: `1px solid ${em.color}33`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>{em.icon}</span>
            <div><div style={{ fontSize: 15, fontWeight: 900, color: em.color }}>{em.name} Emblem</div><div style={{ fontSize: 9, color: P.t3 }}>{em.stats}</div></div>
          </div>
          <div style={{ fontSize: 10, color: P.t2, marginBottom: 8, fontStyle: "italic" }}>Best for: {em.best}</div>
          {[{ tier: "Tier 1", data: em.t1, label: "Attribute Bonus" }, { tier: "Tier 2", data: em.t2, label: "Triggered Ability" }, { tier: "Tier 3", data: em.t3, label: "Core Talent ⭐" }].map(({ tier, data, label }) => (
            <div key={tier} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: em.color, letterSpacing: 1, marginBottom: 4 }}>{tier} — {label}</div>
              {data.map(t => (
                <div key={t.n} style={{ background: P.bg, borderRadius: 6, padding: "6px 8px", marginBottom: 3, borderLeft: `2px solid ${em.color}44` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{t.n}</span>
                    <span style={{ fontSize: 9, color: em.color }}>{t.e}</span>
                  </div>
                  <div style={{ fontSize: 9, color: P.t3, marginTop: 2 }}>When: {t.use}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      <div style={s.tp}>💡 <strong>Top Mistakes:</strong> (1) Killing Spree on tanks — does nothing, use Concussive Blast. (2) Skipping Seasoned Hunter as jungler — 15% Lord/Turtle DMG is mandatory. (3) Never switching — you CAN change emblems during hero select. (4) Choosing T1 first — T3 defines your match plan, pick it first.</div>
    </>
  );
}
