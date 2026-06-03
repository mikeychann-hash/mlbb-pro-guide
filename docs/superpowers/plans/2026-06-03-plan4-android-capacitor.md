# MLBB App — Plan 4: Android Packaging (Capacitor)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans.

**Goal:** Wrap the built web app in a Capacitor Android shell, produce a real `android/` Gradle project, generate app icon/splash, and document the one command to build an installable APK.

**Architecture:** Capacitor loads the Vite `dist/` build inside a native Android WebView. `localStorage` (already used by the storage adapter) persists across launches in the WebView; the INTERNET permission (default in Capacitor's manifest) lets `dataSync` fetch the published `data.json`. The actual `.apk` is produced by Gradle, which requires the Android SDK — that final step is documented for the user since `ANDROID_HOME` is not set in this environment.

**Tech Stack:** @capacitor/core, @capacitor/cli, @capacitor/android, @capacitor/assets, Gradle, Android SDK (user-side).

---

### Task 1: Install Capacitor + config

**Files:** Modify `package.json` (deps + scripts). Create `capacitor.config.json`.

- [ ] **Step 1:** `npm install @capacitor/core@^6 @capacitor/cli@^6 @capacitor/android@^6`
- [ ] **Step 2:** Create `capacitor.config.json`:

```json
{
  "appId": "com.mikeychann.mlbbproguide",
  "appName": "MLBB Pro Guide",
  "webDir": "dist"
}
```

- [ ] **Step 3:** Add scripts to `package.json`:
```json
"cap:sync": "npm run build && cap sync android",
"android:open": "cap open android",
"android:apk": "cd android && gradlew.bat assembleDebug"
```
- [ ] **Step 4:** `npm run build` to ensure `dist/` exists. Commit `chore: add Capacitor deps + config`.

---

### Task 2: Add Android platform

**Files:** Generates `android/` (committed), updates `.gitignore`.

- [ ] **Step 1:** Ensure `.gitignore` excludes Android build output (already has `android/app/build/`, `.gradle/`). Add `android/local.properties` and `android/.gradle/` if missing.
- [ ] **Step 2:** `npx cap add android` → generates the native project.
- [ ] **Step 3:** `npx cap sync android` → copies `dist/` into the native project.
- [ ] **Step 4:** Verify `android/app/src/main/AndroidManifest.xml` contains `android.permission.INTERNET`.
- [ ] **Step 5:** Commit `feat: add Capacitor Android platform`.

---

### Task 3: App icon + splash

**Files:** Create `assets/icon.svg`, `assets/splash.svg`. Generate native resources.

- [ ] **Step 1:** Create `assets/icon.svg` (1024×1024) and `assets/splash.svg` (2732×2732) — MLBB-themed dark/gold.
- [ ] **Step 2:** `npx @capacitor/assets generate --android` (uses `assets/` sources).
- [ ] **Step 3:** `npx cap sync android`. Commit `feat: app icon + splash screen`.

> If `@capacitor/assets` fails (needs native image libs), skip — the default Capacitor icon ships; document manual icon replacement.

---

### Task 4: Build docs + verification

**Files:** Create `docs/ANDROID_BUILD.md`. Update README pointer.

- [ ] **Step 1:** Write `docs/ANDROID_BUILD.md` with prerequisites (JDK 17+/21 ✓ installed, Android Studio + SDK, set `ANDROID_HOME`), and the build commands:
  - Debug APK: `npm run cap:sync` then `npm run android:apk` → `android/app/build/outputs/apk/debug/app-debug.apk`
  - Or `npm run android:open` to build/run in Android Studio.
  - Set the real `DATA_URL` in `src/services/dataSync.js` (replace `USER/REPO`) and rebuild so live sync works.
- [ ] **Step 2:** Attempt `npm run android:apk`. If `ANDROID_HOME`/SDK present → APK built (verify file). If absent → document the failure and exact remediation (install Android Studio, set `ANDROID_HOME`). Do NOT mark success unless the APK file exists.
- [ ] **Step 3:** Commit `docs: Android build guide`.

---

## Self-Review

**Spec coverage (Phase 5):** Capacitor platform + icon/splash + installable APK path → Tasks 1–4. Offline + native storage already satisfied by the WebView + localStorage adapter (Plan 1). Live fetch works via default INTERNET permission (Task 2).

**Placeholder scan:** `DATA_URL` `USER/REPO` is the one piece of user config, documented in ANDROID_BUILD.md. The APK build step is explicitly conditional on the Android SDK and must show real evidence (file exists) before being called done.

**Type consistency:** No new app code types; this plan is packaging + docs. `webDir: dist` matches Vite output; scripts reference real generated paths.
