import { useState } from "react";
import { ri, rc } from "../theme/palette.js";

// Hero portrait with graceful fallback to the role emoji (used when offline,
// when a hero has no image URL yet, or if the image fails to load).
export function Portrait({ hero, size = 42, radius = 11 }) {
  const [err, setErr] = useState(false);
  const showImg = hero.img && !err;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        flex: "0 0 auto",
        background: showImg ? "#070d18" : `${rc(hero.r)}1c`,
        border: `1px solid ${rc(hero.r)}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontSize: Math.round(size * 0.5),
        boxShadow: `0 0 0 1px rgba(0,0,0,.3), 0 4px 12px ${rc(hero.r)}22`,
      }}
    >
      {showImg ? (
        <img
          src={hero.img}
          alt={hero.n}
          loading="lazy"
          onError={() => setErr(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        ri(hero.r)
      )}
    </div>
  );
}
