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

## Stack found

Repository was empty before scaffold. New Android-first stack:

- Expo `~54`
- React Native `0.81`
- React `19`
- TypeScript strict mode
- Android package `com.axion.app`
- Local state only, no backend yet

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

## Current limits

- Auth is mock/local only.
- Map is a dark zone mock, not real GPS.
- Mission completion is simulated.
- QR, anti-cheat, push, payments, chat and real multiplayer are intentionally excluded.
- Partner and reward redemption are mocked.
- In-app Android updater checks GitHub Releases and expects an `.apk` asset on `JackoPeru/Axion`.

## Next technical tasks

1. Add file-based navigation with Expo Router.
2. Add persistent storage for selected faction, user profile and mission states.
3. Replace mock map with real map SDK and permission flow.
4. Add backend schema for users, missions, zones, venues and reward redemptions.
5. Add location validation and basic anti-abuse checks for mission completion.
