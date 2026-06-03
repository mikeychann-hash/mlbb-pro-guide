// JSON-oriented storage adapter. Async signature so a native backend
// (Capacitor Preferences) can be swapped in later without touching callers.
function backend() {
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch (_) {}
  return null;
}

export async function getJSON(key, fallback = null) {
  const b = backend();
  if (!b) return fallback;
  try {
    const raw = b.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
}

export async function setJSON(key, value) {
  const b = backend();
  if (!b) return false;
  try {
    b.setItem(key, JSON.stringify(value));
    return true;
  } catch (_) {
    return false;
  }
}
