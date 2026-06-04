import { P } from "./palette.js";

const DISPLAY = "'Oxanium', system-ui, sans-serif";

// Esports tactical-HUD theme. Atoms are consumed by every feature view, so
// refining them here restyles the whole app at once.
export const s = {
  root: { fontFamily: "'Rajdhani',system-ui,sans-serif", color: P.t1, minHeight: "100vh", position: "relative" },

  // centered column so content doesn't stretch edge-to-edge on tablets
  wrap: { maxWidth: 680, margin: "0 auto", position: "relative" },

  hdr: { padding: "20px 16px 15px", textAlign: "center", position: "relative", overflow: "hidden", borderBottom: `1px solid ${P.brd}`, background: "linear-gradient(180deg, rgba(13,22,40,.72), rgba(6,10,19,0))" },
  glow: { position: "absolute", top: -70, left: "50%", transform: "translateX(-50%)", width: 300, height: 130, background: `radial-gradient(ellipse, ${P.gold}33, transparent 70%)`, pointerEvents: "none" },
  title: { fontFamily: DISPLAY, fontSize: 23, fontWeight: 800, letterSpacing: 1.2, color: P.gold, textShadow: `0 0 16px ${P.gold}44`, margin: 0, lineHeight: 1.08 },
  sub: { fontSize: 11, color: P.t2, marginTop: 6, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 },

  tbs: { display: "flex", overflowX: "auto", gap: 6, padding: "10px 12px", position: "sticky", top: 0, zIndex: 20, background: "#080d18", borderBottom: `1px solid ${P.brd}` },
  tb: a => ({ fontFamily: DISPLAY, padding: "10px 16px", fontSize: 13, fontWeight: a ? 800 : 600, letterSpacing: .4, color: a ? "#0a0a0a" : P.t2, background: a ? P.gold : "rgba(255,255,255,.05)", border: `1px solid ${a ? P.gold : P.brd}`, borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap", boxShadow: a ? `0 3px 14px ${P.gold}66` : "none", flex: "0 0 auto", minHeight: 40 }),

  ct: { padding: "14px 12px 30px" },

  ip: { width: "100%", padding: "11px 14px", background: "rgba(17,26,46,.7)", border: `1px solid ${P.brd}`, borderRadius: 12, color: P.t1, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10, fontFamily: "inherit", fontWeight: 500 },
  fR: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  fb: (a, c) => ({ fontFamily: DISPLAY, padding: "8px 14px", fontSize: 12, fontWeight: a ? 700 : 600, background: a ? (c || P.gold) + "22" : "rgba(255,255,255,.035)", color: a ? (c || P.gold) : P.t2, border: `1px solid ${a ? (c || P.gold) + "77" : P.brd}`, borderRadius: 999, cursor: "pointer", letterSpacing: .3, minHeight: 38 }),

  cd2: { background: "linear-gradient(180deg, rgba(21,31,54,.62), rgba(12,19,34,.62))", border: `1px solid ${P.brd}`, borderRadius: 14, padding: "13px 14px", marginBottom: 8, cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,.28)" },
  bg: (c, fl) => ({ display: "inline-block", padding: "3px 9px", borderRadius: 7, fontSize: 11, fontWeight: 700, letterSpacing: .4, background: fl ? c : (c || P.gold) + "1f", color: fl ? "#070707" : c || P.gold, marginRight: 4, border: `1px solid ${fl ? "transparent" : (c || P.gold) + "44"}` }),
  sc: { fontFamily: DISPLAY, fontSize: 15, fontWeight: 800, letterSpacing: .6, color: P.t1, margin: "18px 0 10px", paddingLeft: 10, borderLeft: `3px solid ${P.gold}`, textTransform: "uppercase" },
  tp: { background: `linear-gradient(180deg, ${P.blue}14, ${P.blue}06)`, border: `1px solid ${P.blue}33`, borderRadius: 11, padding: "12px 14px", fontSize: 13, color: `${P.blue}ee`, lineHeight: 1.65, marginTop: 10 },
  bk: { fontFamily: DISPLAY, background: "rgba(255,255,255,.035)", border: `1px solid ${P.brd}`, borderRadius: 10, padding: "10px 18px", color: P.t1, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 12, letterSpacing: .5, minHeight: 40 },
  ch: c => ({ display: "inline-flex", alignItems: "center", gap: 4, padding: "7px 13px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, background: c + "18", color: c, border: `1px solid ${c}3a`, marginRight: 4, marginBottom: 4, cursor: "pointer", letterSpacing: .2 }),
  wr: v => ({ fontFamily: DISPLAY, fontSize: 13, fontWeight: 800, color: v >= 52 ? P.nG : v >= 51 ? P.gold : v >= 50 ? P.t2 : P.red }),
  br2: (pct, c) => ({ height: 5, borderRadius: 999, background: `${c}22`, overflow: "hidden", position: "relative", marginTop: 5 }),
  bf2: (pct, c) => ({ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(pct, 100)}%`, background: `linear-gradient(90deg, ${c}, ${c}aa)`, borderRadius: 999, boxShadow: `0 0 8px ${c}88` }),
};
