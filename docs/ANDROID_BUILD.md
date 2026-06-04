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

The app ships with the bundled seed (129 heroes) and works fully offline. Live sync is already
wired to **`mikeychann/mlbb-pro-guide`** (`DATA_URL` in `src/services/dataSync.js`). To activate it:

1. Create the GitHub repo and push (see `git remote add` / push commands below or in the chat).
2. The daily GitHub Action (`.github/workflows/scrape.yml`) regenerates `scraper/output/data.json`.
   Enable Actions on the repo; it also runs on demand via "Run workflow".
3. The published `scraper/output/data.json` must be reachable at
   `https://raw.githubusercontent.com/mikeychann/mlbb-pro-guide/main/scraper/output/data.json`
   (the repo must be **public**, or use a different fetch method for private repos).
4. Rebuild: `npm run cap:sync && npm run android:apk`.

To point at a different repo, edit `DATA_URL` in `src/services/dataSync.js` and the User-Agent in
`scraper/sources/fandom.js`.

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
