import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { getItems } from "../../data/index.js";

export function ItemsView({ iC, setIC }) {
  const ITEMS = getItems();
  return (
    <>
      <div style={s.fR}>{Object.keys(ITEMS).map(c => <button key={c} style={s.fb(iC === c, P.neon)} onClick={() => setIC(c)}>{c}</button>)}</div>
      {(ITEMS[iC] || []).map(it => (
        <div key={it.n} style={{ ...s.cd2, cursor: "default" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: 13, fontWeight: 700 }}>{it.i} {it.n}</div><span style={{ fontSize: 10, color: P.goldD, fontWeight: 700 }}>{it.g}g</span></div>
          <div style={{ fontSize: 11, color: P.t2, marginTop: 2 }}>{it.st}</div>
          <div style={{ fontSize: 10, color: P.neon, marginTop: 3 }}>⚡ {it.pa}</div>
          <div style={{ display: "flex", gap: 3, marginTop: 3 }}>{it.tg.map(t => <span key={t} style={{ fontSize: 8, padding: "1px 6px", borderRadius: 6, background: P.brd, color: P.t3 }}>{t}</span>)}</div>
        </div>
      ))}
    </>
  );
}
