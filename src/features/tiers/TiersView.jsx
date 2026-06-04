import { s } from "../../theme/styles.js";
import { P, tc, ri, TIERS } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";
import { Badge } from "../../components/Badge.jsx";

export function TiersView({ onSelectHero }) {
  const { getHeroes, getChange } = useData();
  const H = getHeroes();
  return (
    <>
      {TIERS.map(t => {
        const heroes = H.filter(h => h.t === t);
        if (!heroes.length) return null;
        return (
          <div key={t} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ minWidth: 30, padding: "2px 0", borderRadius: 4, background: tc(t), color: "#000", textAlign: "center", fontWeight: 900, fontSize: 11 }}>{t}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: tc(t) }}>{t === "S+" ? "Must Ban/Pick" : t === "S" ? "Meta" : t === "A" ? "Strong" : t === "B" ? "Viable" : "Situational"}</span>
              <span style={{ fontSize: 10, color: P.t3 }}>({heroes.length})</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>{heroes.map(h => <button key={h.n} type="button" style={s.ch(tc(t))} onClick={() => onSelectHero(h)}>{ri(h.r)} {h.n} <span style={{ opacity: .5, fontSize: 9 }}>{h.wr}%</span><Badge change={getChange(h.n)} /></button>)}</div>
          </div>
        );
      })}
    </>
  );
}
