'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase automatically handles the token exchange from the URL hash
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
        router.push('/login?error=auth_failed');
        return;
      }

      if (session) {
        // Check if this user has any games as admin
        const { data: games } = await supabase
          .from('games')
          .select('code')
          .eq('admin_id', session.user.id)
          .limit(1);

        if (games && games.length > 0) {
          router.push('/admin');
        } else {
          router.push('/create');
        }
      } else {
        router.push('/login');
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div style={{
      background: '#008080', minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', 'Tahoma', sans-serif", color: 'white',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⚽</div>
        <div style={{ fontSize: 14 }}>Signing you in...</div>
      </div>
    </div>
  );
}
