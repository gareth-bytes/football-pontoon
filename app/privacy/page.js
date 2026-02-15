'use client';
import { useRouter } from 'next/navigation';
import Shell from '../../components/Shell';
import { Window, Btn, Recessed } from '../../components/Win95';

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <Shell>
      <Window title="🔒 Privacy Policy" icon="🔒">
        <Recessed style={{ padding: 8, maxHeight: 400, overflowY: 'auto' }}>
          <div style={{ fontSize: 12, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
{`1. WHAT WE COLLECT
Admins: name, email, marketing preferences.
Players: name, game selections, scores.
All visitors: anonymous analytics (Plausible, no cookies).

2. WHY
Contract performance, legitimate interests, consent (marketing).

3. MARKETING
Admin-only, opt-in, unsubscribe any time.

4. WHO WE SHARE WITH
Supabase (database), Vercel (hosting), Plausible (analytics). We do NOT sell data.

5. YOUR RIGHTS (UK GDPR)
Access, correct, delete. Withdraw consent. Complain to ICO.

6. COOKIES
None.

7. CONTACT
hello@getconsulting.uk`}
          </div>
        </Recessed>
        <div style={{ marginTop: 8 }}><Btn onClick={() => router.push('/')}>← Back to Home</Btn></div>
      </Window>
    </Shell>
  );
}
