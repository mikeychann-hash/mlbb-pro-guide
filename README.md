# MLBB Pro Guide

A Mobile Legends: Bang Bang companion app — heroes, tiers, counters, builds, draft simulator,
jungle/roam/macro guides, emblems, pro picks, glossary, a personal win/loss tracker, and a live
**Updates** feed. Built as a Vite + React web app and packaged for **Android** with Capacitor.
Hero/roster data is kept current by an auto-scraping pipeline, with a bundled offline fallback.

## Quick start (web/dev)

```powershell
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm test           # run the test suite (Vitest)
```

## Live data

- The app ships with a **bundled seed** (129 fully-detailed heroes) and works fully offline.
- A Node **scraper** (`scraper/`) pulls the live hero roster from the Fandom MediaWiki API,
  merges it onto the seed (new heroes flagged), validates, and writes `scraper/output/data.json`.
- A daily **GitHub Action** (`.github/workflows/scrape.yml`) republishes that file.
- The app fetches it on launch, caches it offline, keeps the newest by timestamp, and shows a
  "data updated X ago" bar + manual refresh. New/buffed/nerfed heroes surface in the **Updates** tab
  and as NEW / ↑ / ↓ badges.

Run the scraper locally:
```powershell
npm run scrape
```
To enable live sync in the built app, set `DATA_URL` in `src/services/dataSync.js` after pushing
to GitHub (see `docs/ANDROID_BUILD.md`).

## Android

See **[docs/ANDROID_BUILD.md](docs/ANDROID_BUILD.md)**. Short version (after installing the Android SDK):

```powershell
npm run cap:sync
npm run android:apk      # → android/app/build/outputs/apk/debug/app-debug.apk
```

## Project layout

```
src/
  data/        data API, bundled seed, schema, DataProvider/useData
  services/    storage, dataSync, diffEngine
  features/    one folder per tab (meta, updates, heroes, tiers, ...)
  components/  HeroDetail, HeroChip, SugBox, Badge
  theme/       palette + styles
scraper/       sources/, normalize, validate, index → output/data.json
android/       Capacitor native project
docs/          specs, plans, Android build guide
legacy/        original single-file prototype (reference)
```

## Design & plans

- Spec: `docs/superpowers/specs/2026-06-03-mlbb-live-android-app-design.md`
- Plans: `docs/superpowers/plans/2026-06-03-*.md` (foundation, live data, updates, Android)

Not affiliated with Moonton.
