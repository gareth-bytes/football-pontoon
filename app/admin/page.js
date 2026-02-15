'use client';
import { useRouter } from 'next/navigation';
import Shell from '../../components/Shell';
import { Window, Btn, Recessed, Badge, Divider, Label } from '../../components/Win95';

// TODO: Fetch from Supabase
const PLAYERS = [
  { name: 'Sarah', teams: ['🇫🇷', '🇪🇸', '🇦🇷', '🇭🇷'], status: 'PONTOON', total: 21, paid: true, bust: false, stuck: false },
  { name: 'Tom', teams: ['🇪🇸', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇺🇾', '🇸🇳'], status: '16', total: 16, paid: false, bust: false, stuck: false },
  { name: 'Dave', teams: ['🇧🇷', '🇩🇪', '🇯🇵', '🇲🇦'], status: '14', total: 14, paid: true, bust: false, stuck: false },
  { name: 'Mike', teams: ['🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇵🇹', '🇳🇱', '🇺🇸'], status: '10', total: 10, paid: true, bust: false, stuck: false },
  { name: 'Chris', teams: ['🇩🇰', '🇪🇨', '🇬🇭', '🇹🇳'], status: 'STUCK', total: 4, paid: true, bust: false, stuck: true },
  { name: 'Lisa', teams: ['🇦🇷', '🇧🇷', '🇫🇷', '🇩🇪'], status: 'BUST', total: 26, paid: true, bust: true, stuck: false },
  { name: 'Jess', teams: ['🇩🇪', '🇭🇷', '🇲🇽', '🇯🇵'], status: 'BUST', total: 24, paid: true, bust: true, stuck: false },
];

export default function AdminPage() {
  const router = useRouter();

  return (
    <Shell>
      <Window title="⚙️ Admin — Office World Cup 2026" icon="⚙️">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
          <span style={{ color: 'var(--w95-muted)' }}>Code: XKCD42</span>
          <Btn onClick={() => router.push('/')} style={{ padding: '2px 8px', fontSize: 10 }}>Logout</Btn>
        </div>

        <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
          {[
            { l: 'Players', v: '7', c: 'var(--w95-navy)' },
            { l: 'Sweep', v: '£5', c: 'var(--w95-orange)' },
            { l: 'Bust', v: '2', c: 'var(--w95-red)' },
            { l: 'Stuck', v: '1', c: 'var(--w95-orange)' },
          ].map((s, i) => (
            <Recessed key={i} style={{ flex: 1, padding: '6px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: 'var(--w95-muted)', fontWeight: 600 }}>{s.l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.c }}>{s.v}</div>
            </Recessed>
          ))}
        </div>

        <Label>Players & Payments</Label>
        <Recessed style={{ padding: 0, marginBottom: 8 }}>
          {PLAYERS.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 8px',
              background: i % 2 === 0 ? 'var(--w95-input-bg)' : '#F4F4F4',
              borderBottom: '1px solid #E8E8E8',
            }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</span>
                <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
                  {p.teams.map((flag, j) => <span key={j} style={{ fontSize: 10 }}>{flag}</span>)}
                  <span style={{
                    fontSize: 10, fontWeight: 700, marginLeft: 4,
                    color: p.bust ? 'var(--w95-red)' : p.stuck ? 'var(--w95-orange)' : 'var(--w95-navy)',
                  }}>
                    {p.bust ? 'BUST' : p.stuck ? 'STUCK' : p.total}
                  </span>
                </div>
              </div>
              <Badge
                text={p.paid ? '✓ Paid' : 'Pending'}
                bg={p.paid ? '#66CC66' : '#FFCC00'}
                color={p.paid ? '#FFF' : '#000'}
              />
            </div>
          ))}
        </Recessed>

        <Recessed style={{ padding: 8, background: '#FFFFF0', marginBottom: 8 }}>
          <Label>💰 Payout Summary</Label>
          <div style={{ fontSize: 12, lineHeight: 2 }}>
            {[
              ['Total', '£35 (7 × £5)'],
              ['Wooden Spoon (Lisa)', '−£5'],
              ['Winner\'s Pot', '£30'],
              ['→ Sarah (21)', '£30'],
            ].map(([k, v], i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                borderTop: i === 2 ? '1px solid var(--w95-grey-dark)' : 'none',
                paddingTop: i === 2 ? 4 : 0,
                fontWeight: i >= 2 ? 700 : 400,
              }}>
                <span>{k}</span>
                <span style={{ color: i === 3 ? 'var(--w95-green)' : 'var(--w95-black)' }}>{v}</span>
              </div>
            ))}
          </div>
        </Recessed>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Btn className="btn-whatsapp">💬 Share to WhatsApp</Btn>
          <Btn onClick={() => router.push('/game/XKCD42')}>📊 View Leaderboard</Btn>
        </div>
      </Window>
    </Shell>
  );
}
