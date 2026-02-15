'use client';
import { useRouter, useParams } from 'next/navigation';
import Shell from '../../../../components/Shell';
import { Window, Btn, Recessed, Badge, Divider, Label } from '../../../../components/Win95';

export default function WaitingPage() {
  const router = useRouter();
  const params = useParams();
  const gameCode = params.code;

  // TODO: Fetch from Supabase
  const myPicks = [
    { name: 'Brazil', flag: '🇧🇷' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'Japan', flag: '🇯🇵' },
  ];

  const players = [
    { name: 'You', hasPicked: true },
    { name: 'Sarah', hasPicked: true },
    { name: 'Mike', hasPicked: true },
    { name: 'Tom', hasPicked: false },
    { name: 'Chris', hasPicked: false },
    { name: 'Lisa', hasPicked: true },
    { name: 'Jess', hasPicked: false },
  ];

  return (
    <Shell>
      <Window title="🔒 Picks Saved!" icon="🔒">
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🔒</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Your picks have been saved!</div>
          <div style={{ fontSize: 12, color: 'var(--w95-muted)', lineHeight: 1.5 }}>
            Everyone's selections are hidden until the tournament kicks off.
            <br />You can still change your picks before the deadline.
          </div>
        </div>

        {/* Countdown */}
        <Recessed style={{ padding: 8, marginBottom: 8, textAlign: 'center', background: '#FFFFF0' }}>
          <div style={{ fontSize: 11, color: 'var(--w95-orange)', fontWeight: 700 }}>⏰ Tournament starts in</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--w95-navy)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
            12d 04h 23m
          </div>
          <div style={{ fontSize: 10, color: 'var(--w95-muted)' }}>Picks revealed: Wed 11 Jun, 15:55 BST</div>
        </Recessed>

        {/* Your picks */}
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

        {/* Players list */}
        <Label>Players in this game ({players.length})</Label>
        <Recessed style={{ padding: 0, marginBottom: 8 }}>
          {players.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '5px 8px',
              background: i % 2 === 0 ? 'var(--w95-input-bg)' : '#F4F4F4',
              borderBottom: i < players.length - 1 ? '1px solid #E8E8E8' : 'none',
            }}>
              <span style={{ fontSize: 12, fontWeight: p.name === 'You' ? 700 : 400 }}>
                {p.name === 'You' ? 'You ⭐' : p.name}
              </span>
              <Badge
                text={p.hasPicked ? 'Picks saved' : 'Waiting...'}
                bg={p.hasPicked ? '#66CC66' : '#FFCC00'}
                color={p.hasPicked ? '#FFF' : '#000'}
              />
            </div>
          ))}
        </Recessed>

        <div style={{ fontSize: 11, color: 'var(--w95-muted)', textAlign: 'center', lineHeight: 1.5, marginBottom: 8 }}>
          Once the tournament kicks off, everyone's picks will be revealed and the leaderboard will go live!
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Btn className="btn-whatsapp">💬 Nudge friends on WhatsApp</Btn>
          <Btn onClick={() => router.push(`/game/${gameCode}/select`)}>✏️ Change My Picks</Btn>
        </div>
      </Window>
    </Shell>
  );
}
