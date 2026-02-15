'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Shell from '../../../components/Shell';
import { Window, Btn, Recessed, Badge, TabBar, Label, WoodenSpoon } from '../../../components/Win95';

// TODO: Fetch all of this from Supabase
const MOCK_GAME = {
  name: 'Office World Cup 2026',
  code: 'XKCD42',
  sweepAmount: 5,
  status: 'live', // 'selections' | 'live' | 'finished'
  lockTime: '2026-06-11T14:55:00Z',
};

const FL = {
  'France': '🇫🇷', 'Spain': '🇪🇸', 'Argentina': '🇦🇷', 'Croatia': '🇭🇷',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Uruguay': '🇺🇾', 'Senegal': '🇸🇳', 'Brazil': '🇧🇷',
  'Germany': '🇩🇪', 'Japan': '🇯🇵', 'Morocco': '🇲🇦', 'Portugal': '🇵🇹',
  'Netherlands': '🇳🇱', 'USA': '🇺🇸', 'Denmark': '🇩🇰', 'Ecuador': '🇪🇨',
  'Ghana': '🇬🇭', 'Tunisia': '🇹🇳', 'Mexico': '🇲🇽',
};

const TS = {
  'France': 'in', 'Spain': 'in', 'Argentina': 'in', 'Croatia': 'in',
  'England': 'in', 'Uruguay': 'in', 'Senegal': 'out', 'Brazil': 'in',
  'Germany': 'in', 'Japan': 'in', 'Morocco': 'in', 'Portugal': 'in',
  'Netherlands': 'in', 'USA': 'in', 'Denmark': 'out', 'Ecuador': 'out',
  'Ghana': 'out', 'Tunisia': 'out', 'Mexico': 'out',
};

const PLAYERS = [
  { name: 'Sarah', teams: ['France', 'Spain', 'Argentina', 'Croatia'], goals: [6, 5, 5, 5], total: 21, bust: false, lead: true, stuck: false },
  { name: 'Tom', teams: ['Spain', 'England', 'Uruguay', 'Senegal'], goals: [5, 4, 4, 3], total: 16, bust: false, lead: false, stuck: false },
  { name: 'Dave', teams: ['Brazil', 'Germany', 'Japan', 'Morocco'], goals: [5, 4, 3, 2], total: 14, bust: false, lead: false, stuck: false },
  { name: 'Mike', teams: ['England', 'Portugal', 'Netherlands', 'USA'], goals: [4, 3, 2, 1], total: 10, bust: false, lead: false, stuck: false },
  { name: 'Chris', teams: ['Denmark', 'Ecuador', 'Ghana', 'Tunisia'], goals: [2, 1, 1, 0], total: 4, bust: false, lead: false, stuck: true },
  { name: 'Lisa', teams: ['Argentina', 'Brazil', 'France', 'Germany'], goals: [8, 7, 6, 5], total: 26, bust: true, lead: false, stuck: false },
  { name: 'Jess', teams: ['Germany', 'Croatia', 'Mexico', 'Japan'], goals: [7, 6, 6, 5], total: 24, bust: true, lead: false, stuck: false },
];

const UPCOMING = [
  { home: 'France', away: 'Brazil', date: 'Jul 5', time: '20:00', round: 'QF', affects: ['Sarah', 'Dave', 'Lisa'] },
  { home: 'England', away: 'Spain', date: 'Jul 5', time: '16:00', round: 'QF', affects: ['Mike', 'Tom', 'Sarah'] },
  { home: 'Argentina', away: 'Germany', date: 'Jul 6', time: '20:00', round: 'QF', affects: ['Sarah', 'Lisa', 'Dave', 'Jess'] },
];

const EVENTS = [
  { t: '21:15', m: 'Jess goes BUST! Germany score (24)', c: 'var(--w95-red)' },
  { t: '20:58', m: 'Sarah hits 21 — PONTOON!', c: 'var(--w95-green)' },
  { t: '20:42', m: 'Dave moves to 14. Japan score', c: 'var(--w95-black)' },
  { t: '19:30', m: 'Lisa goes BUST! Argentina (26)', c: 'var(--w95-red)' },
  { t: '18:05', m: 'Chris STUCK on 4 — all teams out', c: 'var(--w95-orange)' },
];

