create table if not exists profiles (
  id text primary key,
  alias text not null,
  faction_id text not null check (faction_id in ('vanguard', 'syndicate', 'eclipse')),
  level integer not null default 1,
  points integer not null default 0,
  status_title text not null default 'Recruit',
  updated_at timestamptz not null default now()
);

create table if not exists mission_completions (
  id uuid primary key default gen_random_uuid(),
  mission_id text not null,
  user_id text not null references profiles(id) on delete cascade,
  faction_id text not null check (faction_id in ('vanguard', 'syndicate', 'eclipse')),
  user_points integer not null,
  faction_points integer not null,
  completed_at timestamptz not null default now(),
  unique (mission_id, user_id)
);

create table if not exists reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  reward_id text not null,
  user_id text not null references profiles(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (reward_id, user_id)
);

alter table profiles enable row level security;
alter table mission_completions enable row level security;
alter table reward_redemptions enable row level security;

create policy "profiles readable" on profiles for select using (true);
create policy "profiles upsert own" on profiles for insert with check (auth.uid()::text = id);
create policy "profiles update own" on profiles for update using (auth.uid()::text = id);

create policy "mission completions readable" on mission_completions for select using (true);
create policy "mission completions own insert" on mission_completions for insert with check (auth.uid()::text = user_id);

create policy "reward redemptions readable" on reward_redemptions for select using (true);
create policy "reward redemptions own insert" on reward_redemptions for insert with check (auth.uid()::text = user_id);

create or replace view leaderboard as
select
  id,
  alias,
  faction_id,
  points,
  level,
  status_title,
  rank() over (order by points desc) as rank
from profiles;
