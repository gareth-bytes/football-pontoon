'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Shell from '../../components/Shell';
import { Window, Btn, Input, Divider, Label, Check } from '../../components/Win95';

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefill = searchParams.get('code') || '';

  const [code, setCode] = useState(prefill);
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const canJoin = code.trim() && name.trim() && agreed;

  const handleJoin = async () => {
    router.push(`/game/${code.toUpperCase()}/select`);
  };

  return (
    <Window title="📂 Join an Existing Game" icon="📂">
      <Label>Game Code</Label>
      <Input
        placeholder="Enter code (e.g. XKCD42)"
        value={code}
        onChange={(v) => setCode(v.toUpperCase())}
      />
      {prefill && (
        <div style={{ fontSize: 11, color: 'var(--w95-green)', marginTop: 2, fontWeight: 700 }}>
          ✓ Code prefilled from your invite link
        </div>
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

      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        <Btn onClick={() => router.push('/')}>Cancel</Btn>
        <Btn primary disabled={!canJoin} onClick={handleJoin}>Join Game →</Btn>
      </div>
    </Window>
  );
}

export default function JoinPage() {
  return (
    <Shell>
      <Suspense fallback={<Window title="📂 Join an Existing Game" icon="📂"><div style={{ padding: 20, textAlign: 'center' }}>Loading...</div></Window>}>
        <JoinForm />
      </Suspense>
    </Shell>
  );
}
