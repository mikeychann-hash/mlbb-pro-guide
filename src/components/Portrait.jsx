import { ri, rc } from "../theme/palette.js";

// Hero portrait. Uses a CSS background-image layered OVER an emoji fallback:
// if the image loads it covers the emoji; if it fails to load there is NO broken
// image icon — the role emoji simply shows through. Robust across old WebViews.
export function Portrait({ hero, size = 42, radius = 11 }) {
  const role = rc(hero.r);
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: radius,
        flex: "0 0 auto",
        background: `${role}1c`,
        border: `1px solid ${role}55`,
        overflow: "hidden",
        boxShadow: `0 0 0 1px rgba(0,0,0,.3), 0 4px 12px ${role}22`,
      }}
    >
      {/* emoji fallback (always present, behind the image) */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: Math.round(size * 0.5),
        }}
      >
        {ri(hero.r)}
      </span>
      {/* portrait image on top — invisible (no broken icon) if it fails to load */}
      {hero.img && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("${hero.img}")`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
      )}
    </div>
  );
}
