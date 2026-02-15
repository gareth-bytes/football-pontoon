'use client';
import { useRouter } from 'next/navigation';
import Shell from '../../components/Shell';
import { Window, Btn, Input, Divider, Label } from '../../components/Win95';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogle = async () => {
    // TODO: Supabase auth with Google
    router.push('/admin');
  };

  const handleMagicLink = async () => {
    // TODO: Supabase auth with magic link
    alert('Check your email for a sign-in link!');
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

        <Btn primary onClick={handleGoogle} style={{ marginBottom: 8 }}>
          🌐 Continue with Google
        </Btn>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 8px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--w95-grey-dark)' }} />
          <span style={{ fontSize: 10, color: 'var(--w95-muted)' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'var(--w95-grey-dark)' }} />
        </div>

        <Label>Sign in with email — no password needed</Label>
        <Input placeholder="Your admin email address" type="email" />
        <div style={{ marginTop: 6 }}>
          <Btn onClick={handleMagicLink}>📧 Send Sign-In Link</Btn>
        </div>
        <Divider />
        <Btn onClick={() => router.push('/')} style={{ fontSize: 11 }}>← Back to Home</Btn>
      </Window>
    </Shell>
  );
}
