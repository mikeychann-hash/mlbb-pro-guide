# Building the Android APK

The app is a Capacitor wrapper around the Vite web build. The native project lives in `android/`.
Everything is scaffolded and verified except the final Gradle build, which needs the Android SDK.

## Prerequisites

- **JDK 17+** — already installed on this machine (JDK 21 at `JAVA_HOME`).
- **Android SDK** — install **Android Studio** (https://developer.android.com/studio), which bundles the SDK,
  or install the command-line tools only.
- Set the SDK location one of two ways:
  - Set the `ANDROID_HOME` environment variable to your SDK path
    (e.g. `C:\Users\Admin\AppData\Local\Android\Sdk`), **or**
  - Create `android/local.properties` containing:
    ```
    sdk.dir=C:\\Users\\Admin\\AppData\\Local\\Android\\Sdk
    ```
- First build will prompt to accept SDK licenses: `sdkmanager --licenses`.

## Build a debug APK

```powershell
npm run cap:sync       # builds the web app and copies it into android/
npm run android:apk    # runs: cd android && gradlew.bat assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk` — sideload this onto a phone
(enable "Install unknown apps").

## Or build/run in Android Studio

```powershell
npm run android:open
```

Then press Run ▶ with a device/emulator selected. Android Studio installs any missing SDK
packages automatically.

## Enabling live data on device

The app ships with the bundled seed (129 heroes) and works fully offline. To make the
"🛰️ live" sync pull fresh data:

1. Push this repo to GitHub.
2. In `src/services/dataSync.js`, set `DATA_URL` — replace `USER/REPO` with your repo slug:
   ```js
   export const DATA_URL =
     "https://raw.githubusercontent.com/<you>/<repo>/main/scraper/output/data.json";
   ```
   (Also update the `USER/REPO` in `scraper/sources/fandom.js`'s User-Agent string.)
3. The daily GitHub Action (`.github/workflows/scrape.yml`) regenerates `scraper/output/data.json`.
   Enable Actions on the repo; it also runs on demand via "Run workflow".
4. Rebuild: `npm run cap:sync && npm run android:apk`.

## Release (signed) APK / AAB

For Play Store, generate a signing key and configure `android/app/build.gradle` signing config,
then `gradlew.bat bundleRelease` (AAB) or `assembleRelease` (APK). See
https://capacitorjs.com/docs/android/deploying-to-google-play.

## Verified status

- `npx cap add android` ✓ — native project generated.
- `npx cap sync android` ✓ — web build + icon/splash copied in.
- `gradlew assembleDebug` — Gradle configures the project successfully; fails only at
  `SDK location not found` until the Android SDK is installed and `ANDROID_HOME`/`local.properties`
  is set. After that, the command above produces the APK.