function PreTournament({ gameCode, router }) {
  const playerNames = ['Sarah', 'Tom', 'Dave', 'Mike', 'Chris', 'Lisa', 'Jess'];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
        <span style={{ color: 'var(--w95-muted)' }}>7 players · Sweepstake £5</span>
        <Badge text="PRE-TOURNAMENT" bg="#FFCC00" color="#000" />
      </div>

      <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
        {[{ l: 'Players', v: '7' }, { l: 'Kick-off', v: '12d' }, { l: 'Picked', v: '4/7' }, { l: 'Sweep', v: '£5' }].map((s, i) => (
          <Recessed key={i} style={{ flex: 1, padding: '6px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--w95-muted)', fontWeight: 600 }}>{s.l}</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{s.v}</div>
          </Recessed>
        ))}
      </div>

      <Recessed style={{ padding: 12, marginBottom: 8, background: '#F4F8FF', textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--w95-navy)', marginBottom: 4 }}>Want to join this game?</div>
        <div style={{ fontSize: 12, color: 'var(--w95-muted)', marginBottom: 8, lineHeight: 1.5 }}>
          Picks lock 5 minutes before kick-off. Get yours in!
        </div>
        <Btn primary onClick={() => router.push(`/join?code=${gameCode}`)}>📂 Join This Game →</Btn>
      </Recessed>

      <Label>Players</Label>
      <Recessed style={{ padding: 0 }}>
        {playerNames.map((name, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 8px',
            background: i % 2 === 0 ? 'var(--w95-input-bg)' : '#F4F4F4',
            borderBottom: i < playerNames.length - 1 ? '1px solid #E8E8E8' : 'none',
          }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{name}</span>
            <span style={{ fontSize: 11, color: 'var(--w95-muted)' }}>🔒 Picks hidden</span>
          </div>
        ))}
      </Recessed>
      <div style={{ fontSize: 11, color: 'var(--w95-muted)', textAlign: 'center', lineHeight: 1.5, marginTop: 8 }}>
        Team picks will be revealed when the tournament starts.
      </div>
    </>
  );
}

