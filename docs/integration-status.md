# Axion integration status

## Integrated

- Local persistence with `AsyncStorage`.
- Optional Supabase auth via email/password when env vars exist.
- Optional Supabase sync for profiles, mission completions and reward redemptions.
- Real map screen with `react-native-maps` and OpenStreetMap tiles.
- GPS mission validation with accuracy/radius checks.
- QR outpost validation, including signed Axion QR payloads.
- Timed zone hold flow.
- Local reward redemption.
- In-app Android APK updater from GitHub Releases.
- GitHub Actions APK release workflow on `v*` tags.
- Axion icon, adaptive icon and splash.

## Still Server-Side Before Public Launch

- Anti-cheat must move to server/Edge Function.
- Mission feed should come from backend, not bundled mock data.
- Partner QR secrets must be managed server-side.
- Production release needs keystore and Play Store AAB path.
- Real operations need admin dashboard for zones, missions, rewards and partner venues.
