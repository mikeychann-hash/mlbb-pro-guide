import { useMemo } from "react";
import { s } from "../../theme/styles.js";
import { P, tc, rc, ri } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";
import { Portrait } from "../../components/Portrait.jsx";
import { playNowPlan } from "./playNow.js";

const LANES = ["All", "EXP", "Jungle", "Mid", "Gold", "Roam"];
const TAG = {
  Comfort: { c: P.nG, t: "COMFORT" },
  Favorite: { c: P.pink, t: "FAVORITE" },
  Meta: { c: P.gold, t: "META" },
  Played: { c: P.blue, t: "PLAYED" },
  Struggling: { c: P.red, t: "STRUGGLING" },
};

export function PlayNowView({ tracker = [], favorites = [], lane, setLane, onSelectHero }) {
  const { getHeroes, getHeroByName } = useData();
  const H = getHeroes();
  const plan = useMemo(() => playNowPlan(H, tracker, favorites, { lane }), [H, tracker, favorites, lane]);

  const Pick = ({ label, x, color }) => x && (
    <div style={{ flex: 1, ...s.cd2, cursor: "pointer", marginBottom: 0, borderTop: `2px solid ${color}` }} onClick={() => { const h = getHeroByName(x.n); if (h) onSelectHero(h); }}>
      <div style={{ fontSize: 9, color: P.t3, letterSpacing: .5 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 900, color, fontFamily: "'Oxanium',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.n}</div>
      <div style={{ fontSize: 10, color: P.t2 }}>{x.pWR != null ? `Your ${x.pWR}% · ${x.games}g` : `${x.t}-tier · ${x.wr}% WR`}</div>
    </div>
  );

  return (
    <>
      <div style={{ fontSize: 11, color: P.t2, marginBottom: 10, lineHeight: 1.5 }}>
        What to play <strong style={{ color: P.gold }}>right now</strong> — your tracked results + favorites blended with the live meta.
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
        {LANES.map((l) => <button key={l} type="button" onClick={() => setLane(l)} style={s.fb(lane === l, P.gold)}>{l}</button>)}
      </div>

      {!plan.hasHistory && (
        <div style={{ ...s.cd2, cursor: "default", borderLeft: `3px solid ${P.purp}`, marginBottom: 10 }}>
          <span style={{ fontSize: 11.5, color: P.t2 }}>💡 Log matches in <strong style={{ color: P.purp }}>My Stats</strong> to unlock personal comfort picks. For now this is the live meta{favorites.length ? " + your favorites" : ""}.</span>
        </div>
      )}

      {(plan.comfort || plan.meta) && (
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <Pick label="🟢 YOUR COMFORT" x={plan.comfort} color={P.nG} />
          <Pick label="🟡 META ALTERNATIVE" x={plan.meta} color={P.gold} />
        </div>
      )}

      {plan.list.map((x, i) => {
        const h = getHeroByName(x.n);
        const tg = TAG[x.tag] || TAG.Meta;
        return (
          <div key={x.n} style={{ ...s.cd2, display: "flex", alignItems: "center", gap: 9 }} onClick={() => h && onSelectHero(h)}>
            <span style={{ fontSize: 11, fontWeight: 900, color: P.t3, width: 16, textAlign: "center" }}>{i + 1}</span>
            {h ? <Portrait hero={h} size={36} radius={9} /> : <span style={{ fontSize: 20 }}>{ri(x.r)}</span>}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: P.t1 }}>{x.n}</span>
                <span style={s.bg(tc(x.t), true)}>{x.t}</span>
              </div>
              <div style={{ fontSize: 10.5, color: P.t2, marginTop: 2 }}>
                {ri(x.r)} {x.l} · {x.wr}% WR{x.pWR != null ? ` · you ${x.pWR}% (${x.games}g)` : ""}
              </div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 900, color: tg.c, background: tg.c + "1c", border: `1px solid ${tg.c}55`, borderRadius: 7, padding: "3px 7px", letterSpacing: .3, whiteSpace: "nowrap" }}>{tg.t}</span>
          </div>
        );
      })}
    </>
  );
}
