import { s } from "../../theme/styles.js";
import { P } from "../../theme/palette.js";
import { useData } from "../../data/DataContext.jsx";

function agoLabel(iso) {
  if (!iso) return "bundled (no live sync yet)";
  const diff = Date.now() - Date.parse(iso);
  if (Number.isNaN(diff)) return "bundled";
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "less than an hour ago";
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

export function UpdatesView({ onSelectHero, favorites = [] }) {
  const { data, diff, lastUpdated, source, status, error, refresh, getMeta } = useData();
  const meta = getMeta();
  const open = (n) => { const f = data.heroes.find((h) => h.n === n); if (f) onSelectHero(f); };
  const favSet = new Set(favorites.map((f) => f.toLowerCase()));
  const isFav = (n) => favSet.has((n || "").toLowerCase());
  const myChanges = diff ? [
    ...diff.newHeroes.filter(isFav).map((n) => ({ n, type: "NEW", color: P.neon, text: "added to roster" })),
    ...diff.buffed.filter((x) => isFav(x.n)).map((x) => ({ n: x.n, type: "BUFF ↑", color: P.nG, text: `${x.from}% → ${x.to}%` })),
    ...diff.nerfed.filter((x) => isFav(x.n)).map((x) => ({ n: x.n, type: "NERF ↓", color: P.red, text: `${x.from}% → ${x.to}%` })),
    ...diff.tierUp.filter((x) => isFav(x.n)).map((x) => ({ n: x.n, type: "TIER ↑", color: P.gold, text: `${x.from} → ${x.to}` })),
    ...diff.tierDown.filter((x) => isFav(x.n)).map((x) => ({ n: x.n, type: "TIER ↓", color: P.red, text: `${x.from} → ${x.to}` })),
  ] : [];
  const Section = ({ title, names, render }) => (
    names && names.length ? (
      <>
        <div style={s.sc}>{title} <span style={{ fontSize: 10, color: P.t3 }}>({names.length})</span></div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>{names.map(render)}</div>
      </>
    ) : null
  );
  const noChanges = !diff || (!diff.newHeroes.length && !diff.buffed.length && !diff.nerfed.length && !diff.tierUp.length && !diff.tierDown.length);
  return (
    <>
      <div style={{ background: `linear-gradient(135deg,${P.neon}0c,${P.gold}08)`, border: `1px solid ${P.neon}33`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: P.neon }}>🛰️ Updates</div>
        <div style={{ fontSize: 11, color: P.t2, marginTop: 4 }}>Patch {data.patch?.v} · Data {source === "bundled" ? "bundled" : "live"} · updated {agoLabel(lastUpdated)}</div>
        <button onClick={refresh} disabled={status === "syncing"} style={{ marginTop: 8, padding: "6px 14px", background: "transparent", border: `1px solid ${P.neon}55`, borderRadius: 8, color: P.neon, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{status === "syncing" ? "Syncing…" : "↻ Check for updates"}</button>
        {error && <div style={{ fontSize: 9, color: P.t3, marginTop: 6 }}>Offline or remote unavailable — showing last known data.</div>}
      </div>

      <div style={s.sc}>⭐ Your Heroes This Patch</div>
      {favorites.length === 0 ? (
        <div style={{ fontSize: 11, color: P.t3, padding: "4px 0 8px" }}>Star heroes (☆ in the Heroes tab) to track how each patch affects them here.</div>
      ) : myChanges.length === 0 ? (
        <div style={{ fontSize: 11, color: P.t2, padding: "4px 0 8px" }}>✅ Your {favorites.length} favorite{favorites.length === 1 ? "" : "s"} are unchanged this patch.</div>
      ) : (
        myChanges.map((c, i) => (
          <button key={c.n + i} type="button" onClick={() => open(c.n)} style={{ ...s.cd2, ...s.btnReset, display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: `3px solid ${c.color}` }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>⭐ {c.n}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.type} <span style={{ color: P.t3, fontWeight: 500 }}>{c.text}</span></span>
          </button>
        ))
      )}

      {noChanges && (
        <div style={{ textAlign: "center", padding: 24, color: P.t3 }}>
          <div style={{ fontSize: 34 }}>✅</div>
          <div style={{ fontSize: 13, marginTop: 8 }}>No changes since your last update.</div>
          <div style={{ fontSize: 10, marginTop: 4 }}>New heroes and buff/nerf changes will appear here after the next data sync.</div>
        </div>
      )}

      {diff && <>
        <Section title="🆕 New Heroes" names={diff.newHeroes} render={(n) => <span key={n} style={s.ch(P.neon)} onClick={() => open(n)}>{n}</span>} />
        <Section title="📈 Buffed (↑ win rate)" names={diff.buffed.map((x) => x.n)} render={(n) => <span key={n} style={s.ch(P.nG)} onClick={() => open(n)}>{n} ↑</span>} />
        <Section title="📉 Nerfed (↓ win rate)" names={diff.nerfed.map((x) => x.n)} render={(n) => <span key={n} style={s.ch(P.red)} onClick={() => open(n)}>{n} ↓</span>} />
        <Section title="⬆️ Tier Up" names={diff.tierUp.map((x) => `${x.n} ${x.from}→${x.to}`)} render={(n) => <span key={n} style={s.ch(P.gold)}>{n}</span>} />
        <Section title="⬇️ Tier Down" names={diff.tierDown.map((x) => `${x.n} ${x.from}→${x.to}`)} render={(n) => <span key={n} style={s.ch(P.t2)}>{n}</span>} />
      </>}

      <div style={s.sc}>📋 Patch {meta.patch?.v} Highlights</div>
      <div style={{ fontSize: 10, color: P.t3, marginBottom: 8 }}>Season {meta.patch?.s} · {meta.patch?.d} · compiled from current meta movement</div>
      {data.patchNotes && data.patchNotes.length ? data.patchNotes.map((p, i) => (
        <div key={i} style={{ ...s.cd2, cursor: "default" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: P.gold }}>{p.version} <span style={{ fontSize: 11, color: P.t3 }}>{p.date}</span></div>
          {p.summary && <div style={{ fontSize: 12, color: P.t2, marginTop: 3 }}>{p.summary}</div>}
          {(p.changes || []).map((c, j) => <div key={j} style={{ fontSize: 11, color: P.t2, marginTop: 2 }}>• {c.hero ? <strong>{c.hero}: </strong> : null}{c.text}</div>)}
        </div>
      )) : (
        <>
          {(meta.rising || []).map((r) => (
            <button key={"u" + r.n} type="button" style={{ ...s.cd2, ...s.btnReset, borderLeft: `3px solid ${P.nG}` }} onClick={() => open(r.n)}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 13, fontWeight: 700 }}>📈 {r.n}</span><span style={{ fontSize: 11, color: P.nG, fontWeight: 700 }}>{r.ch}</span></div>
              <div style={{ fontSize: 11, color: P.t2, marginTop: 2 }}>{r.w}</div>
            </button>
          ))}
          {(meta.falling || []).map((f) => (
            <button key={"d" + f.n} type="button" style={{ ...s.cd2, ...s.btnReset, borderLeft: `3px solid ${P.red}` }} onClick={() => open(f.n)}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 13, fontWeight: 700 }}>📉 {f.n}</span><span style={{ fontSize: 11, color: P.red, fontWeight: 700 }}>{f.ch}</span></div>
              <div style={{ fontSize: 11, color: P.t2, marginTop: 2 }}>{f.w}</div>
            </button>
          ))}
        </>
      )}
    </>
  );
}
