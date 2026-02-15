'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Shell from '../../../../components/Shell';
import { Window, Btn, Input, Recessed, Badge, Label, InfoPanel } from '../../../../components/Win95';

// TODO: Fetch from Supabase based on tournament
const TEAMS = [
  { name: 'Argentina', code: 'ARG', flag: '🇦🇷' },
  { name: 'Australia', code: 'AUS', flag: '🇦🇺' },
  { name: 'Brazil', code: 'BRA', flag: '🇧🇷' },
  { name: 'Canada', code: 'CAN', flag: '🇨🇦' },
  { name: 'Colombia', code: 'COL', flag: '🇨🇴' },
  { name: 'Croatia', code: 'CRO', flag: '🇭🇷' },
  { name: 'Denmark', code: 'DEN', flag: '🇩🇰' },
  { name: 'Ecuador', code: 'ECU', flag: '🇪🇨' },
  { name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'France', code: 'FRA', flag: '🇫🇷' },
  { name: 'Germany', code: 'GER', flag: '🇩🇪' },
  { name: 'Ghana', code: 'GHA', flag: '🇬🇭' },
  { name: 'Iran', code: 'IRN', flag: '🇮🇷' },
  { name: 'Japan', code: 'JPN', flag: '🇯🇵' },
  { name: 'Mexico', code: 'MEX', flag: '🇲🇽' },
  { name: 'Morocco', code: 'MAR', flag: '🇲🇦' },
  { name: 'Netherlands', code: 'NED', flag: '🇳🇱' },
  { name: 'Nigeria', code: 'NGA', flag: '🇳🇬' },
  { name: 'Poland', code: 'POL', flag: '🇵🇱' },
  { name: 'Portugal', code: 'POR', flag: '🇵🇹' },
  { name: 'Qatar', code: 'QAT', flag: '🇶🇦' },
  { name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦' },
  { name: 'Senegal', code: 'SEN', flag: '🇸🇳' },
  { name: 'Serbia', code: 'SRB', flag: '🇷🇸' },
  { name: 'South Korea', code: 'KOR', flag: '🇰🇷' },
  { name: 'Spain', code: 'ESP', flag: '🇪🇸' },
  { name: 'Switzerland', code: 'SUI', flag: '🇨🇭' },
  { name: 'Tunisia', code: 'TUN', flag: '🇹🇳' },
  { name: 'USA', code: 'USA', flag: '🇺🇸' },
  { name: 'Uruguay', code: 'URU', flag: '🇺🇾' },
  { name: 'Wales', code: 'WAL', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { name: 'Cameroon', code: 'CMR', flag: '🇨🇲' },
];

export default function SelectPage() {
  const router = useRouter();
  const params = useParams();
  const gameCode = params.code;

  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  const filtered = TEAMS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (team) => {
    if (selected.find(s => s.code === team.code)) {
      setSelected(selected.filter(s => s.code !== team.code));
    } else if (selected.length < 4) {
      setSelected([...selected, team]);
    }
  };

  const handleLock = async () => {
    // TODO: Save picks to Supabase
    router.push(`/game/${gameCode}/waiting`);
  };

  // TODO: Fetch admin name from Supabase
  const adminName = 'Dave';

  return (
    <Shell>
      <Window title="🎯 Pick Your 4 Teams" icon="🎯">
        <div style={{ fontSize: 12, color: 'var(--w95-muted)', marginBottom: 6, lineHeight: 1.5 }}>
          Their goals count towards your score of 21. Choose wisely!
        </div>

        {/* Countdown */}
        <Recessed style={{ padding: 8, marginBottom: 8, background: '#FFFFF0', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--w95-orange)', fontWeight: 700 }}>⏰ Selections lock at kick-off</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--w95-navy)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
            12d 04h 23m
          </div>
          <div style={{ fontSize: 10, color: 'var(--w95-muted)' }}>Wed 11 Jun, 15:55 BST — 5 mins before first match</div>
        </Recessed>

        {/* Pick slots */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {[0, 1, 2, 3].map(i => (
            <Recessed key={i} style={{
              flex: 1, padding: '6px 4px', textAlign: 'center', minHeight: 36,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              {selected[i] ? (
                <>
                  <span style={{ fontSize: 14 }}>{selected[i].flag}</span>
                  <span style={{ fontSize: 10, fontWeight: 700 }}>{selected[i].name}</span>
                </>
              ) : (
                <span style={{ fontSize: 14, opacity: 0.3 }}>+</span>
              )}
            </Recessed>
          ))}
        </div>

        <Input placeholder="🔍 Search teams..." value={search} onChange={setSearch} style={{ marginBottom: 6 }} />

        <Recessed style={{ maxHeight: 200, overflowY: 'auto' }}>
          {filtered.map((t, i) => {
            const sel = selected.find(s => s.code === t.code);
            return (
              <div
                key={t.code}
                onClick={() => toggle(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 8px', cursor: 'pointer',
                  background: sel ? '#E0E8FF' : i % 2 === 0 ? 'var(--w95-input-bg)' : '#F8F8F8',
                  borderBottom: '1px solid #E8E8E8',
                }}
              >
                <span style={{ fontSize: 14 }}>{t.flag}</span>
                <span style={{ fontSize: 12, flex: 1, fontWeight: sel ? 700 : 400, color: sel ? 'var(--w95-navy)' : 'var(--w95-black)' }}>
                  {t.name}
                </span>
                {sel && <Badge text="PICKED" bg="#CCE0FF" color="var(--w95-navy)" />}
              </div>
            );
          })}
        </Recessed>

        <InfoPanel variant="blue">
          <div style={{ fontSize: 11, lineHeight: 1.6 }}>
            💡 You can come back and change your picks any time before the deadline.
            Once selections are locked at kick-off, only your game admin (<strong>{adminName}</strong>) can make changes on your behalf if you need to.
          </div>
        </InfoPanel>

        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <Btn onClick={() => router.push('/')}>Cancel</Btn>
          <Btn primary disabled={selected.length !== 4} onClick={handleLock}>
            {selected.length === 4 ? '🔒 Lock In Picks' : `Pick ${4 - selected.length} more`}
          </Btn>
        </div>
      </Window>
    </Shell>
  );
}
