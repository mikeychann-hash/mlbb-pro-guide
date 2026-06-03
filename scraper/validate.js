export function validate(ds) {
  const errors = [];
  if (!ds || !Array.isArray(ds.heroes)) errors.push("heroes missing");
  else {
    if (ds.heroes.length < 100) errors.push(`too few heroes: ${ds.heroes.length}`);
    if (ds.heroes.some((h) => !h.n)) errors.push("hero with no name");
    if (ds.heroes.some((h) => h.t == null)) errors.push("hero with null tier");
  }
  if (!ds || !ds.patch || !ds.patch.v) errors.push("patch version missing");
  return { ok: errors.length === 0, errors };
}
