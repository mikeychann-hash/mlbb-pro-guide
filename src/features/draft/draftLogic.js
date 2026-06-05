// MLBB has two common draft formats. Both share the same 1-2-2-…-1 snake pick
// order (Blue first); they differ only in bans:
//   "standard" (Epic–Legend ranked & classic): 3 bans per team (6 total), then
//               all 10 picks in one snake.
//   "mythic"   (Mythic ranked / tournament):   5 bans per team (10 total) split
//               into two ban phases around the picks.
// SEQUENCE[i] = [action, team]; team 1 = Blue, 2 = Red.
const PICKS = [
  ["pick", 1], ["pick", 2], ["pick", 2], ["pick", 1], ["pick", 1],
  ["pick", 2], ["pick", 2], ["pick", 1], ["pick", 1], ["pick", 2],
];
const SEQUENCES = {
  standard: [
    ["ban", 1], ["ban", 2], ["ban", 1], ["ban", 2], ["ban", 1], ["ban", 2], // 3 bans each
    ...PICKS, // 10 picks, snake
  ],
  mythic: [
    ["ban", 1], ["ban", 2], ["ban", 1], ["ban", 2], ["ban", 1], ["ban", 2], // ban phase 1 (3 each)
    ["pick", 1], ["pick", 2], ["pick", 2], ["pick", 1], ["pick", 1], ["pick", 2], // pick phase 1 (6)
    ["ban", 2], ["ban", 1], ["ban", 2], ["ban", 1], // ban phase 2 (2 each, Red first)
    ["pick", 2], ["pick", 1], ["pick", 1], ["pick", 2], // pick phase 2 (4)
  ],
};
export const DRAFT_MODES = Object.keys(SEQUENCES);

// Label each step with its phase (ban1/pick1/ban2/pick2…) by numbering
// contiguous runs of the same action — works for any sequence shape.
function buildPhases(seq) {
  const out = [];
  let banN = 0, pickN = 0, last = null;
  for (const [action] of seq) {
    if (action !== last) { if (action === "ban") banN++; else pickN++; last = action; }
    out.push(action === "ban" ? `ban${banN}` : `pick${pickN}`);
  }
  return out;
}
const PHASES = Object.fromEntries(Object.entries(SEQUENCES).map(([k, seq]) => [k, buildPhases(seq)]));

const normMode = (mode) => (SEQUENCES[mode] ? mode : "standard");
const seqOf = (draft) => SEQUENCES[normMode(draft.mode)];
const phaseAt = (mode, step) => { const m = normMode(mode); return step >= SEQUENCES[m].length ? "done" : PHASES[m][step]; };
const turnAt = (mode, step) => { const m = normMode(mode); return step < SEQUENCES[m].length ? SEQUENCES[m][step][1] : 1; };

export const emptyDraft = (mode = "standard") => {
  const m = SEQUENCES[mode] ? mode : "standard";
  return { t1: { b: [], p: [] }, t2: { b: [], p: [] }, step: 0, phase: PHASES[m][0], turn: SEQUENCES[m][0][1], mode: m };
};

export function selectHero(draft, name) {
  const seq = seqOf(draft);
  if (draft.phase === "done" || draft.step >= seq.length || !name) return draft;
  // Guard against double-clicks / stale taps appending a duplicate.
  const taken = new Set(
    [...draft.t1.b, ...draft.t2.b, ...draft.t1.p, ...draft.t2.p].map((n) => n.toLowerCase())
  );
  if (taken.has(name.toLowerCase())) return draft;
  const [action, team] = seq[draft.step];
  const t1 = { b: [...draft.t1.b], p: [...draft.t1.p] };
  const t2 = { b: [...draft.t2.b], p: [...draft.t2.p] };
  const t = team === 1 ? t1 : t2;
  if (action === "ban") t.b.push(name); else t.p.push(name);
  const step = draft.step + 1;
  const mode = normMode(draft.mode);
  return { t1, t2, step, phase: phaseAt(mode, step), turn: turnAt(mode, step), mode };
}

export function undoDraft(draft) {
  if (!draft.step) return draft;
  const seq = seqOf(draft);
  const mode = normMode(draft.mode);
  const step = Math.min(draft.step, seq.length) - 1; // clamp guards corrupt step > length
  const [action, team] = seq[step];
  const t1 = { b: [...draft.t1.b], p: [...draft.t1.p] };
  const t2 = { b: [...draft.t2.b], p: [...draft.t2.p] };
  const t = team === 1 ? t1 : t2;
  if (action === "ban") t.b.pop(); else t.p.pop();
  return { t1, t2, step, phase: phaseAt(mode, step), turn: turnAt(mode, step), mode };
}

// UI helper: "Ban 3 / 6" style progress for the current step's phase segment.
export function stepInfo(draft) {
  const seq = seqOf(draft);
  if (draft.step >= seq.length) return null;
  const phases = PHASES[draft.mode] || PHASES.standard;
  const cur = phases[draft.step];
  let start = draft.step; while (start > 0 && phases[start - 1] === cur) start--;
  let end = draft.step; while (end < phases.length - 1 && phases[end + 1] === cur) end++;
  return { action: seq[draft.step][0], index: draft.step - start + 1, total: end - start + 1 };
}
