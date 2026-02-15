'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Shell from '../../../../components/Shell';
import { Window, Btn, Input, Recessed, Badge, Label, InfoPanel } from '../../../../components/Win95';
import { getGameByCode, getTournamentTeams, savePicks } from '../../../../lib/supabase';
import { formatCountdown } from '../../../../lib/game';

export default function SelectPage() {
  const router = useRouter();
  const params = useParams();
  const gameCode = params.code;

  const [teams, setTeams] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [game, setGame] = useState(null);
  const [adminName, setAdminName] = useState('Admin');
  const [lockTime, setLockTime] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    async function init() {
      // Get game info
      const { data: gameData } = await getGameByCode(gameCode);
      if (!gameData) {
        setError('Game not found');
        return;
      }
      setGame(gameData);
      setAdminName(gameData.admin_name || 'Admin');
      setLockTime(gameData.lock_time);

      // Get teams for this tournament
      const { data: teamData } = await getTournamentTeams(gameData.tournament_id);
      if (teamData) {
        setTeams(teamData);
      }

      // Get player ID from localStorage
      if (typeof window !== 'undefined') {
        try {
          const pontoonData = JSON.parse(localStorage.getItem('pontoon') || '{}');
          const playerInfo = pontoonData[gameCode];
          if (playerInfo?.playerId) {
            setPlayerId(playerInfo.playerId);
          }
        } catch (e) {}
      }
    }
    init();
  }, [gameCode]);

  // Countdown timer
  useEffect(() => {
    if (!lockTime) return;
    const tick = () => setCountdown(formatCountdown(lockTime));
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [lockTime]);

  const filtered = teams.filter(t =>
    t.team_name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (team) => {
    if (selected.find(s => s.id === team.id)) {
      setSelected(selected.filter(s => s.id !== team.id));
    } else if (selected.length < 4) {
      setSelected([...selected, team]);
    }
  };

  const handleLock = async () => {
    if (!playerId) {
      setError('Player not found. Please go back and join the game first.');
      return;
    }

    setSaving(true);
    setError('');

    const teamIds = selected.map(t => t.id);
    const { error: saveError } = await savePicks(playerId, teamIds);

    if (saveError) {
      setError(saveError.message || 'Failed to save picks. Please try again.');
      setSaving(false);
      return;
    }

    router.push(`/game/${gameCode}/waiting`);
  };

  if (error === 'Game not found') {
    return (
      <Shell>
        <Window title="⚠️ Game Not Found" icon="⚠️">
          <div style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>😕</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Game not found</div>
            <div style={{ fontSize: 12, color: 'var(--w95-muted)', marginBottom: 12 }}>
              We couldn&apos;t find a game with code &quot;{gameCode}&quot;.
            </div>
            <Btn primary onClick={() => router.push('/join')}>← Try Again</Btn>
          </div>
        </Window>
      </Shell>
    );
  }

  return (
    <Shell>
      <Window title="🎯 Pick Your 4 Teams" icon="🎯">
        <div style={{ fontSize: 12, color: 'var(--w95-muted)', marginBottom: 6, lineHeight: 1.5 }}>
          Their goals count towards your score of 21. Choose wisely!
        </div>

        {/* Countdown */}
        {lockTime && (
          <Recessed style={{ padding: 8, marginBottom: 8, background: '#FFFFF0', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--w95-orange)', fontWeight: 700 }}>⏰ Selections lock at kick-off</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--w95-navy)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
              {countdown || '...'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--w95-muted)' }}>
              {new Date(lockTime).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })},{' '}
              {new Date(lockTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} — 5 mins before first match
            </div>
          </Recessed>
        )}

        {/* Pick slots */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {[0, 1, 2, 3].map(i => (
            <Recessed key={i} style={{
              flex: 1, padding: '6px 4px', textAlign: 'center', minHeight: 36,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              {selected[i] ? (
                <>
                  <span style={{ fontSize: 14 }}>{selected[i].flag_emoji || '🏳️'}</span>
                  <span style={{ fontSize: 10, fontWeight: 700 }}>{selected[i].team_name}</span>
                </>
              ) : (
                <span style={{ fontSize: 14, opacity: 0.3 }}>+</span>
              )}
            </Recessed>
          ))}
        </div>

        <Input placeholder="🔍 Search teams..." value={search} onChange={setSearch} style={{ marginBottom: 6 }} />

        <Recessed style={{ maxHeight: 200, overflowY: 'auto' }}>
          {teams.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', fontSize: 11, color: 'var(--w95-muted)' }}>
              Loading teams...
            </div>
          ) : (
            filtered.map((t, i) => {
              const sel = selected.find(s => s.id === t.id);
              return (
                <div
                  key={t.id}
                  onClick={() => toggle(t)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 8px', cursor: 'pointer',
                    background: sel ? '#E0E8FF' : i % 2 === 0 ? 'var(--w95-input-bg)' : '#F8F8F8',
                    borderBottom: '1px solid #E8E8E8',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{t.flag_emoji || '🏳️'}</span>
                  <span style={{ fontSize: 12, flex: 1, fontWeight: sel ? 700 : 400, color: sel ? 'var(--w95-navy)' : 'var(--w95-black)' }}>
                    {t.team_name}
                  </span>
                  {sel && <Badge text="PICKED" bg="#CCE0FF" color="var(--w95-navy)" />}
                </div>
              );
            })
          )}
        </Recessed>

        <InfoPanel variant="blue">
          <div style={{ fontSize: 11, lineHeight: 1.6 }}>
            💡 You can come back and change your picks any time before the deadline.
            Once selections are locked at kick-off, only your game admin (<strong>{adminName}</strong>) can make changes on your behalf if you need to.
          </div>
        </InfoPanel>

        {error && error !== 'Game not found' && (
          <Recessed style={{ padding: 8, marginTop: 6, background: '#FFF0F0' }}>
            <div style={{ fontSize: 11, color: 'var(--w95-red)', fontWeight: 700 }}>⚠️ {error}</div>
          </Recessed>
        )}

        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <Btn onClick={() => router.push('/')}>Cancel</Btn>
          <Btn primary disabled={selected.length !== 4 || saving} onClick={handleLock}>
            {saving ? '⏳ Saving...' : selected.length === 4 ? '🔒 Lock In Picks' : `Pick ${4 - selected.length} more`}
          </Btn>
        </div>
      </Window>
    </Shell>
  );
}
