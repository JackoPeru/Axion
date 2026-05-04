# Secret Ops product structure

## Positioning

Secret Ops is an adult urban social game where city movement produces status, faction power and real-world perks. It should feel closer to an operations network than a collection game.

## Audience

Primary target: 18-35, socially active, urban, mobile-first. Motivators:

- Real venue advantages.
- Visible local rank.
- Faction identity.
- Weekly timed events.
- Team missions with low friction.
- Rare missions that create urgency.

## Factions

Vanguard is direct territorial pressure. Best for conquest, defense and visible map control.

Syndicate is intelligence and coordination. Best for partner outposts, team synchronization and logistics.

Eclipse is stealth and timing. Best for evening chains, mobile objectives and surprise operations.

Balance goal: each faction has identity, but all can complete all mission types. Recommendation gives flavor, not exclusion.

## MVP scope

Build only product spine:

- Mock auth/profile.
- Faction selection.
- Home operative dashboard.
- Mission board.
- Mission detail.
- Simulated accept/complete mission.
- Zone control.
- Local leaderboard.
- Rewards and partner venues.

Exclude:

- Payments.
- AR.
- Real-time chat.
- Complex multiplayer.
- Advanced anti-cheat.
- Real partnerships.
- Push notification system.

## Data model

Core entities:

- `Faction`: identity, color, motto, philosophy, playstyle, traits.
- `Mission`: type, zone, points, expiry, reward, status, team requirement.
- `Zone`: geolocation center, radius, owner, faction control split, heat.
- `PartnerVenue`: address, coordinates, outpost code, active rewards.
- `Reward`: perk type, required points, partner link, expiry.
- `UserProfile`: alias, faction, level, points, status, completions.

## Real MVP path

First real version needs persistent user state, map SDK, location permission, basic GPS validation, backend mission feed and reward redemption ledger.
