-- ═══════════════════════════════════════════════════
-- FOOTBALL PONTOON — Database Schema
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ── TOURNAMENTS ──
-- Managed by super admin
create table tournaments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  start_date timestamptz not null,
  end_date timestamptz,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'finished')),
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── TOURNAMENT TEAMS ──
-- Which teams are in each tournament
create table tournament_teams (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  team_name text not null,
  team_code text not null, -- e.g. 'ENG', 'BRA'
  flag_emoji text,
  eliminated boolean not null default false,
  eliminated_at timestamptz,
  unique(tournament_id, team_code)
);

-- ── GAMES ──
-- Each game created by an admin
create table games (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null, -- e.g. 'XKCD42', the join code
  name text not null,
  tournament_id uuid not null references tournaments(id),
  admin_id uuid not null, -- references auth.users
  admin_name text not null,
  admin_email text not null,
  sweep_amount decimal(5,2), -- null = no sweepstake
  selections_locked boolean not null default false,
  lock_time timestamptz, -- when selections lock (5 min before first match)
  status text not null default 'selections' check (status in ('selections', 'live', 'finished')),
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── PLAYERS ──
-- People who join a game (not auth users — just name)
create table players (
  id uuid primary key default uuid_generate_v4(),
  game_id uuid not null references games(id) on delete cascade,
  name text not null,
  is_admin boolean not null default false,
  paid boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── PICKS ──
-- Each player picks 4 teams
create table picks (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references players(id) on delete cascade,
  team_id uuid not null references tournament_teams(id),
  pick_order integer not null check (pick_order between 1 and 4),
  created_at timestamptz not null default now(),
  unique(player_id, pick_order),
  unique(player_id, team_id)
);

-- ── GOALS ──
-- Tracked from API-Football, each goal in the tournament
create table goals (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid not null references tournaments(id),
  match_id text not null, -- API-Football match ID
  team_id uuid not null references tournament_teams(id), -- team that benefits
  minute integer not null,
  extra_time boolean not null default false,
  own_goal boolean not null default false,
  scorer_name text,
  scored_at timestamptz not null, -- actual timestamp for tiebreakers
  created_at timestamptz not null default now(),
  unique(match_id, minute, team_id, scorer_name)
);

-- ── PLAYER SCORES ──
-- Materialised view of player scores (updated when goals come in)
create table player_scores (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references players(id) on delete cascade unique,
  game_id uuid not null references games(id) on delete cascade,
  total_goals integer not null default 0,
  is_bust boolean not null default false,
  bust_at timestamptz, -- when they went bust (for wooden spoon tiebreak)
  is_stuck boolean not null default false, -- all 4 teams eliminated
  updated_at timestamptz not null default now()
);

-- ── INDEXES ──
create index idx_games_code on games(code);
create index idx_games_tournament on games(tournament_id);
create index idx_players_game on players(game_id);
create index idx_picks_player on picks(player_id);
create index idx_goals_tournament on goals(tournament_id);
create index idx_goals_team on goals(team_id);
create index idx_player_scores_game on player_scores(game_id);

-- ── ROW LEVEL SECURITY ──
alter table tournaments enable row level security;
alter table tournament_teams enable row level security;
alter table games enable row level security;
alter table players enable row level security;
alter table picks enable row level security;
alter table goals enable row level security;
alter table player_scores enable row level security;

-- Public read access to tournaments and teams
create policy "Tournaments are viewable by everyone"
  on tournaments for select using (true);

create policy "Tournament teams are viewable by everyone"
  on tournament_teams for select using (true);

-- Games: anyone can read, only auth users can create
create policy "Games are viewable by everyone"
  on games for select using (true);

create policy "Auth users can create games"
  on games for insert with check (auth.uid() = admin_id);

create policy "Admins can update their own games"
  on games for update using (auth.uid() = admin_id);

-- Players: anyone can read players in a game, anyone can join
create policy "Players are viewable by everyone"
  on players for select using (true);

create policy "Anyone can join a game"
  on players for insert with check (true);

-- Picks: viewable only when game is locked, anyone can insert their own
create policy "Picks viewable when locked"
  on picks for select using (
    exists (
      select 1 from players p
      join games g on p.game_id = g.id
      where p.id = picks.player_id
      and g.selections_locked = true
    )
  );

create policy "Players can insert their own picks"
  on picks for insert with check (true);

create policy "Players can update their own picks"
  on picks for update using (true);

create policy "Players can delete their own picks"
  on picks for delete using (true);

-- Goals: public read, server-only write (via service role key)
create policy "Goals are viewable by everyone"
  on goals for select using (true);

-- Player scores: public read
create policy "Scores are viewable by everyone"
  on player_scores for select using (true);

-- ── SEED DATA: FIFA World Cup 2026 ──
insert into tournaments (name, slug, start_date, status, enabled) values
  ('FIFA World Cup 2026', 'wc2026', '2026-06-11T20:00:00Z', 'upcoming', true);

-- Insert all 32 teams (we'll use the tournament ID from above)
-- Run this after the tournament is created:
/*
insert into tournament_teams (tournament_id, team_name, team_code, flag_emoji) values
  ((select id from tournaments where slug = 'wc2026'), 'Argentina', 'ARG', '🇦🇷'),
  ((select id from tournaments where slug = 'wc2026'), 'Australia', 'AUS', '🇦🇺'),
  ((select id from tournaments where slug = 'wc2026'), 'Brazil', 'BRA', '🇧🇷'),
  ((select id from tournaments where slug = 'wc2026'), 'Canada', 'CAN', '🇨🇦'),
  ((select id from tournaments where slug = 'wc2026'), 'Colombia', 'COL', '🇨🇴'),
  ((select id from tournaments where slug = 'wc2026'), 'Croatia', 'CRO', '🇭🇷'),
  ((select id from tournaments where slug = 'wc2026'), 'Denmark', 'DEN', '🇩🇰'),
  ((select id from tournaments where slug = 'wc2026'), 'Ecuador', 'ECU', '🇪🇨'),
  ((select id from tournaments where slug = 'wc2026'), 'England', 'ENG', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
  ((select id from tournaments where slug = 'wc2026'), 'France', 'FRA', '🇫🇷'),
  ((select id from tournaments where slug = 'wc2026'), 'Germany', 'GER', '🇩🇪'),
  ((select id from tournaments where slug = 'wc2026'), 'Ghana', 'GHA', '🇬🇭'),
  ((select id from tournaments where slug = 'wc2026'), 'Iran', 'IRN', '🇮🇷'),
  ((select id from tournaments where slug = 'wc2026'), 'Japan', 'JPN', '🇯🇵'),
  ((select id from tournaments where slug = 'wc2026'), 'Mexico', 'MEX', '🇲🇽'),
  ((select id from tournaments where slug = 'wc2026'), 'Morocco', 'MAR', '🇲🇦'),
  ((select id from tournaments where slug = 'wc2026'), 'Netherlands', 'NED', '🇳🇱'),
  ((select id from tournaments where slug = 'wc2026'), 'Nigeria', 'NGA', '🇳🇬'),
  ((select id from tournaments where slug = 'wc2026'), 'Poland', 'POL', '🇵🇱'),
  ((select id from tournaments where slug = 'wc2026'), 'Portugal', 'POR', '🇵🇹'),
  ((select id from tournaments where slug = 'wc2026'), 'Qatar', 'QAT', '🇶🇦'),
  ((select id from tournaments where slug = 'wc2026'), 'Saudi Arabia', 'KSA', '🇸🇦'),
  ((select id from tournaments where slug = 'wc2026'), 'Senegal', 'SEN', '🇸🇳'),
  ((select id from tournaments where slug = 'wc2026'), 'Serbia', 'SRB', '🇷🇸'),
  ((select id from tournaments where slug = 'wc2026'), 'South Korea', 'KOR', '🇰🇷'),
  ((select id from tournaments where slug = 'wc2026'), 'Spain', 'ESP', '🇪🇸'),
  ((select id from tournaments where slug = 'wc2026'), 'Switzerland', 'SUI', '🇨🇭'),
  ((select id from tournaments where slug = 'wc2026'), 'Tunisia', 'TUN', '🇹🇳'),
  ((select id from tournaments where slug = 'wc2026'), 'USA', 'USA', '🇺🇸'),
  ((select id from tournaments where slug = 'wc2026'), 'Uruguay', 'URU', '🇺🇾'),
  ((select id from tournaments where slug = 'wc2026'), 'Wales', 'WAL', '🏴󠁧󠁢󠁷󠁬󠁳󠁿'),
  ((select id from tournaments where slug = 'wc2026'), 'Cameroon', 'CMR', '🇨🇲');
*/
