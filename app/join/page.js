'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Shell from '../../components/Shell';
import { Window, Btn, Input, Divider, Label, Check, Recessed } from '../../components/Win95';
import { getGameByCode, addPlayer } from '../../lib/supabase';

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefill = searchParams.get('code') || '';

  const [code, setCode] = useState(prefill);
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState(null); // null | 'checking' | 'joining' | 'not_found' | 'error'
  const [gameName, setGameName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // If prefilled code, look up the game immediately
  useEffect(() => {
    if (prefill) {
      lookupGame(prefill);
    }
  }, [prefill]);

  const lookupGame = async (gameCode) => {
    if (!gameCode.trim()) return;
    setStatus('checking');
    const { data: game, error } = await getGameByCode(gameCode);
    if (error || !game) {
      setStatus('not_found');
      setGameName('');
    } else {
      setStatus(null);
      setGameName(game.name);
    }
  };

  const handleCodeChange = (v) => {
    const upper = v.toUpperCase();
    setCode(upper);
    setStatus(null);
    setGameName('');
    // Auto-lookup when code is 6 chars
    if (upper.length >= 5) {
      lookupGame(upper);
    }
  };

  const canJoin = code.trim() && name.trim() && agreed && gameName && status !== 'not_found';

  const handleJoin = async () => {
    setStatus('joining');
    setErrorMsg('');

    const { data: game } = await getGameByCode(code);
    if (!game) {
      setStatus('not_found');
      return;
    }

    const { data: player, error } = await addPlayer({
      gameId: game.id,
      name: name.trim(),
    });

    if (error) {
      setErrorMsg(error.message || 'Failed to join. Please try again.');
      setStatus('error');
      return;
    }

    // Store player ID in localStorage so we can identify them later
    if (typeof window !== 'undefined') {
      try {
        const pontoonData = JSON.parse(localStorage.getItem('pontoon') || '{}');
        pontoonData[code] = { playerId: player.id, playerName: name.trim() };
        localStorage.setItem('pontoon', JSON.stringify(pontoonData));
      } catch (e) {
        // localStorage might not be available
      }
    }

    router.push(`/game/${code}/select`);
  };

  return (
    <Window title="📂 Join an Existing Game" icon="📂">
      <Label>Game Code</Label>
      <Input
        placeholder="Enter code (e.g. XKCD42)"
        value={code}
        onChange={handleCodeChange}
      />
      {prefill && gameName && (
        <div style={{ fontSize: 11, color: 'var(--w95-green)', marginTop: 2, fontWeight: 700 }}>
          ✓ Code prefilled from your invite link
        </div>
      )}
      {status === 'checking' && (
        <div style={{ fontSize: 11, color: 'var(--w95-muted)', marginTop: 2 }}>⏳ Looking up game...</div>
      )}
      {status === 'not_found' && (
        <div style={{ fontSize: 11, color: 'var(--w95-red)', marginTop: 2, fontWeight: 700 }}>
          ⚠️ No game found with that code. Check and try again.
        </div>
      )}
      {gameName && (
        <Recessed style={{ padding: 8, marginTop: 6, background: '#F0FFF0' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--w95-green)' }}>✓ Found: {gameName}</div>
        </Recessed>
      )}

      <div style={{ marginTop: 6 }}>
        <Label>Your Name</Label>
      </div>
      <Input placeholder="What should we call you?" value={name} onChange={setName} />

      <Divider />

      <Check
        checked={agreed}
        onChange={() => setAgreed(!agreed)}
        label={
          <span>
            I&apos;m 18+ and agree to the{' '}
            <span className="text-link" onClick={() => router.push('/terms')}>Terms</span> &{' '}
            <span className="text-link" onClick={() => router.push('/privacy')}>Privacy Policy</span>
          </span>
        }
      />

      {status === 'error' && (
        <Recessed style={{ padding: 8, marginTop: 6, background: '#FFF0F0' }}>
          <div style={{ fontSize: 11, color: 'var(--w95-red)', fontWeight: 700 }}>⚠️ {errorMsg}</div>
        </Recessed>
      )}

      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        <Btn onClick={() => router.push('/')}>Cancel</Btn>
        <Btn primary disabled={!canJoin || status === 'joining'} onClick={handleJoin}>
          {status === 'joining' ? '⏳ Joining...' : 'Join Game →'}
        </Btn>
      </div>
    </Window>
  );
}

export default function JoinPage() {
  return (
    <Shell>
      <Suspense fallback={
        <Window title="📂 Join an Existing Game" icon="📂">
          <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>
        </Window>
      }>
        <JoinForm />
      </Suspense>
    </Shell>
  );
}
