import { s } from "../theme/styles.js";
import { P, ri } from "../theme/palette.js";
import { useData } from "../data/DataContext.jsx";

// Autocomplete text input that suggests hero names.
export function SugBox({ val, onPick, placeholder }) {
  const { getHeroes } = useData();
  const H = getHeroes();
  const sg = val.length < 1 ? [] : H.filter(h => h.n.toLowerCase().includes(val.toLowerCase())).slice(0, 6);
  const found = H.find(h => h.n.toLowerCase() === val.toLowerCase());
  return (
    <div style={{ position: "relative", flex: 1 }}>
      <input style={{ ...s.ip, marginBottom: 0 }} placeholder={placeholder} value={val} onChange={e => onPick(e.target.value)} />
      {val && !found && sg.length > 0 && (
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, background: P.cd, border: `1px solid ${P.brd}`, borderRadius: 8, zIndex: 10, maxHeight: 180, overflow: "auto" }}>
          {sg.map(h => (
            <button key={h.n} type="button" style={{ display: "block", width: "100%", textAlign: "left", appearance: "none", background: "transparent", color: "inherit", fontFamily: "inherit", padding: "9px 12px", fontSize: 13, cursor: "pointer", border: "none", borderBottom: `1px solid ${P.brd}` }} onClick={() => onPick(h.n)}>
              {ri(h.r)} {h.n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
