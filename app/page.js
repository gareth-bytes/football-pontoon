'use client';
import Shell from '../components/Shell';
import { Window, Btn, Recessed, Divider, Label } from '../components/Win95';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <Shell>
      <Window title="⚽ Football Pontoon v1.0" icon="⚽">
        <div style={{ textAlign: 'center', padding: '16px 8px 8px' }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>⚽🃏</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Football Pontoon</div>
          <div style={{ fontSize: 12, color: 'var(--w95-muted)', lineHeight: 1.6, margin: '8px 0 16px' }}>
            Pick 4 teams. Their goals add up to your score.<br />
            Get as close to 21 as you can without going bust!
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 260, margin: '0 auto' }}>
            <Btn primary onClick={() => router.push('/create')}>🎮 Create a new game</Btn>
            <Btn onClick={() => router.push('/join')}>📂 Join an existing game</Btn>
            <Btn onClick={() => router.push('/login')}>🔑 Admin Login</Btn>
            <Btn onClick={() => router.push('/rules')} style={{ fontSize: 11 }}>📖 Rules of the Game</Btn>
          </div>
        </div>
        <Divider />
        <Label>📋 How It Works</Label>
        <Recessed style={{ padding: 4 }}>
          {[
            'Choose 4 teams from the tournament',
            'Their match goals count as your points',
            'Hit 21 to win — go over, you\'re bust!',
            'Closest to 21 wins the pot',
            'Highest total = the Wooden Spoon',
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex', gap: 8, padding: '5px 6px', fontSize: 12,
              background: i % 2 === 0 ? 'var(--w95-input-bg)' : '#F4F4F4',
              borderBottom: i < 4 ? '1px solid #E8E8E8' : 'none',
            }}>
              <span style={{ fontWeight: 700, color: 'var(--w95-navy)', width: 16 }}>{i + 1}.</span>
              {t}
            </div>
          ))}
        </Recessed>
      </Window>
    </Shell>
  );
}
