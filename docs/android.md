# Android target

Axion is configured as Android-first Expo app.

## App identity

- Android package: `com.axion.app`
- Version code: `1`
- Orientation: portrait
- UI style: dark
- Build profiles:
  - `preview`: APK for internal testing
  - `production`: AAB for Play Store

## Android permissions

Configured now because MVP roadmap needs them:

- `ACCESS_COARSE_LOCATION`
- `ACCESS_FINE_LOCATION`
- `CAMERA`
- `INTERNET`
- `REQUEST_INSTALL_PACKAGES`
- `VIBRATE`

Current app uses runtime permission flows for location and camera. GPS mission verification and QR outpost validation are implemented client-side for MVP.

## Local Android run

Use Android emulator or physical Android device with Expo Go:

```bash
npm run android
```

For same-machine emulator routing:

```bash
npm run android:device
```

## Build APK

Local release APK with bundled JS:

```bash
npm run build:android:local
```

Output:

```text
android/app/build/outputs/apk/release/app-release.apk
```

Install or run EAS CLI, then authenticate:

```bash
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

Production AAB:

```bash
npx eas-cli build --platform android --profile production
```

## In-app update

Profile screen includes Android updater modeled after Nemoclaw:

1. Calls `https://api.github.com/repos/JackoPeru/Axion/releases/latest`.
2. Compares local `app.json` version against release tag `vX.Y.Z`.
3. Finds first release asset ending with `.apk`.
4. Downloads APK into app document storage.
5. Opens Android installer through Axion native FileProvider module.

Release requirement:

- GitHub release tag newer than local version, for example `v1.0.2`.
- Attach APK asset, for example `Axion-1.0.2-release.apk`.
- Device must allow Axion to install unknown apps when using direct APK updates outside Play Store.
- If permission is missing, Axion opens Android's "install unknown apps" settings first, like ChatClaw.

## GitHub release automation

Workflow: `.github/workflows/android-release.yml`.

Push a version tag:

```bash
git tag v1.0.2
git push origin v1.0.2
```

GitHub Actions builds Android release APK and attaches `Axion-1.0.2-release.apk` to the GitHub Release. In-app updater then detects it.

## Native Android folder

No `android/` folder is committed. Expo prebuild generates native Android code and `plugins/withAxionApkInstaller.js` injects the FileProvider + installer bridge each time:

```bash
npx expo prebuild --platform android
```
