'use client';
import { useRouter } from 'next/navigation';
import Shell from '../../components/Shell';
import { Window, Btn, Recessed } from '../../components/Win95';

export default function TermsPage() {
  const router = useRouter();
  return (
    <Shell>
      <Window title="📋 Terms & Conditions" icon="📋">
        <Recessed style={{ padding: 8, maxHeight: 400, overflowY: 'auto' }}>
          <div style={{ fontSize: 12, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
{`1. ABOUT THE PLATFORM
Football Pontoon is a game management tool at footballpontoon.co.uk. We provide scoring, tracking and leaderboard features for private social games. We do not operate as a gambling service and do not handle, hold or process any money.

2. ELIGIBILITY
You must be 18+ to use this platform.

3. SWEEPSTAKES
Game admins may indicate an optional sweepstake amount (max £10). Football Pontoon does not collect, hold, or distribute any money.

4. GAME ADMIN RESPONSIBILITIES
Admins are responsible for ensuring players are 18+, managing any sweepstake privately, and ensuring compliance with applicable laws.

5. LIMITATION OF LIABILITY
The platform is provided "as is." We are not liable for losses from participation.

6. GOVERNING LAW
England and Wales.

7. CONTACT
hello@getconsulting.uk`}
          </div>
        </Recessed>
        <div style={{ marginTop: 8 }}><Btn onClick={() => router.push('/')}>← Back to Home</Btn></div>
      </Window>
    </Shell>
  );
}
