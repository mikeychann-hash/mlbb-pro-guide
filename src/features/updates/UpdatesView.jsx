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

export function UpdatesView({ onSelectHero }) {
  const { data, diff, lastUpdated, source, status, error, refresh } = useData();
  const open = (n) => { const f = data.heroes.find((h) => h.n === n); if (f) onSelectHero(f); };
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

      <div style={s.sc}>📋 Patch Notes</div>
      {data.patchNotes && data.patchNotes.length ? data.patchNotes.map((p, i) => (
        <div key={i} style={{ ...s.cd2, cursor: "default" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: P.gold }}>{p.version} <span style={{ fontSize: 10, color: P.t3 }}>{p.date}</span></div>
          {p.summary && <div style={{ fontSize: 11, color: P.t2, marginTop: 3 }}>{p.summary}</div>}
          {(p.changes || []).map((c, j) => <div key={j} style={{ fontSize: 10, color: P.t2, marginTop: 2 }}>• {c.hero ? <strong>{c.hero}: </strong> : null}{c.text}</div>)}
        </div>
      )) : <div style={{ fontSize: 11, color: P.t3, padding: "8px 0" }}>Patch notes will populate when the official-notes source is enabled. For now, see the Meta tab for the current patch summary.</div>}
    </>
  );
}
