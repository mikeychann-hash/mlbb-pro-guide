import { useMemo, useState } from "react";
import { s } from "../../theme/styles.js";
import { P, tc, rc, ri, ROLES, TIERS } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";
import { Badge } from "../../components/Badge.jsx";
import { Portrait } from "../../components/Portrait.jsx";

const LANES = ["EXP", "Mid", "Jungle", "Gold", "Roam"];
const TIER_RANK = { "S+": 5, S: 4, A: 3, B: 2, C: 1, "?": 0 };
const SORTS = [
  { key: "default", label: "Default" },
  { key: "wr", label: "Win %" },
  { key: "pr", label: "Pick %" },
  { key: "br", label: "Ban %" },
  { key: "tier", label: "Tier" },
];

export function HeroesView({ q, setQ, rF, setRF, tF, setTF, onSelectHero, favorites = [], toggleFav }) {
  const { getHeroes, getChange } = useData();
  const H = getHeroes();
  const [lF, setLF] = useState("All");
  const [sort, setSort] = useState("default");
  const [favOnly, setFavOnly] = useState(false);
  const favSet = useMemo(() => new Set(favorites), [favorites]);

  const flt = useMemo(() => {
    let h = H.slice();
    if (favOnly) h = h.filter(x => favSet.has(x.n));
    if (rF !== "All") h = h.filter(x => x.r === rF || x.r2 === rF);
    if (tF !== "All") h = h.filter(x => x.t === tF);
    if (lF !== "All") h = h.filter(x => x.l === lF);
    if (q) h = h.filter(x => x.n.toLowerCase().includes(q.toLowerCase()));
    if (sort === "wr") h.sort((a, b) => b.wr - a.wr);
    else if (sort === "pr") h.sort((a, b) => b.pr - a.pr);
    else if (sort === "br") h.sort((a, b) => b.br - a.br);
    else if (sort === "tier") h.sort((a, b) => (TIER_RANK[b.t] ?? 0) - (TIER_RANK[a.t] ?? 0) || b.wr - a.wr);
    return h;
  }, [H, favOnly, favSet, rF, tF, lF, q, sort]);

  return (
    <>
      <input style={s.ip} placeholder="🔍 Search heroes..." value={q} onChange={e => setQ(e.target.value)} />
      <div style={s.fR}>
        <button type="button" style={s.fb(favOnly, P.gold)} onClick={() => setFavOnly(v => !v)}>★ Favorites</button>
        <button type="button" style={s.fb(rF === "All")} onClick={() => setRF("All")}>All Roles</button>
        {ROLES.map(r => <button key={r} type="button" style={s.fb(rF === r, rc(r))} onClick={() => setRF(r)}>{ri(r)} {r}</button>)}
      </div>
      <div style={s.fR}>
        <button type="button" style={s.fb(lF === "All")} onClick={() => setLF("All")}>All Lanes</button>
        {LANES.map(l => <button key={l} type="button" style={s.fb(lF === l, P.neon)} onClick={() => setLF(l)}>{l}</button>)}
      </div>
      <div style={s.fR}>
        <button type="button" style={s.fb(tF === "All")} onClick={() => setTF("All")}>All Tiers</button>
        {TIERS.map(t => <button key={t} type="button" style={s.fb(tF === t, tc(t))} onClick={() => setTF(t)}>{t}</button>)}
      </div>
      <div style={{ ...s.fR, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: P.t3, marginRight: 2, fontWeight: 700, letterSpacing: .5 }}>SORT</span>
        {SORTS.map(o => <button key={o.key} type="button" style={s.fb(sort === o.key, P.purp)} onClick={() => setSort(o.key)}>{o.label}</button>)}
      </div>
      <div style={{ fontSize: 11, color: P.t3, marginBottom: 8 }}>{flt.length} hero{flt.length === 1 ? "" : "es"}{favOnly ? " · favorites" : ""}</div>
      {flt.length === 0 && <div style={{ textAlign: "center", padding: 28, color: P.t3 }}><div style={{ fontSize: 30 }}>{favOnly ? "★" : "🔍"}</div><div style={{ fontSize: 13, marginTop: 8 }}>{favOnly ? "No favorites yet — tap ☆ on any hero." : "No heroes match these filters."}</div></div>}
      {flt.map(h => {
        const fav = favSet.has(h.n);
        return (
          <div key={h.n} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "stretch" }}>
            <button type="button" style={{ ...s.cd2, ...s.btnReset, marginBottom: 0, flex: 1 }} onClick={() => onSelectHero(h)}>
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
            <button type="button" onClick={() => toggleFav && toggleFav(h.n)} aria-pressed={fav} aria-label={fav ? `Remove ${h.n} from favorites` : `Add ${h.n} to favorites`}
              style={{ appearance: "none", flex: "0 0 auto", width: 46, background: fav ? `${P.gold}1f` : "rgba(255,255,255,.03)", border: `1px solid ${fav ? P.gold : P.brd}`, borderRadius: 14, color: fav ? P.gold : P.t3, fontSize: 20, cursor: "pointer" }}>
              {fav ? "★" : "☆"}
            </button>
          </div>
        );
      })}
    </>
  );
}
