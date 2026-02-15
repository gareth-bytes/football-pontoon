'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Shell from '../../../../components/Shell';
import { Window, Btn, Recessed, Badge, Label } from '../../../../components/Win95';
import { getGameByCode, getPlayers, getPlayerPicks } from '../../../../lib/supabase';
import { formatCountdown } from '../../../../lib/game';

export default function WaitingPage() {
  const router = useRouter();
  const params = useParams();
  const gameCode = params.code;

  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [myPicks, setMyPicks] = useState([]);
  const [myPlayerId, setMyPlayerId] = useState(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    async function init() {
      const { data: gameData } = await getGameByCode(gameCode);
      if (!gameData) return;
      setGame(gameData);

      const { data: playerData } = await getPlayers(gameData.id);
      if (playerData) {
        // Check which players have picks
        const playersWithStatus = await Promise.all(
          playerData.map(async (p) => {
            const { data: picks } = await getPlayerPicks(p.id);
            return { ...p, hasPicked: picks && picks.length === 4 };
          })
        );
        setPlayers(playersWithStatus);
      }

      // Get my player info from localStorage
      if (typeof window !== 'undefined') {
        try {
          const pontoonData = JSON.parse(localStorage.getItem('pontoon') || '{}');
          const playerInfo = pontoonData[gameCode];
          if (playerInfo?.playerId) {
            setMyPlayerId(playerInfo.playerId);
            const { data: picks } = await getPlayerPicks(playerInfo.playerId);
            if (picks) {
              setMyPicks(picks.map(p => ({
                name: p.tournament_teams?.team_name || 'Unknown',
                flag: p.tournament_teams?.flag_emoji || '🏳️',
              })));
            }
          }
        } catch (e) {}
      }
    }
    init();
  }, [gameCode]);

  // Countdown timer
  useEffect(() => {
    if (!game?.lock_time) return;
    const tick = () => setCountdown(formatCountdown(game.lock_time));
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [game?.lock_time]);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <Shell>
      <Window title="🔒 Picks Saved!" icon="🔒">
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🔒</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Your picks have been saved!</div>
          <div style={{ fontSize: 12, color: 'var(--w95-muted)', lineHeight: 1.5 }}>
            Everyone&apos;s selections are hidden until the tournament kicks off.
            <br />You can still change your picks before the deadline.
          </div>
        </div>

        {/* Countdown */}
        {game?.lock_time && (
          <Recessed style={{ padding: 8, marginBottom: 8, textAlign: 'center', background: '#FFFFF0' }}>
            <div style={{ fontSize: 11, color: 'var(--w95-orange)', fontWeight: 700 }}>⏰ Tournament starts in</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--w95-navy)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
              {countdown || '...'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--w95-muted)' }}>
              Picks revealed: {new Date(game.lock_time).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })},{' '}
              {new Date(game.lock_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </Recessed>
        )}

        {/* Your picks */}
        {myPicks.length > 0 && (
          <>
            <Label>Your Secret Picks</Label>
            <Recessed style={{ padding: 4, marginBottom: 8 }}>
              {myPicks.map((t, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '5px 6px',
                  background: i % 2 === 0 ? 'var(--w95-input-bg)' : '#F4F4F4',
                }}>
                  <span style={{ fontSize: 14 }}>{t.flag}</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{t.name}</span>
                </div>
              ))}
            </Recessed>
          </>
        )}

        {/* Players list */}
        <Label>Players in this game ({players.length})</Label>
        <Recessed style={{ padding: 0, marginBottom: 8 }}>
          {players.length === 0 ? (
            <div style={{ padding: 12, textAlign: 'center', fontSize: 11, color: 'var(--w95-muted)' }}>
              Loading players...
            </div>
          ) : (
            players.map((p, i) => {
              const isMe = p.id === myPlayerId;
              return (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '5px 8px',
                  background: i % 2 === 0 ? 'var(--w95-input-bg)' : '#F4F4F4',
                  borderBottom: i < players.length - 1 ? '1px solid #E8E8E8' : 'none',
                }}>
                  <span style={{ fontSize: 12, fontWeight: isMe ? 700 : 400 }}>
                    {isMe ? `${p.name} ⭐` : p.name}
                  </span>
                  <Badge
                    text={p.hasPicked ? 'Picks saved' : 'Waiting...'}
                    bg={p.hasPicked ? '#66CC66' : '#FFCC00'}
                    color={p.hasPicked ? '#FFF' : '#000'}
                  />
                </div>
              );
            })
          )}
        </Recessed>

        <div style={{ fontSize: 11, color: 'var(--w95-muted)', textAlign: 'center', lineHeight: 1.5, marginBottom: 8 }}>
          Once the tournament kicks off, everyone&apos;s picks will be revealed and the leaderboard will go live!
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Btn
            className="btn-whatsapp"
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join my Football Pontoon game! ⚽🃏\n\nCode: ${gameCode}\nJoin here: ${siteUrl}/join?code=${gameCode}`)}`, '_blank')}
          >
            💬 Nudge friends on WhatsApp
          </Btn>
          <Btn onClick={() => router.push(`/game/${gameCode}/select`)}>✏️ Change My Picks</Btn>
        </div>
      </Window>
    </Shell>
  );
}