function LiveBoard() {
  const [tab, setTab] = useState('standings');

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
        <span style={{ color: 'var(--w95-muted)' }}>7 players · Sweepstake £5</span>
        <Badge text="● LIVE" bg="#00AA00" color="#FFF" />
      </div>

      <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
        {[{ l: 'Players', v: '7' }, { l: 'Matches', v: '24/64' }, { l: 'Bust', v: '2' }, { l: 'Stuck', v: '1' }].map((s, i) => (
          <Recessed key={i} style={{ flex: 1, padding: '6px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--w95-muted)', fontWeight: 600 }}>{s.l}</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{s.v}</div>
          </Recessed>
        ))}
      </div>

      <TabBar
        tabs={[
          { id: 'standings', label: 'Standings' },
          { id: 'fixtures', label: 'Fixtures' },
          { id: 'events', label: 'Events' },
        ]}
        active={tab}
        onSelect={setTab}
      />

      <Recessed style={{ padding: 0, borderTop: '1px solid var(--w95-grey-dark)' }}>
        {tab === 'standings' && (
          <div>
            <div style={{ display: 'flex', padding: '4px 8px', background: 'var(--w95-grey)', borderBottom: '1px solid var(--w95-grey-dark)', fontSize: 10, fontWeight: 700, color: 'var(--w95-muted)' }}>
              <span style={{ width: 22 }}>#</span>
              <span style={{ flex: 1 }}>Player</span>
              <span style={{ width: 50, textAlign: 'center' }}>Status</span>
              <span style={{ width: 36, textAlign: 'right' }}>Pts</span>
            </div>
            {PLAYERS.map((p, i) => {
              const active = p.teams.filter(t => TS[t] === 'in').length;
              const spoon = p.bust && p.total === 26;
              return (
                <div key={i} style={{ padding: 8, background: i % 2 === 0 ? 'var(--w95-input-bg)' : '#F4F4F4', borderBottom: '1px solid #E8E8E8' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: 22, fontSize: 13, fontWeight: 700, color: p.lead ? 'var(--w95-green)' : p.bust ? 'var(--w95-red)' : p.stuck ? 'var(--w95-orange)' : 'var(--w95-muted)' }}>
                      {p.lead ? '🏆' : spoon ? '' : i + 1}
                    </span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: p.bust ? 'var(--w95-red)' : 'var(--w95-black)' }}>{p.name}</span>
                    <span style={{ width: 50, textAlign: 'center' }}>
                      {p.bust && !spoon && <Badge text="BUST" bg="#FF6666" color="#FFF" />}
                      {p.lead && <Badge text="21!" bg="#66CC66" color="#000" />}
                      {p.stuck && <Badge text="STUCK" bg="#FFCC00" color="#000" />}
                      {!p.bust && !p.lead && !p.stuck && <span style={{ fontSize: 10, color: 'var(--w95-muted)' }}>{active}/4</span>}
                    </span>
                    <span style={{ width: 36, textAlign: 'right', fontSize: 18, fontWeight: 700, color: p.bust ? 'var(--w95-red)' : p.total === 21 ? 'var(--w95-green)' : 'var(--w95-black)' }}>{p.total}</span>
                  </div>
                  {spoon && <div style={{ marginLeft: 22, marginTop: 4, marginBottom: 4 }}><WoodenSpoon /></div>}
                  <div style={{ marginLeft: 22, marginTop: spoon ? 0 : 6 }}>
                    {p.teams.map((t, j) => {
                      const out = TS[t] === 'out';
                      return (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0', opacity: out ? 0.45 : 1 }}>
                          <span style={{ fontSize: 12 }}>{FL[t]}</span>
                          <span style={{ fontSize: 12, flex: 1, textDecoration: out ? 'line-through' : 'none', color: out ? 'var(--w95-muted)' : 'var(--w95-black)' }}>{t}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: out ? 'var(--w95-muted)' : 'var(--w95-navy)' }}>{p.goals[j]}</span>
                          {out && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--w95-red)' }}>OUT</span>}
                        </div>
                      );
                    })}
                    {p.stuck && <div style={{ fontSize: 11, color: 'var(--w95-orange)', marginTop: 3 }}>🔒 All teams out — score locked at {p.total}</div>}
                    {!p.bust && !p.stuck && active < 4 && <div style={{ fontSize: 11, color: 'var(--w95-muted)', marginTop: 2 }}>{active}/4 teams still in</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'fixtures' && (
          <div>
            {UPCOMING.map((m, i) => (
              <div key={i} style={{ padding: 8, background: i % 2 === 0 ? 'var(--w95-input-bg)' : '#F4F4F4', borderBottom: '1px solid #E8E8E8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ fontWeight: 700 }}>{FL[m.home]} {m.home} v {m.away} {FL[m.away]}</span>
                  <span style={{ color: 'var(--w95-muted)', fontSize: 11 }}>{m.date} {m.time}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--w95-muted)' }}>Affects:</span>
                  {m.affects.map((n, j) => <Badge key={j} text={n} bg="#E0E0FF" color="var(--w95-navy)" />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'events' && (
          <div>
            {EVENTS.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 8px', background: i % 2 === 0 ? 'var(--w95-input-bg)' : '#F4F4F4', borderBottom: '1px solid #E8E8E8' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--w95-muted)', width: 38, flexShrink: 0 }}>{e.t}</span>
                <span style={{ fontSize: 12, color: e.c, fontWeight: 500 }}>{e.m}</span>
              </div>
            ))}
          </div>
        )}
      </Recessed>

      <div style={{ marginTop: 8 }}>
        <Btn className="btn-whatsapp">💬 Share Update to WhatsApp</Btn>
      </div>
    </>
  );
}

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const gameCode = params.code;

  const isPreTournament = MOCK_GAME.status === 'selections';

  return (
    <Shell>
      <Window title={`🏆 ${MOCK_GAME.name}`} icon="🏆">
        {isPreTournament ? (
          <PreTournament gameCode={gameCode} router={router} />
        ) : (
          <LiveBoard />
        )}
      </Window>
    </Shell>
  );
}
