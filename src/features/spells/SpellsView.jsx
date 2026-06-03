import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";

export function SpellsView() {
  const { getSpells } = useData();
  const SPELLS = getSpells();
  return (
    <>
      {SPELLS.map(sp => (
        <div key={sp.n} style={{ ...s.cd2, cursor: "default" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: 14, fontWeight: 800 }}>{sp.i} {sp.n}</div><span style={{ fontSize: 10, color: P.t3 }}>{sp.cd}s</span></div>
          <div style={{ fontSize: 11, color: P.t2, marginTop: 3 }}>{sp.d}</div>
          <div style={{ fontSize: 10, color: P.gold, marginTop: 3, fontStyle: "italic" }}>{sp.b}</div>
        </div>
      ))}
    </>
  );
}
