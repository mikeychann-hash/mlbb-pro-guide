import { useMemo, useState } from "react";
import { s } from "../../theme/styles.js";
import { P, rc, ri } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";
import { copyText } from "../../services/clipboard.js";
import { draftCoach } from "./draftCoach.js";
import { stepInfo } from "./draftLogic.js";
import { Portrait } from "../../components/Portrait.jsx";

const isMagic = (h) => h.r === "Mage" || h.r2 === "Mage";

export function DraftView({ draft, onSelect, onReset, onUndo, dQ, setDQ, favorites = [] }) {
  const { getHeroes, getHeroByName } = useData();
  const H = getHeroes();
  const coach = draftCoach(draft, H, favorites);
  const { t1: d1, t2: d2, phase: dP, turn: dT } = draft;
  const si = stepInfo(draft);
  const [copied, setCopied] = useState(null);
  const [side, setSide] = useState(1); // 1 = Blue is "you", 2 = Red
  const myTurn = coach && coach.team === (side === 1 ? "Blue" : "Red");
  const LANES = ["EXP", "Jungle", "Mid", "Gold", "Roam"];

  const picksOf = (t) => t.p.map((p) => getHeroByName(p)).filter(Boolean);
  const avgWr = (t) => { const ps = picksOf(t); return ps.length ? (ps.reduce((a, p) => a + (p.wr || 0), 0) / ps.length).toFixed(1) : "0"; };

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
    let h = H.filter((x) => !allD.includes(x.n));
    if (dQ) h = h.filter((x) => x.n.toLowerCase().includes(dQ.toLowerCase()));
    return h;
  }, [H, allD.join(","), dQ]);

  const TeamCol = ({ t, label, color, isTurn, isYou }) => (
    <div style={{ background: P.cd, border: `1px solid ${isTurn ? color : color + "33"}`, borderRadius: 10, padding: 8, boxShadow: isTurn ? `0 0 0 1px ${color}66` : "none" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 6 }}>
        <span style={{ fontFamily: "'Oxanium',sans-serif", fontSize: 13, fontWeight: 800, color }}>{label}{isTurn ? " ●" : ""}</span>
        {isYou && <span style={{ fontSize: 8, fontWeight: 800, color: "#0a0a0a", background: color, borderRadius: 4, padding: "1px 5px", letterSpacing: .5 }}>YOU</span>}
      </div>
      <div style={{ fontSize: 9, color: P.t3, marginBottom: 3, letterSpacing: .5 }}>BANS</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, minHeight: 26, marginBottom: 8 }}>
        {t.b.map((b, i) => {
          const h = getHeroByName(b);
          return (
            <div key={i} title={b} style={{ position: "relative", width: 26, height: 26, borderRadius: 6, overflow: "hidden", border: `1px solid ${P.brd}`, background: P.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {h && h.img ? <div style={{ position: "absolute", inset: 0, backgroundImage: `url("${h.img}")`, backgroundSize: "cover", backgroundPosition: "center top", filter: "grayscale(1)", opacity: .65 }} /> : <span style={{ fontSize: 13, opacity: .6 }}>{h ? ri(h.r) : "?"}</span>}
              <div style={{ position: "absolute", inset: 0, background: `${P.red}40` }} />
              <div style={{ position: "absolute", left: 1, right: 1, top: "45%", height: 2, background: P.red, transform: "rotate(-20deg)" }} />
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 9, color: P.t3, marginBottom: 3, letterSpacing: .5 }}>PICKS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, minHeight: 26 }}>
        {t.p.map((p, i) => {
          const h = getHeroByName(p);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              {h && <Portrait hero={h} size={28} radius={6} />}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: P.t1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p}</div>
                {h && <div style={{ fontSize: 9, color: P.t3 }}>{h.r} · {h.l}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const Analysis = ({ t, label, color }) => {
    const ps = picksOf(t);
    const roles = ps.map((p) => p.r);
    const magic = ps.filter(isMagic).length;
    const phys = ps.length - magic;
    const frontline = ps.filter((p) => ["Tank", "Fighter"].includes(p.r) || ["Tank", "Fighter"].includes(p.r2)).length;
    const warn = [];
    if (!roles.includes("Tank") && !ps.some((p) => p.r2 === "Tank")) warn.push("No tank");
    if (magic === 0) warn.push("No magic damage");
    if (phys === 0) warn.push("No physical damage");
    if (!roles.includes("Marksman")) warn.push("No marksman");
    if (frontline === 0) warn.push("No frontline");
    return (
      <div style={{ ...s.cd2, borderLeft: `3px solid ${color}`, marginTop: 8, cursor: "default" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color }}>{label}</span>
          <span style={{ fontSize: 11, color: P.t2 }}>Avg WR {avgWr(t)}% · {phys}⚔ / {magic}🔮 · {frontline} frontline</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 5 }}>{ps.map((p) => <span key={p.n} style={s.bg(rc(p.r))}>{ri(p.r)} {p.n}</span>)}</div>
        <div style={{ display: "flex", gap: 4, marginTop: 7 }}>{LANES.map((l) => {
          const c = ps.filter((p) => p.l === l).length;
          const col = c === 1 ? P.nG : c > 1 ? P.gold : P.t3;
          return <div key={l} style={{ flex: 1, textAlign: "center", fontSize: 9, fontWeight: 700, padding: "4px 0", borderRadius: 6, background: c === 1 ? `${P.nG}1a` : c > 1 ? `${P.gold}1a` : "rgba(255,255,255,.03)", color: col, border: `1px solid ${c ? col + "44" : P.brd}` }}>{l}<br />{c === 1 ? "✓" : c > 1 ? `×${c}` : "–"}</div>;
        })}</div>
        {warn.length ? warn.map((x, i) => <div key={i} style={{ fontSize: 11, color: P.gold, marginTop: 4 }}>⚠️ {x}</div>) : <div style={{ fontSize: 11, color: P.nG, marginTop: 4 }}>✅ Well-rounded composition</div>}
      </div>
    );
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8, fontSize: 11, color: P.t3 }}>
        <span style={{ fontWeight: 700 }}>You are</span>
        <button type="button" onClick={() => setSide(1)} style={{ ...s.fb(side === 1, P.blue), padding: "5px 14px" }}>🔵 Blue</button>
        <button type="button" onClick={() => setSide(2)} style={{ ...s.fb(side === 2, P.red), padding: "5px 14px" }}>🔴 Red</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
        <TeamCol t={d1} label="BLUE" color={P.blue} isTurn={dP !== "done" && dT === 1} isYou={side === 1} />
        <TeamCol t={d2} label="RED" color={P.red} isTurn={dP !== "done" && dT === 2} isYou={side === 2} />
      </div>

      <div style={{ textAlign: "center", marginBottom: 8 }}>
        {dP !== "done"
          ? <span style={{ fontFamily: "'Oxanium',sans-serif", fontSize: 14, fontWeight: 800, color: dT === 1 ? P.blue : P.red }}>{dT === 1 ? "BLUE" : "RED"} {si ? `· ${si.action.toUpperCase()} ${si.index}/${si.total}` : ""}</span>
          : <span style={{ fontFamily: "'Oxanium',sans-serif", fontSize: 15, fontWeight: 800, color: P.nG }}>✅ DRAFT COMPLETE</span>}
      </div>

      {coach && (
        <div style={{ background: `linear-gradient(180deg, ${P.gold}14, ${P.gold}06)`, border: `1px solid ${P.gold}44`, borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
          <div style={{ fontFamily: "'Oxanium',sans-serif", fontSize: 13, fontWeight: 800, color: P.gold, letterSpacing: .5 }}>{myTurn ? "🎯 YOUR" : "🔍 ENEMY"} {coach.phase === "ban" ? "BAN" : "PICK"} · {coach.team}</div>
          <div style={{ fontSize: 10, color: P.t3, margin: "2px 0 8px" }}>{myTurn ? `Tap a suggestion to ${coach.phase === "ban" ? "ban" : "pick"} it` : `Likely enemy ${coach.phase === "ban" ? "bans" : "picks"} — plan around these`}</div>
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
              <div style={{ display: "flex", flexWrap: "wrap" }}>{coach.avoid.map((a) => <span key={a.n} title={a.reason} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 999, background: `${P.red}14`, color: P.red, border: `1px solid ${P.red}33`, marginRight: 4, marginBottom: 4 }}>{a.n}</span>)}</div>
            </div>
          )}
        </div>
      )}

      {dP !== "done" && <>
        <input style={s.ip} placeholder="🔍 Search to ban/pick manually..." value={dQ} onChange={(e) => setDQ(e.target.value)} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, maxHeight: 240, overflowY: "auto" }}>
          {dAv.slice(0, 40).map((h) => <button key={h.n} type="button" style={s.ch(dP.includes("ban") ? P.red : dT === 1 ? P.blue : P.red)} onClick={() => onSelect(h.n)}>{ri(h.r)} {h.n}</button>)}
        </div>
      </>}

      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <button type="button" disabled={!draft.step} onClick={onUndo} style={{ flex: 1, padding: "9px 0", background: draft.step ? "rgba(255,255,255,.05)" : "transparent", border: `1px solid ${P.brd}`, borderRadius: 8, color: draft.step ? P.t1 : P.t3, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>↩ Undo</button>
        <button type="button" onClick={onReset} style={{ flex: 1, padding: "9px 0", background: "transparent", border: `1px solid ${P.gold}66`, borderRadius: 8, color: P.gold, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🔄 Reset</button>
        {dP === "done" && <button type="button" onClick={copyDraft} style={{ flex: 1, padding: "9px 0", background: `${P.neon}1a`, border: `1px solid ${P.neon}55`, borderRadius: 8, color: P.neon, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{copied || "📋 Copy"}</button>}
      </div>

      {dP === "done" && <>
        <Analysis t={d1} label="🔵 Blue Analysis" color={P.blue} />
        <Analysis t={d2} label="🔴 Red Analysis" color={P.red} />
      </>}
    </>
  );
}
