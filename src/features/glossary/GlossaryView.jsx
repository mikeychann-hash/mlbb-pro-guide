import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { getGlossary } from "../../data/index.js";

export function GlossaryView({ glsCat, setGlsCat }) {
  const GLOSSARY = getGlossary();
  return (
    <>
      <div style={{ fontSize: 11, color: P.t2, marginBottom: 10 }}>All MLBB terminology explained. Essential for new players.</div>
      <div style={s.fR}>{["All", "Combat", "Strategy", "Items", "Spells", "Teamplay", "Draft", "General"].map(c => <button key={c} style={s.fb(glsCat === c, P.neon)} onClick={() => setGlsCat(c)}>{c}</button>)}</div>
      {GLOSSARY.filter(g => glsCat === "All" || g.cat === glsCat).map(g => (
        <div key={g.term} style={{ ...s.cd2, cursor: "default", borderLeft: `3px solid ${P.gold}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: P.gold }}>{g.term}</span>
            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 6, background: P.brd, color: P.t3 }}>{g.cat}</span>
          </div>
          <div style={{ fontSize: 11, color: P.t2, marginTop: 4, lineHeight: 1.5 }}>{g.def}</div>
        </div>
      ))}
    </>
  );
}
