export const emptyDraft = () => ({
  t1: { b: [], p: [] },
  t2: { b: [], p: [] },
  phase: "ban1",   // ban1 | pick1 | ban2 | pick2 | done
  turn: 1,         // 1 = Blue, 2 = Red
});

export function selectHero(draft, name) {
  const t1 = { b: [...draft.t1.b], p: [...draft.t1.p] };
  const t2 = { b: [...draft.t2.b], p: [...draft.t2.p] };
  let { phase, turn } = draft;

  if (phase.startsWith("ban")) {
    (turn === 1 ? t1.b : t2.b).push(name);
    const totalBans = t1.b.length + t2.b.length;
    if (phase === "ban1" && totalBans >= 6) { phase = "pick1"; turn = 1; }
    else if (phase === "ban2" && totalBans >= 10) { phase = "pick2"; turn = 1; }
    else { turn = turn === 1 ? 2 : 1; }
  } else {
    (turn === 1 ? t1.p : t2.p).push(name);
    const totalPicks = t1.p.length + t2.p.length;
    if (phase === "pick1" && totalPicks >= 6) { phase = "ban2"; turn = 1; }
    else if (totalPicks >= 10) { phase = "done"; }
    else { turn = turn === 1 ? 2 : 1; }
  }
  return { t1, t2, phase, turn };
}
