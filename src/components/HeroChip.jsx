import { s } from "../theme/styles.js";
import { ri } from "../theme/palette.js";

// A clickable hero chip. `color` sets the chip's theme color.
export function HeroChip({ hero, color, onClick, suffix }) {
  return (
    <span style={s.ch(color)} onClick={onClick}>
      {ri(hero.r)} {hero.n}{suffix}
    </span>
  );
}
