import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// ── AUTH HELPERS ──

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signInWithMagicLink(email) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// ── DB HELPERS ──

export async function getTournaments() {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('enabled', true)
    .order('start_date', { ascending: true });
  return { data, error };
}

export async function getTournamentTeams(tournamentId) {
  const { data, error } = await supabase
    .from('tournament_teams')
    .select('*')
    .eq('tournament_id', tournamentId)
    .order('team_name', { ascending: true });
  return { data, error };
}

export async function createGame({ code, name, tournamentId, adminId, adminName, adminEmail, sweepAmount, marketingOptIn, lockTime }) {
  const { data, error } = await supabase
    .from('games')
    .insert({
      code,
      name,
      tournament_id: tournamentId,
      admin_id: adminId,
      admin_name: adminName,
      admin_email: adminEmail,
      sweep_amount: sweepAmount,
      marketing_opt_in: marketingOptIn,
      lock_time: lockTime,
    })
    .select()
    .single();
  return { data, error };
}

export async function getGameByCode(code) {
  const { data, error } = await supabase
    .from('games')
    .select('*, tournaments(name, slug, start_date, status)')
    .eq('code', code.toUpperCase())
    .single();
  return { data, error };
}

export async function addPlayer({ gameId, name, isAdmin = false }) {
  const { data, error } = await supabase
    .from('players')
    .insert({
      game_id: gameId,
      name,
      is_admin: isAdmin,
    })
    .select()
    .single();
  return { data, error };
}

export async function getPlayers(gameId) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('game_id', gameId)
    .order('created_at', { ascending: true });
  return { data, error };
}

export async function savePicks(playerId, teamIds) {
  // Delete existing picks first
  await supabase.from('picks').delete().eq('player_id', playerId);

  const picks = teamIds.map((teamId, i) => ({
    player_id: playerId,
    team_id: teamId,
    pick_order: i + 1,
  }));

  const { data, error } = await supabase
    .from('picks')
    .insert(picks)
    .select();
  return { data, error };
}

export async function getPlayerPicks(playerId) {
  const { data, error } = await supabase
    .from('picks')
    .select('*, tournament_teams(team_name, team_code, flag_emoji)')
    .eq('player_id', playerId)
    .order('pick_order', { ascending: true });
  return { data, error };
}

export async function checkCodeExists(code) {
  const { data } = await supabase
    .from('games')
    .select('id')
    .eq('code', code.toUpperCase())
    .single();
  return !!data;
}
