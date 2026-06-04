import { useMemo, useState } from "react";
import { s } from "../../theme/styles.js";
import { P, rc, ri } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";
import { copyText } from "../../services/clipboard.js";
import { draftCoach } from "./draftCoach.js";
import { Portrait } from "../../components/Portrait.jsx";

export function DraftView({ draft, onSelect, onReset, dQ, setDQ, favorites = [] }) {
  const { getHeroes, getHeroByName } = useData();
  const H = getHeroes();
  const coach = draftCoach(draft, H, favorites);
  const { t1: d1, t2: d2, phase: dP, turn: dT } = draft;
  const [copied, setCopied] = useState(null);
  const avgWr = (t) => { const picks = t.p.map(p => getHeroByName(p)).filter(Boolean); return picks.length ? (picks.reduce((a, p) => a + p.wr, 0) / picks.length).toFixed(1) : "0"; };
  const copyDraft = async () => {
    const text = `⚔️ MLBB Draft\n` +
      `🔵 BLUE (avg WR ${avgWr(d1)}%)\nPicks: ${d1.p.join(", ") || "—"}\nBans: ${d1.b.join(", ") || "—"}\n\n` +
      `🔴 RED (avg WR ${avgWr(d2)}%)\nPicks: ${d2.p.join(", ") || "—"}\nBans: ${d2.b.join(", ") || "—"}`;
    const ok = await copyText(text);
    setCopied(ok ? "✓ Copied!" : "Copy failed");
    setTimeout(() => setCopied(null), 2000);
  };
  const allD = [...d1.b, ...d2.b, ...d1.p, ...d2.p];
  const dAv = useMemo(() => {
    let h = H.filter(x => !allD.includes(x.n));
    if (dQ) h = h.filter(x => x.n.toLowerCase().includes(dQ.toLowerCase()));
    return h;
  }, [H, allD.join(","), dQ]);
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>{[{ t: d1, l: "Blue", c: P.blue }, { t: d2, l: "Red", c: P.red }].map(({ t, l, c }, ti) => (
        <div key={ti} style={{ background: P.cd, border: `1px solid ${c}33`, borderRadius: 8, padding: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: c, textAlign: "center", marginBottom: 4 }}>{l}</div>
          <div style={{ fontSize: 9, color: P.t3 }}>Bans:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 2, minHeight: 18, marginBottom: 4 }}>{t.b.map((b, i) => <span key={i} style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: `${P.red}22`, color: P.red, textDecoration: "line-through" }}>{b}</span>)}</div>
          <div style={{ fontSize: 9, color: P.t3 }}>Picks:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minHeight: 18 }}>{t.p.map((p, i) => { const h = getHeroByName(p); return <span key={i} style={{ fontSize: 10, padding: "2px 5px", borderRadius: 3, background: `${c}15`, color: c }}>{h ? ri(h.r) : ""} {p}</span>; })}</div>
        </div>
      ))}</div>
      <div style={{ textAlign: "center", marginBottom: 6 }}>{dP !== "done" ? <><span style={{ fontSize: 12, fontWeight: 800, color: dT === 1 ? P.blue : P.red }}>{dT === 1 ? "Blue" : "Red"}</span><span style={{ fontSize: 11, color: P.t2 }}> — {dP.includes("ban") ? "BAN" : "PICK"}</span></> : <div style={{ fontSize: 13, fontWeight: 800, color: P.nG }}>✅ Draft Complete!</div>}</div>
      {coach && (
        <div style={{ background: `linear-gradient(180deg, ${P.gold}14, ${P.gold}06)`, border: `1px solid ${P.gold}44`, borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
          <div style={{ fontFamily: "'Oxanium',sans-serif", fontSize: 13, fontWeight: 800, color: P.gold, letterSpacing: .5 }}>🎯 COACH · {coach.team} {coach.phase === "ban" ? "BAN" : "PICK"}</div>
          <div style={{ fontSize: 10, color: P.t3, margin: "2px 0 8px" }}>Tap a suggestion to {coach.phase === "ban" ? "ban" : "pick"} it</div>
          {coach.picks.map((p, i) => {
            const h = getHeroByName(p.n);
            return (
              <button key={p.n} type="button" onClick={() => onSelect(p.n)} style={{ ...s.btnReset, display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", marginBottom: 4, background: i === 0 ? `${P.gold}1a` : "rgba(255,255,255,.03)", border: `1px solid ${i === 0 ? P.gold + "66" : P.brd}`, borderRadius: 9, cursor: "pointer" }}>
                {h && <Portrait hero={h} size={30} radius={7} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: P.t1 }}>{i === 0 ? "⭐ " : ""}{p.n}</div>
                  <div style={{ fontSize: 10, color: P.t2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.reason}</div>
                </div>
              </button>
            );
          })}
          {coach.avoid && coach.avoid.length > 0 && (
            <div style={{ marginTop: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: P.red, letterSpacing: .5, marginBottom: 3 }}>🚫 AVOID</div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>{coach.avoid.map(a => <span key={a.n} title={a.reason} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 999, background: `${P.red}14`, color: P.red, border: `1px solid ${P.red}33`, marginRight: 4, marginBottom: 4 }}>{a.n}</span>)}</div>
            </div>
          )}
        </div>
      )}
      {dP !== "done" && <><input style={s.ip} placeholder="🔍 Search..." value={dQ} onChange={e => setDQ(e.target.value)} /><div style={{ display: "flex", flexWrap: "wrap", gap: 3, maxHeight: 250, overflowY: "auto" }}>{dAv.slice(0, 40).map(h => <span key={h.n} style={s.ch(dP.includes("ban") ? P.red : dT === 1 ? P.blue : P.red)} onClick={() => onSelect(h.n)}>{ri(h.r)} {h.n}</span>)}</div></>}
      <button style={{ marginTop: 8, padding: "6px 0", background: "transparent", border: `1px solid ${P.gold}`, borderRadius: 6, color: P.gold, fontSize: 11, cursor: "pointer", width: "100%", fontFamily: "inherit" }} onClick={onReset}>🔄 Reset</button>
      {dP === "done" && <button type="button" onClick={copyDraft} style={{ width: "100%", marginTop: 8, padding: "9px 0", background: `${P.neon}1a`, border: `1px solid ${P.neon}55`, borderRadius: 8, color: P.neon, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{copied || "📋 Copy draft"}</button>}
      {dP === "done" && <>{[{ t: d1, l: "Blue", c: P.blue }, { t: d2, l: "Red", c: P.red }].map(({ t, l, c }) => {
        const picks = t.p.map(p => getHeroByName(p)).filter(Boolean);
        const roles = picks.map(p => p.r);
        const w = [];
        if (!roles.includes("Tank") && !picks.some(p => p.r2 === "Tank")) w.push("No tank");
        if (!roles.includes("Mage") && !picks.some(p => p.r2 === "Mage")) w.push("No mage");
        if (!roles.includes("Marksman")) w.push("No MM");
        const avg = picks.length ? (picks.reduce((a, p) => a + p.wr, 0) / picks.length).toFixed(1) : 0;
        return (<div key={l} style={{ ...s.cd2, borderLeft: `3px solid ${c}`, marginTop: 8, cursor: "default" }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, fontWeight: 800, color: c }}>{l}</span><span style={{ fontSize: 11, color: P.t2 }}>Avg WR: {avg}%</span></div><div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>{picks.map(p => <span key={p.n} style={s.bg(rc(p.r))}>{ri(p.r)} {p.n}</span>)}</div>{w.length ? w.map((x, i) => <div key={i} style={{ fontSize: 10, color: P.gold, marginTop: 2 }}>⚠️ {x}</div>) : <div style={{ fontSize: 10, color: P.nG, marginTop: 2 }}>✅ Balanced</div>}</div>);
      })}</>}
    </>
  );
}
