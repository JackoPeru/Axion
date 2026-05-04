# Axion

MVP skeleton for Android social urban game. Built with Expo, React Native and TypeScript.

## Product proposal

Axion turns real city movement into faction competition. Core value is not sightseeing or trivia. User leaves home because missions can unlock real venue perks, local status, limited events and visible faction control.

Tone: mature, urban, premium, discreet. No mascots, no creatures, no cartoon loop.

Core loop:

1. User enters with mock login and chooses faction.
2. Home shows operational status, score, rank, active mission and hot zone.
3. Zone view shows contested areas and control percentages.
4. Mission board offers temporary geolocated operations.
5. Mission detail supports accept and simulated completion.
6. Completion updates user points, faction score and zone control.
7. Rewards and partner venues give concrete reason to return.

MVP includes mock data for 3 factions, 5 city zones, 10 missions, 3 partner venues, 5 rewards, leaderboard and faction scores.
Current Android build also includes local persistence, GPS verification, QR outpost validation, timed zone hold, reward redemption and in-app APK updater.
It also includes a real map layer using OpenStreetMap tiles, optional Supabase auth/sync, signed QR payload support, and GitHub tag-based APK release automation.

## Stack found

Repository was empty before scaffold. New Android-first stack:

- Expo `~54`
- React Native `0.81`
- React `19`
- TypeScript strict mode
- Android package `com.axion.app`
- Persisted local state with `AsyncStorage`
- Device APIs: location, camera QR, haptics, native map
- Optional Supabase backend via `.env`

This is suitable for Android MVP because it keeps iteration fast and can later accept real auth, map SDK, location APIs, QR scanning and backend without replacing product structure.

## Run

```bash
npm run start
```

Then open with Expo Go on Android device, or Android emulator:

```bash
npm run android
```

Type check:

```bash
npm run typecheck
```

Android build docs: `docs/android.md`.

Optional cloud sync:

```bash
copy .env.example .env
```

Set:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_AXION_QR_SECRET=
```

Then run SQL in `docs/backend-schema.sql`.

## Current limits

- Auth is mock/local only.
- Map uses OpenStreetMap tiles through native `react-native-maps`.
- Team missions and demo override are still local MVP flows.
- QR, anti-cheat, push, payments, chat and real multiplayer are intentionally excluded.
- Partner and reward redemption are local only.
- In-app Android updater checks GitHub Releases and expects an `.apk` asset on `JackoPeru/Axion`.

## Next technical tasks

1. Move anti-cheat from client MVP to Supabase Edge Function.
2. Add release signing and Play Store/AAB pipeline.
3. Add weekly events and remote mission feed.
4. Add partner dashboard for rotating QR payloads.
5. Add automated device tests for GPS, QR and updater.
