// Real MLBB ranked draft order: 3 bans each (alternating), 6 picks (1-2-2-1
// snake, Blue first), 2 bans each (Red first), 4 picks (2-1-1... R-B-B-R).
// SEQUENCE[i] = [action, team] for the i-th action. team 1 = Blue, 2 = Red.
const SEQUENCE = [
  ["ban", 1], ["ban", 2], ["ban", 1], ["ban", 2], ["ban", 1], ["ban", 2], // ban phase 1
  ["pick", 1], ["pick", 2], ["pick", 2], ["pick", 1], ["pick", 1], ["pick", 2], // pick phase 1
  ["ban", 2], ["ban", 1], ["ban", 2], ["ban", 1], // ban phase 2
  ["pick", 2], ["pick", 1], ["pick", 1], ["pick", 2], // pick phase 2
];
export const DRAFT_STEPS = SEQUENCE.length;

function phaseOf(step) {
  if (step >= 20) return "done";
  if (step >= 16) return "pick2";
  if (step >= 12) return "ban2";
  if (step >= 6) return "pick1";
  return "ban1";
}
const turnAt = (step) => (step < SEQUENCE.length ? SEQUENCE[step][1] : 1);

export const emptyDraft = () => ({
  t1: { b: [], p: [] },
  t2: { b: [], p: [] },
  step: 0,
  phase: "ban1",
  turn: 1,
});

export function selectHero(draft, name) {
  if (draft.phase === "done" || draft.step >= SEQUENCE.length) return draft;
  const [action, team] = SEQUENCE[draft.step];
  const t1 = { b: [...draft.t1.b], p: [...draft.t1.p] };
  const t2 = { b: [...draft.t2.b], p: [...draft.t2.p] };
  const t = team === 1 ? t1 : t2;
  if (action === "ban") t.b.push(name); else t.p.push(name);
  const step = draft.step + 1;
  return { t1, t2, step, phase: phaseOf(step), turn: turnAt(step) };
}

export function undoDraft(draft) {
  if (!draft.step) return draft;
  const step = draft.step - 1;
  const [action, team] = SEQUENCE[step];
  const t1 = { b: [...draft.t1.b], p: [...draft.t1.p] };
  const t2 = { b: [...draft.t2.b], p: [...draft.t2.p] };
  const t = team === 1 ? t1 : t2;
  if (action === "ban") t.b.pop(); else t.p.pop();
  return { t1, t2, step, phase: phaseOf(step), turn: turnAt(step) };
}

// UI helper: "Ban 3 / 6" style progress for the current step.
export function stepInfo(draft) {
  if (draft.phase === "done") return null;
  const [action] = SEQUENCE[draft.step];
  const segStart = action === "ban" && draft.step < 6 ? 0 : draft.step < 12 ? 6 : draft.step < 16 ? 12 : 16;
  const segEnd = draft.step < 6 ? 6 : draft.step < 12 ? 12 : draft.step < 16 ? 16 : 20;
  return { action, index: draft.step - segStart + 1, total: segEnd - segStart };
}
