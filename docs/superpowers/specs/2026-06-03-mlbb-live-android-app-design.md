# MLBB Pro Guide → Live Android App — Design

**Date:** 2026-06-03
**Status:** Approved (brainstorm)
**Author:** mikeychann@gmail.com + Claude

## 1. Summary

Turn the existing single-file React prototype (`mlbb-pro-guide.jsx`) into a maintainable,
offline-first **Android app** (via Capacitor) whose hero/tier/patch data is kept **live**
by an auto-scraping data pipeline that combines multiple sources.

The app currently is a 720-line single `.jsx` file with ~120 hardcoded heroes, ultra-terse
identifiers (`H`, `rc`, `dSl`, `bS`), inline styles, and persistence via the Claude-artifact-only
`window.storage` API. Tabs today: Meta, Tiers, Teams, Counter, Build, Draft, Compare, Glossary,
Tracker (win/loss), Saved Builds.

## 2. Goals

- Ship a real installable Android APK/AAB built from the existing React code (Capacitor).
- Hero roster, win/pick/ban rates, and patch notes update automatically from live sources.
- Works fully offline with last-known data; live data only ever *improves* on a bundled seed.
- New "Updates" feed tab + NEW/↑/↓ badges so users see what changed each patch.
- Clean, modular, readable codebase (split the monolith into focused modules).
- Persistence (tracker, saved builds) works on a real device.

## 3. Non-Goals (deferred)

- Push notifications on new patch — **Phase 6 / later** (needs Firebase or similar push infra).
- iOS build.
- Hosted admin panel / CMS for manual data editing.

## 4. The Hard Constraint

MLBB has **no official public stats API**, and unofficial win/pick/ban-rate sites are fragile
and change structure without notice. **Architecture rule #1: a broken or empty source must never
break the app.** The current hardcoded 120-hero dataset becomes the *bundled seed* shipped inside
the app. Live data is layered on top; if a scrape fails or returns garbage, the last good data is
retained and the app keeps working offline.

## 5. Architecture

### 5.1 Data pipeline (no live server)

A scheduled **GitHub Action** (cron: **daily**) runs a Node scraper. Each source is isolated so
one failing does not affect the others:

| Source | Pulls | Reliability |
|---|---|---|
| `mobile-legends.fandom.com` (MediaWiki API) | Hero roster, roles, kits, new heroes | High (stable API) |
| Stats aggregator (exact site selected in Phase 3) | Win / pick / ban rates per patch | Low (fragile) — current numbers used as fallback |
| Official MLBB patch page | Patch notes / changelog | Medium |

Pipeline steps:
1. Fetch each source independently (failures isolated and logged).
2. **Normalize** into a single versioned `data.json` with a `generatedAt` timestamp and
   `schemaVersion`.
3. **Validate** (e.g. ≥100 heroes, no null tiers, win rates in plausible range). If validation
   fails, **keep the previously committed JSON** — never publish broken data.
4. Commit the published artifacts to the repo (served as raw JSON / GitHub Pages).

The app fetches the published JSON URL. Free, auditable, no server to babysit.

### 5.2 The app (Capacitor + React + Vite)

- **Data layer / sync service** — on launch: instantly load *bundled* `data.json` (offline-first),
  then fetch remote in background; if remote `generatedAt` is newer, cache to native storage and
  refresh UI. Surfaces "Updated X ago" + pull-to-refresh.
- **Diff engine** — compares incoming vs cached data to derive NEW heroes, ↑/↓ buff/nerf badges,
  and Updates-feed entries.
- **Storage adapter** — replaces `window.storage` with Capacitor Preferences (localStorage
  fallback in web dev). Fixes tracker & saved-builds persistence on device.

## 6. Code Structure (replaces single file)

```
src/
  data/        schema/types + bundled seed data.json
  services/    dataSync, diffEngine, storage
  features/    meta, tiers, teams, counters, build, draft,
               compare, glossary, tracker, updates (new)
  components/  HeroChip, HeroDetail, Tabs, Badge, ...
  theme/       palette + shared styles
  App.jsx
scraper/
  sources/     fandom.js, stats.js, official.js
  normalize.js, validate.js, index.js
  output/      data.json (committed)
.github/workflows/scrape.yml   (daily cron)
```

## 7. Data Schema (initial)

A hero record (normalized from current fields):
`name, role, role2, tier, lane, difficulty, winRate, pickRate, banRate, specialty,
counters[], strongVs[], build[], emblem, spells[], tip, synergies[]`

Top-level `data.json`:
`{ schemaVersion, generatedAt, patch, heroes[], patchNotes[], meta{bans,rising,falling,lanes} }`

## 8. New "Updates" Tab

Feed showing: latest patch notes, newly added heroes, and buff/nerf changes since the previous
patch. NEW / ↑ / ↓ badges are also woven into the existing Tiers and Meta views via the diff engine.

## 9. Phased Build

1. **Scaffold + port** — Vite + React project; split the monolith into modules; swap storage
   adapter; runs on web with no behavior change.
2. **Data layer** — define schema + bundled seed (current data); app reads from the data layer
   instead of the hardcoded array.
3. **Scraper + Action** — 3 sources → normalize → validate → `data.json`; app fetches remote,
   caches offline, shows last-updated + refresh.
4. **Diff + Updates tab + badges.**
5. **Capacitor Android** — add platform, app icon/splash, build installable APK; mobile UI polish pass.
6. **Later:** push notifications on new patch.

## 10. Risks & Mitigations

- **Stats source breaks / disappears** → bundled seed + validation gate + last-good retention.
- **Scraping ToS gray area** → prefer the wiki's official MediaWiki API; keep scrape volume low
  (daily); attribute sources; treat stats source as best-effort enhancement, not a dependency.
- **Schema drift between sources** → single normalize step with `schemaVersion`; validation before publish.

## 11. Success Criteria

- Installable Android APK runs offline using bundled data.
- Daily Action publishes validated `data.json`; app reflects it within one launch/refresh.
- New heroes and buff/nerf changes appear in the Updates tab with correct badges.
- Tracker and saved builds persist across app restarts on device.
- Codebase split into focused modules; no single file dominates.
