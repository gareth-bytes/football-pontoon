'use client';
import { useRouter } from 'next/navigation';
import Shell from '../../components/Shell';
import { Window, Btn, Recessed } from '../../components/Win95';

export default function ResponsiblePage() {
  const router = useRouter();
  return (
    <Shell>
      <Window title="🟢 Responsible Play" icon="🟢">
        <Recessed style={{ padding: 8, maxHeight: 400, overflowY: 'auto' }}>
          <div style={{ fontSize: 12, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
{`PLAY RESPONSIBLY

Football Pontoon is a fun social game.

• Sweepstakes are optional (max £10)
• Only play with money you can afford to lose
• Keep it friendly
• If it stops being fun, stop playing

SUPPORT
GamCare — gamcare.org.uk — 0808 8020 133
BeGambleAware — begambleaware.org
Gambling Therapy — gamblingtherapy.org

SELF-EXCLUSION
Email hello@getconsulting.uk`}
          </div>
        </Recessed>
        <div style={{ marginTop: 8 }}><Btn onClick={() => router.push('/')}>← Back to Home</Btn></div>
      </Window>
    </Shell>
  );
}
