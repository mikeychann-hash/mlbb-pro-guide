import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { getMacro } from "../../data/index.js";

export function MacroView() {
  const { phases: PHASES, cats: MACRO_CATS } = getMacro();
  return (
    <>
      <div style={{ background: `linear-gradient(135deg,${P.gold}0c,${P.purp}08)`, border: `1px solid ${P.gold}33`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: P.gold }}>🧠 Macro Strategy</div>
        <div style={{ fontSize: 11, color: P.t2, marginTop: 4, lineHeight: 1.6 }}>Macro wins games more than mechanics. Understanding game phases, objective timing, wave management, and team coordination separates Mythic from Legend.</div>
      </div>
      <div style={s.sc}>⏱️ Game Phases</div>
      {PHASES.map((p, i) => (
        <div key={i} style={{ ...s.cd2, cursor: "default", borderLeft: `3px solid ${P.gold}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 14, fontWeight: 900, color: P.gold }}>{p.i} {p.ph}</div></div>
          <div style={{ fontSize: 10, color: P.neon, marginTop: 2, fontWeight: 600 }}>Goal: {p.g}</div>
          <div style={{ marginTop: 6 }}>{p.r.map((r, j) => (<div key={j} style={{ padding: "3px 0", fontSize: 11, color: P.t2, lineHeight: 1.5 }}><span style={{ color: P.gold }}>•</span> {r}</div>))}</div>
        </div>
      ))}
      <div style={s.sc}>📚 Strategy by Category</div>
      {MACRO_CATS.map(cat => (
        <div key={cat.c} style={{ ...s.cd2, cursor: "default" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: P.gold, marginBottom: 6 }}>{cat.c}</div>
          {cat.t.map((t, i) => (<div key={i} style={{ padding: "3px 0", fontSize: 11, color: P.t2, lineHeight: 1.5 }}><span style={{ color: P.neon }}>•</span> {t}</div>))}
        </div>
      ))}
      <div style={s.tp}>💡 <strong>The #1 Macro Rule:</strong> Turrets &gt; Kills &gt; Jungle Camps. Every kill should convert into a tower, objective, or map control. A 15-0 KDA means nothing if you haven't taken a single turret. Push after EVERY kill.</div>
      <div style={s.sc}>🗺️ Map Variants</div>
      <div style={{ fontSize: 10, color: P.t2, marginBottom: 8 }}>Map variant is shown during draft. Adapt your picks to the terrain.</div>
      {[{ n: "Dangerous Grass", i: "🌿", c: P.nG, fav: "Stealth/burst heroes (Natalia, Helcurt, Selena)", avoid: "Low vision teams", tip: "Extra bushes = more ambush spots. Face-check carefully. Vision is critical." },
      { n: "Broken Walls", i: "🧱", c: P.gold, fav: "Mobile/dash heroes (Fanny, Ling, Lancelot, Hilda)", avoid: "Immobile heroes", tip: "Gaps in walls = flanking routes. Dash heroes bypass terrain. More gank angles." },
      { n: "Expanding Rivers", i: "🌊", c: P.blue, fav: "Roamers/junglers (Mathilda, Chip, Fredrinn)", avoid: "Slow rotators", tip: "Wider rivers = faster rotations. Roamers and junglers arrive everywhere first." },
      { n: "Flying Cloud", i: "☁️", c: P.purp, fav: "Defensive/counter-rotate teams", avoid: "Aggressive early comps", tip: "Movement clouds favor defensive play. Better disengages and counter-rotations." },
      ].map(m => (
        <div key={m.n} style={{ ...s.cd2, cursor: "default", borderLeft: `3px solid ${m.c}` }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: m.c }}>{m.i} {m.n}</div>
          <div style={{ fontSize: 10, color: P.nG, marginTop: 3 }}>✅ Favors: {m.fav}</div>
          <div style={{ fontSize: 10, color: P.red, marginTop: 2 }}>🚫 Avoid: {m.avoid}</div>
          <div style={{ fontSize: 10, color: P.t3, marginTop: 2, fontStyle: "italic" }}>💡 {m.tip}</div>
        </div>
      ))}
      <div style={s.sc}>🏆 Rank Climbing Cheat Sheet</div>
      <div style={{ background: P.cd, border: `1px solid ${P.gold}33`, borderRadius: 10, padding: 12 }}>
        {[
          { rank: "Warrior→Elite", tip: "Learn 1 hero well. Focus on not dying. Last-hit minions.", icon: "🥉" },
          { rank: "Master→Grandmaster", tip: "Master 2-3 heroes per role. Learn when to push towers after kills.", icon: "🥈" },
          { rank: "Epic→Legend", tip: "Draft phase begins. Learn counter-picking. Communicate roles. Objective focus.", icon: "🥇" },
          { rank: "Legend→Mythic", tip: "Macro > Micro. Wave management, vision control, rotation timing. Counter-build.", icon: "💎" },
          { rank: "Mythic→Mythical Glory", tip: "Master 2+ roles. Predict enemy movements. Lead team calls. Review replays.", icon: "👑" },
        ].map(r => (
          <div key={r.rank} style={{ padding: "8px 0", borderBottom: `1px solid ${P.brd}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20 }}>{r.icon}</span>
            <div><div style={{ fontSize: 12, fontWeight: 700, color: P.gold }}>{r.rank}</div><div style={{ fontSize: 11, color: P.t2, marginTop: 2 }}>{r.tip}</div></div>
          </div>
        ))}
      </div>
    </>
  );
}
