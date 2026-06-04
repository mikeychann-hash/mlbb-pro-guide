# Production Release Guide

The app is production-configured: signed release builds, a crash-proof error boundary,
live data with offline fallback, and a daily data refresh.

## What "production ready" means here

- **Signed release artifacts** — `assembleRelease` (APK) and `bundleRelease` (AAB for Play Store),
  signed via a keystore referenced by `android/keystore.properties` (gitignored).
- **Crash safety** — `src/components/ErrorBoundary.jsx` wraps the app; any render error shows a
  recoverable "Reload" screen instead of a blank WebView.
- **Live data** — `data.json` is fetched from GitHub (roster + portraits from Fandom, win/pick/ban
  rates from the openmlbb API), validated before publish, cached offline, with the bundled seed as a
  guaranteed fallback. A daily GitHub Action keeps it fresh.
- **Tests** — 38 Vitest tests; `npm test` must pass before release.

## Signing keystore

A keystore lives at `android/app/release.keystore` and is referenced by `android/keystore.properties`:

```
storeFile=release.keystore
storePassword=********
keyAlias=mlbb
keyPassword=********
```

Both files are **gitignored** (never commit them). To create your own production keystore:

```powershell
& "$env:JAVA_HOME\bin\keytool.exe" -genkeypair -v `
  -keystore android/app/release.keystore -alias mlbb `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -dname "CN=MLBB Pro Guide"
```

Keep the keystore + passwords safe and backed up — you need the **same** keystore to ship every
future update to the Play Store.

## Build release artifacts

```powershell
npm test                 # 38 tests must pass
npm run build            # vite production bundle
npx cap sync android     # copy web build into the native project
cd android
.\gradlew.bat assembleRelease   # -> app/build/outputs/apk/release/app-release.apk (signed)
.\gradlew.bat bundleRelease     # -> app/build/outputs/bundle/release/app-release.aab (Play Store)
```

Convenience copies are written to the project root as `mlbb-pro-guide-release.apk` /
`mlbb-pro-guide-release.aab` by the release build script.

## Releasing

- **Sideload / direct distribution:** share `mlbb-pro-guide-release.apk`.
- **Google Play:** upload `mlbb-pro-guide-release.aab` in the Play Console. Bump `versionCode`
  (and `versionName`) in `android/app/build.gradle` for every release.
- **Live data:** the app pulls `DATA_URL`
  (`https://raw.githubusercontent.com/mikeychann-hash/mlbb-pro-guide/main/scraper/output/data.json`).
  Keep the repo public and the daily Action enabled so installed apps stay current without an update.

## Versioning

Edit `android/app/build.gradle`:
- `versionName` — human-facing (e.g. `1.0.1`)
- `versionCode` — integer, must increase every Play upload

## Optional next hardening

- Enable `minifyEnabled true` + `shrinkResources true` for a smaller APK (test thoroughly — verify the
  WebView still loads after R8).
- Add a CI workflow to run `npm test` + `npm run build` on every push.
- Push notifications (needs Firebase / `google-services.json`).
