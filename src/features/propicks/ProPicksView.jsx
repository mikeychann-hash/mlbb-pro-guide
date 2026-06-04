import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";
import { Portrait } from "../../components/Portrait.jsx";

export function ProPicksView({ onSelectHero }) {
  const { getProPicks, getHeroByName } = useData();
  const { picks: PRO_PICKS, tips: PRO_TIPS_DATA } = getProPicks();
  return (
    <>
      <div style={{ background: `linear-gradient(135deg,${P.red}0c,${P.gold}08)`, border: `1px solid ${P.gold}33`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: P.gold }}>🏆 MPL Pro Picks</div>
        <div style={{ fontSize: 11, color: P.t2, marginTop: 4, lineHeight: 1.6 }}>Pick/ban data from MPL Season 15 & M6 2026 professional tournaments. What the pros are playing in competitive.</div>
      </div>
      {PRO_PICKS.map(role => (
        <div key={role.role} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: P.gold, marginBottom: 6 }}>{role.role}</div>
          {role.heroes.map(h => (
            <div key={h.n} style={{ ...s.cd2, cursor: "pointer" }} onClick={() => { const f = getHeroByName(h.n); if (f) onSelectHero(f); }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{getHeroByName(h.n) && <Portrait hero={getHeroByName(h.n)} size={30} radius={8} />}<span style={{ fontSize: 13, fontWeight: 700 }}>{h.n}</span></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, fontWeight: 800, color: P.nG }}>{h.pk}%</div><div style={{ fontSize: 7, color: P.t3 }}>PICK</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, fontWeight: 800, color: P.red }}>{h.bn}%</div><div style={{ fontSize: 7, color: P.t3 }}>BAN</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, fontWeight: 800, color: h.wr >= 53 ? P.nG : P.t2 }}>{h.wr}%</div><div style={{ fontSize: 7, color: P.t3 }}>WR</div></div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: P.t2, marginTop: 3 }}>{h.note}</div>
              <div style={s.br2(h.pk, P.blue)}><div style={s.bf2(h.pk, P.blue)} /></div>
            </div>
          ))}
        </div>
      ))}
      <div style={s.sc}>💡 Pro Insights</div>
      {PRO_TIPS_DATA.map((t, i) => (<div key={i} style={{ padding: "5px 0", borderBottom: `1px solid ${P.brd}`, fontSize: 11, color: P.t2 }}><span style={{ color: P.gold, fontWeight: 700 }}>{i + 1}.</span> {t}</div>))}
    </>
  );
}
