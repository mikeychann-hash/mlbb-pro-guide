import { useState } from "react";
import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";
import { Portrait } from "../../components/Portrait.jsx";
import { climbPlan } from "./climbPlan.js";

const LANES = ["EXP", "Mid", "Jungle", "Gold", "Roam"];

export function ClimbView({ favorites = [], onSelectHero }) {
  const { getHeroes } = useData();
  const H = getHeroes();
  const [lanes, setLanes] = useState([]);
  const toggle = (l) => setLanes((cur) => (cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l]));
  const plan = climbPlan(H, lanes, favorites);

  const Group = ({ title, color, list, sub }) => (
    list && list.length ? (
      <>
        <div style={s.sc}>{title}</div>
        {sub && <div style={{ fontSize: 10, color: P.t3, margin: "-4px 0 6px" }}>{sub}</div>}
        {list.map((h) => (
          <button key={h.n} type="button" onClick={() => onSelectHero(h)} style={{ ...s.cd2, ...s.btnReset, display: "flex", alignItems: "center", gap: 10, borderLeft: `3px solid ${color}` }}>
            <Portrait hero={h} size={38} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{h.n}</div>
              <div style={{ fontSize: 10, color: P.t3 }}>{h.r} · {h.l} · {h.t} · {h.wr}% WR{h.br ? ` · ${h.br}% ban` : ""}</div>
            </div>
          </button>
        ))}
      </>
    ) : null
  );

  return (
    <>
      <div style={{ background: `linear-gradient(135deg,${P.gold}0c,${P.nG}08)`, border: `1px solid ${P.gold}33`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: P.gold }}>🧗 Climb Plan</div>
        <div style={{ fontSize: 11, color: P.t2, marginTop: 4, lineHeight: 1.5 }}>Pick the lane(s) you queue and I'll build your ranked pool from your favorites + the live meta.</div>
      </div>
      <div style={s.fR}>{LANES.map((l) => <button key={l} type="button" style={s.fb(lanes.includes(l), P.neon)} onClick={() => toggle(l)}>{l}</button>)}</div>
      {favorites.length === 0 && <div style={s.tp}>⭐ Star your comfortable heroes (☆ in the Heroes tab) so they show up as your Mains and Backups.</div>}
      <Group title="🌟 Your Mains" color={P.gold} list={plan.mains} sub="Your strongest favorites for these lanes" />
      <Group title="🔁 Backups" color={P.blue} list={plan.backups} sub="Your next-best favorites" />
      <Group title="📈 Worth Learning" color={P.nG} list={plan.learn} sub="Top-tier picks you don't main yet" />
      <Group title="🚫 Ban Threats" color={P.red} list={plan.banThreats} sub="Highest ban-rate in these lanes" />
      <Group title="⚠️ Avoid This Patch" color={P.t3} list={plan.avoid} sub="Weak-tier right now" />
    </>
  );
}
