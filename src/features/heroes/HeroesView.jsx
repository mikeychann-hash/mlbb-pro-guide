import { useMemo } from "react";
import { s } from "../../theme/styles.js";
import { P, tc, rc, ri, ROLES, TIERS } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";
import { Badge } from "../../components/Badge.jsx";
import { Portrait } from "../../components/Portrait.jsx";

export function HeroesView({ q, setQ, rF, setRF, tF, setTF, onSelectHero }) {
  const { getHeroes, getChange } = useData();
  const H = getHeroes();
  const flt = useMemo(() => {
    let h = H;
    if (rF !== "All") h = h.filter(x => x.r === rF || x.r2 === rF);
    if (tF !== "All") h = h.filter(x => x.t === tF);
    if (q) h = h.filter(x => x.n.toLowerCase().includes(q.toLowerCase()));
    return h;
  }, [H, rF, tF, q]);
  return (
    <>
      <input style={s.ip} placeholder="🔍 Search heroes..." value={q} onChange={e => setQ(e.target.value)} />
      <div style={s.fR}>
        <button style={s.fb(rF === "All")} onClick={() => setRF("All")}>All</button>
        {ROLES.map(r => <button key={r} style={s.fb(rF === r, rc(r))} onClick={() => setRF(r)}>{ri(r)} {r}</button>)}
      </div>
      <div style={{ ...s.fR, marginBottom: 6 }}>
        <button style={s.fb(tF === "All")} onClick={() => setTF("All")}>All</button>
        {TIERS.map(t => <button key={t} style={s.fb(tF === t, tc(t))} onClick={() => setTF(t)}>{t}</button>)}
      </div>
      <div style={{ fontSize: 10, color: P.t3, marginBottom: 6 }}>{flt.length} heroes</div>
      {flt.map(h => (
        <button key={h.n} type="button" style={{ ...s.cd2, ...s.btnReset }} onClick={() => onSelectHero(h)}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <Portrait hero={h} size={46} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: .2 }}>{h.n}<Badge change={getChange(h.n)} /></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
                <span style={s.bg(rc(h.r))}>{h.r}</span>{h.r2 && <span style={s.bg(rc(h.r2))}>{h.r2}</span>}<span style={s.bg(tc(h.t), true)}>{h.t}</span><span style={s.bg(P.t2)}>{h.l}</span>
              </div>
            </div>
            <div style={{ textAlign: "right", flex: "0 0 auto" }}><div style={s.wr(h.wr)}>{h.wr}%</div><div style={{ fontSize: 9, color: P.t3 }}>WR</div></div>
          </div>
        </button>
      ))}
    </>
  );
}
