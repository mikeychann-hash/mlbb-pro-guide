import { useMemo } from "react";
import { s } from "../../theme/styles.js";
import { P, tc, rc, ri } from "../../theme/palette.js";
import { getHeroByName } from "../../data/index.js";
import { SugBox } from "../../components/SugBox.jsx";

export function CompareView({ cmpA, setCmpA, cmpB, setCmpB }) {
  const heroA = useMemo(() => getHeroByName(cmpA), [cmpA]);
  const heroB = useMemo(() => getHeroByName(cmpB), [cmpB]);
  return (
    <>
      <div style={{ fontSize: 11, color: P.t2, marginBottom: 10 }}>Compare two heroes side-by-side. Win rates, roles, builds, counters & matchups.</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <SugBox val={cmpA} onPick={setCmpA} placeholder="Hero A..." />
        <div style={{ display: "flex", alignItems: "center", color: P.gold, fontWeight: 900, fontSize: 16 }}>VS</div>
        <SugBox val={cmpB} onPick={setCmpB} placeholder="Hero B..." />
      </div>
      {heroA && heroB ? (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[heroA, heroB].map((h, i) => (
              <div key={i} style={{ background: P.cd, border: `1px solid ${i === 0 ? P.blue : P.red}33`, borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: i === 0 ? P.blue : P.red, textAlign: "center" }}>{ri(h.r)} {h.n}</div>
                <div style={{ textAlign: "center", marginTop: 4 }}><span style={s.bg(tc(h.t), true)}>{h.t}</span><span style={s.bg(rc(h.r))}>{h.r}</span><span style={s.bg(P.t2)}>{h.l}</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginTop: 8 }}>
                  {[["WR", h.wr, h.wr >= 52 ? P.nG : h.wr >= 51 ? P.gold : P.t2], ["PR", h.pr, P.blue], ["BR", h.br, h.br >= 30 ? P.red : P.t2]].map(([l, v, c]) => (<div key={l} style={{ background: P.bg, borderRadius: 6, padding: 4, textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 900, color: c }}>{v}%</div><div style={{ fontSize: 7, color: P.t3 }}>{l}</div></div>))}
                </div>
                <div style={{ marginTop: 8, fontSize: 10, color: P.t2 }}>
                  <div><strong style={{ color: P.gold }}>Emblem:</strong> {h.e}</div>
                  <div><strong style={{ color: P.gold }}>Spells:</strong> {h.sp2?.join("/")}</div>
                </div>
                <div style={{ marginTop: 6, fontSize: 9, color: P.red }}>🚫 {h.c.join(", ")}</div>
                <div style={{ marginTop: 3, fontSize: 9, color: P.nG }}>✅ {h.s.join(", ")}</div>
              </div>
            ))}
          </div>
          <div style={{ ...s.cd2, marginTop: 8, cursor: "default", textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: P.gold, marginBottom: 6 }}>⚔️ Head-to-Head</div>
            {heroA.c.includes(heroB.n) ? <div style={{ fontSize: 12, color: P.red, fontWeight: 700 }}>🚫 {heroA.n} is COUNTERED by {heroB.n}</div>
              : heroA.s.includes(heroB.n) ? <div style={{ fontSize: 12, color: P.nG, fontWeight: 700 }}>✅ {heroA.n} is STRONG vs {heroB.n}</div>
                : heroB.c.includes(heroA.n) ? <div style={{ fontSize: 12, color: P.nG, fontWeight: 700 }}>✅ {heroA.n} COUNTERS {heroB.n}</div>
                  : heroB.s.includes(heroA.n) ? <div style={{ fontSize: 12, color: P.red, fontWeight: 700 }}>🚫 {heroB.n} is STRONG vs {heroA.n}</div>
                    : <div style={{ fontSize: 12, color: P.t2 }}>➡️ Neutral matchup — skill-dependent</div>}
            <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 12 }}>
              <div><span style={{ fontSize: 20, fontWeight: 900, color: heroA.wr > heroB.wr ? P.nG : P.t3 }}>{heroA.wr}%</span><div style={{ fontSize: 9, color: P.t3 }}>{heroA.n} WR</div></div>
              <div style={{ fontSize: 20, color: P.t3 }}>vs</div>
              <div><span style={{ fontSize: 20, fontWeight: 900, color: heroB.wr > heroA.wr ? P.nG : P.t3 }}>{heroB.wr}%</span><div style={{ fontSize: 9, color: P.t3 }}>{heroB.n} WR</div></div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "30px", color: P.t3 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚖️</div>
          <div style={{ fontSize: 13 }}>Select two heroes above to compare stats, matchups & builds</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, marginTop: 12 }}>{["Sora vs Julian", "Tigreal vs Atlas", "Hayabusa vs Ling", "Kimmy vs Brody"].map(pair => { const [a, b] = pair.split(" vs "); return <span key={pair} style={s.ch(P.gold)} onClick={() => { setCmpA(a); setCmpB(b); }}>{pair}</span>; })}</div>
        </div>
      )}
    </>
  );
}
