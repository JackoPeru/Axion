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

Current app still uses mock mission completion. Real GPS/QR implementation needs runtime permission screens and clear user-facing copy.

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
5. Opens Android installer through intent.

Release requirement:

- GitHub release tag newer than local version, for example `v1.0.1`.
- Attach APK asset, for example `Axion-1.0.1.apk`.
- Device must allow Axion to install unknown apps when using direct APK updates outside Play Store.

## Native Android folder

No `android/` folder is committed yet. Expo managed workflow is cleaner for current MVP. Generate native Android project only when custom native modules, signing customization or store-specific native changes become necessary:

```bash
npx expo prebuild --platform android
```
