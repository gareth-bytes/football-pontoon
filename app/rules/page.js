'use client';
import { useRouter } from 'next/navigation';
import Shell from '../../components/Shell';
import { Window, Btn, Recessed } from '../../components/Win95';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--w95-navy)', marginBottom: 6 }}>{title}</div>
    {children}
  </div>
);

const P = ({ children }) => <p style={{ margin: '0 0 6px', fontSize: 12, lineHeight: 1.7 }}>{children}</p>;

export default function RulesPage() {
  const router = useRouter();

  return (
    <Shell>
      <Window title="📖 Rules of the Game" icon="📖">
        <Recessed style={{ padding: 8, maxHeight: 420, overflowY: 'auto' }}>
          <Section title="Objective">
            <P>Score as close to <strong>21</strong> as possible using the combined goals of your 4 chosen teams — without going over.</P>
          </Section>

          <Section title="How To Play">
            <P>1. <strong>Pick 4 teams</strong> from the tournament before the deadline (5 minutes before the first match kicks off).</P>
            <P>2. Every goal your teams score in the tournament <strong>adds 1 point</strong> to your total.</P>
            <P>3. <strong>Regular time and extra time goals count.</strong> Penalty shootout goals do not.</P>
            <P>4. Own goals are counted for the <strong>attacking team</strong> (the team that benefitted from the goal).</P>
            <P>5. Your picks are <strong>hidden</strong> until the tournament starts, then revealed to everyone.</P>
          </Section>

          <Section title="Winning">
            <P>The player with the <strong>highest score at or below 21</strong> when the tournament ends wins.</P>
            <P>If you go over 21, you're <strong>BUST</strong> — you can't win the main prize.</P>
            <P>If you hit exactly 21, that's a <strong>PONTOON</strong> — the best possible result!</P>
            <P>If <strong>all players</strong> go bust, the sweepstake (if any) is refunded in full.</P>
          </Section>

          <Section title="Ties">
            <P>If two or more players are tied on the same score ≤21, the <strong>prize is shared equally</strong> between them.</P>
            <P>For example: if Tom and Dave both finish on 18, they split the pot 50/50.</P>
          </Section>

          <Section title="The Wooden Spoon">
            <P>The player with the <strong>highest overall score</strong> (including bust scores) receives the Wooden Spoon.</P>
            <P>If there's a sweepstake, the Wooden Spoon winner gets their entry fee back as a consolation prize.</P>
            <P>If two or more players tie for the Wooden Spoon, it goes to the player who <strong>reached that score first</strong> (based on the timestamp of the goal that took them to that total).</P>
          </Section>

          <Section title="Stuck Players">
            <P>If all 4 of your teams are <strong>eliminated</strong> from the tournament, your score is permanently locked. You're "stuck" — you can't gain any more points but you also can't go bust.</P>
          </Section>

          <Section title="Selections">
            <P>Picks lock 5 minutes before the first match of the tournament.</P>
            <P>You can change your picks as many times as you like before the deadline.</P>
            <P>After the deadline, only your game admin can modify picks on your behalf.</P>
          </Section>

          <Section title="Sweepstake">
            <P>Sweepstakes are <strong>entirely optional</strong> and capped at £10 per person.</P>
            <P>Football Pontoon does not handle money. Any sweepstake is organised privately by your game admin.</P>
            <P>Suggested payout: Winner takes the pot minus one entry fee. The Wooden Spoon winner gets one entry fee back.</P>
            <P>Your game admin can adjust the payout structure for their group.</P>
          </Section>
        </Recessed>
        <div style={{ marginTop: 8 }}>
          <Btn onClick={() => router.push('/')}>← Back to Home</Btn>
        </div>
      </Window>
    </Shell>
  );
}
