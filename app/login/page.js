'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '../../components/Shell';
import { Window, Btn, Input, Divider, Label, Recessed } from '../../components/Win95';
import { signInWithGoogle, signInWithMagicLink } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message);
      setStatus('error');
    }
    // If successful, user is redirected to Google — no need to do anything here
  };

  const handleMagicLink = async () => {
    if (!email.trim()) return;
    setStatus('sending');
    setErrorMsg('');

    const { error } = await signInWithMagicLink(email);

    if (error) {
      setErrorMsg(error.message);
      setStatus('error');
    } else {
      setStatus('sent');
    }
  };

  return (
    <Shell>
      <Window title="🔑 Admin Login" icon="🔑">
        <div style={{ textAlign: 'center', padding: '8px 0 12px' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🔐</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Sign in to manage your game</div>
          <div style={{ fontSize: 11, color: 'var(--w95-muted)', marginTop: 4 }}>
            No password needed — use Google or a magic link.
          </div>
        </div>

        {status === 'error' && (
          <Recessed style={{ padding: 8, marginBottom: 8, background: '#FFF0F0' }}>
            <div style={{ fontSize: 11, color: 'var(--w95-red)', fontWeight: 700 }}>
              ⚠️ {errorMsg || 'Something went wrong. Please try again.'}
            </div>
          </Recessed>
        )}

        {status === 'sent' ? (
          <Recessed style={{ padding: 16, textAlign: 'center', background: '#F0FFF0' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>📧</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--w95-green)', marginBottom: 4 }}>
              Check your email!
            </div>
            <div style={{ fontSize: 12, color: 'var(--w95-muted)', lineHeight: 1.6 }}>
              We&apos;ve sent a sign-in link to <strong>{email}</strong>.
              <br />Click the link in the email to log in.
            </div>
            <div style={{ marginTop: 8 }}>
              <Btn onClick={() => setStatus(null)} style={{ fontSize: 11 }}>
                ← Try a different email
              </Btn>
            </div>
          </Recessed>
        ) : (
          <>
            <Btn primary onClick={handleGoogle} style={{ marginBottom: 8 }}>
              🌐 Continue with Google
            </Btn>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 8px' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--w95-grey-dark)' }} />
              <span style={{ fontSize: 10, color: 'var(--w95-muted)' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--w95-grey-dark)' }} />
            </div>

            <Label>Sign in with email — no password needed</Label>
            <Input
              placeholder="Your admin email address"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <div style={{ marginTop: 6 }}>
              <Btn
                onClick={handleMagicLink}
                disabled={!email.trim() || status === 'sending'}
              >
                {status === 'sending' ? '⏳ Sending...' : '📧 Send Sign-In Link'}
              </Btn>
            </div>
          </>
        )}

        <Divider />
        <Btn onClick={() => router.push('/')} style={{ fontSize: 11 }}>← Back to Home</Btn>
      </Window>
    </Shell>
  );
}
