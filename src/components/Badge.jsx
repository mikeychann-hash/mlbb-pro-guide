import { P } from "../theme/palette.js";

// Renders NEW / ↑ / ↓ for a hero change record, or null.
export function Badge({ change }) {
  if (!change) return null;
  const items = [];
  if (change.isNew) items.push(["NEW", P.neon]);
  if (change.trend === "up") items.push(["↑", P.nG]);
  if (change.trend === "down") items.push(["↓", P.red]);
  if (!items.length) return null;
  return (
    <>
      {items.map(([t, c]) => (
        <span key={t} style={{ fontSize: 8, fontWeight: 900, color: c, marginLeft: 4, verticalAlign: "middle" }}>{t}</span>
      ))}
    </>
  );
}
