'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '../../components/Shell';
import { Window, Btn, Input, Recessed, Divider, Label, Check, Radio, InfoPanel } from '../../components/Win95';
import { generateGameCode } from '../../lib/game';

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [gameName, setGameName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [tournament, setTournament] = useState('wc2026');
  const [sweep, setSweep] = useState(false);
  const [selFee, setSelFee] = useState(null);
  const [customFee, setCustomFee] = useState('');
  const [customErr, setCustomErr] = useState('');
  const [agreed, setAgreed] = useState({ terms: false, privacy: false, age: false, sweep: false });
  const [marketing, setMarketing] = useState(false);
  const [gameCode, setGameCode] = useState('');

  const handleCustom = (v) => {
    setCustomFee(v);
    const n = parseFloat(v.replace('£', ''));
    setCustomErr(!isNaN(n) && n > 10 ? 'Maximum £10 to keep things fun and friendly.' : '');
  };

  const canProceedStep1 = gameName.trim() && adminName.trim() && adminEmail.trim();
  const canProceedStep3 = agreed.terms && agreed.privacy && agreed.age && agreed.sweep;

  const handleCreate = async () => {
    // TODO: Create game in Supabase
    const code = generateGameCode();
    setGameCode(code);
    setStep(4);
  };

  return (
    <Shell>
      <Window title={`🎮 Create a New Game — Step ${step} of 4`} icon="🎮">
        {step === 1 && (
          <div>
            <Label>Game Name</Label>
            <Input placeholder='e.g. "Office World Cup 2026"' value={gameName} onChange={setGameName} />
            <Divider />
            <Label>Your Details (Game Admin)</Label>
            <div style={{ fontSize: 11, color: 'var(--w95-muted)', marginBottom: 6, lineHeight: 1.5 }}>
              As the game admin, you'll manage this game. Only you need to provide an email — your players won't need one.
            </div>
            <Input placeholder="Your name" value={adminName} onChange={setAdminName} style={{ marginBottom: 4 }} />
            <Input placeholder="Email address" type="email" value={adminEmail} onChange={setAdminEmail} />

            <InfoPanel>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--w95-navy)', marginBottom: 4 }}>What happens next?</div>
              <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                Once you create the game, you'll get a <strong>unique code and link</strong> to send to your friends and colleagues so they can join your game of Football Pontoon.
              </div>
              <div style={{ fontSize: 11, lineHeight: 1.6, marginTop: 4 }}>
                As admin, you'll be able to <strong>log in and manage</strong> the people who join — track who's paid any sweepstake, see everyone's picks after the deadline, and share updates.
              </div>
            </InfoPanel>

            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <Btn onClick={() => router.push('/')}>Cancel</Btn>
              <Btn primary disabled={!canProceedStep1} onClick={() => setStep(2)}>Next →</Btn>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <Label>Tournament</Label>
            <Radio checked={tournament === 'wc2026'} label="FIFA World Cup 2026" onClick={() => setTournament('wc2026')} />
            <Radio checked={tournament === 'cl2526'} label="Champions League 2025/26" onClick={() => setTournament('cl2526')} />
            <Divider />

            <div style={{ padding: 8, background: '#F4F4E8' }} className="bevel-in">
              <Check
                checked={sweep}
                label={<strong>Add a sweepstake? 🍻</strong>}
                onChange={() => { setSweep(!sweep); setSelFee(null); setCustomFee(''); setCustomErr(''); }}
              />
              <div style={{ fontSize: 11, color: 'var(--w95-muted)', marginLeft: 21, lineHeight: 1.5 }}>
                Totally optional — the game works great without one!
              </div>

              {sweep && (
                <div style={{ marginTop: 8, marginLeft: 21 }}>
                  <Recessed style={{ padding: 8, marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--w95-muted)', lineHeight: 1.6 }}>
                      ℹ️ Some groups like to add a small, friendly sweepstake — like an office sweepstake. This is entirely between you and your players. Football Pontoon doesn't handle any money.
                    </div>
                  </Recessed>
                  <Label>Suggested amount per person</Label>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    {['£1', '£2', '£5', '£10'].map((f) => (
                      <Btn
                        key={f}
                        primary={selFee === f}
                        onClick={() => { setSelFee(f); setCustomFee(''); setCustomErr(''); }}
                        style={{ flex: 1, padding: '6px 4px', fontSize: 12 }}
                      >
                        {f}
                      </Btn>
                    ))}
                  </div>
                  <Input
                    placeholder="Or custom amount (max £10)"
                    value={customFee}
                    onChange={(v) => { handleCustom(v); setSelFee(null); }}
                  />
                  {customErr && (
                    <div style={{ fontSize: 11, color: 'var(--w95-red)', marginTop: 4, fontWeight: 700 }}>
                      ⚠️ {customErr}
                    </div>
                  )}
                  <div style={{ fontSize: 10, color: 'var(--w95-muted)', marginTop: 6, lineHeight: 1.5 }}>
                    This is shown to players as a suggestion only. You collect and distribute any money yourself.
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <Btn onClick={() => setStep(1)}>← Back</Btn>
              <Btn primary disabled={sweep && !!customErr} onClick={() => setStep(3)}>Next →</Btn>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <Label>Confirm & Agree</Label>
            <Recessed style={{ padding: 8 }}>
              <Check
                checked={agreed.terms}
                onChange={() => setAgreed(a => ({ ...a, terms: !a.terms }))}
                label={<span>I agree to the <span className="text-link" onClick={() => router.push('/terms')}>Terms & Conditions</span></span>}
              />
              <Check
                checked={agreed.privacy}
                onChange={() => setAgreed(a => ({ ...a, privacy: !a.privacy }))}
                label={<span>I've read the <span className="text-link" onClick={() => router.push('/privacy')}>Privacy Policy</span></span>}
              />
              <Check
                checked={agreed.age}
                onChange={() => setAgreed(a => ({ ...a, age: !a.age }))}
                label="I confirm all players in my game will be 18+"
              />
              <Check
                checked={agreed.sweep}
                onChange={() => setAgreed(a => ({ ...a, sweep: !a.sweep }))}
                label="I understand any sweepstake is organised privately by me"
              />
              <Divider />
              <Check
                checked={marketing}
                onChange={() => setMarketing(!marketing)}
                label="Send me updates about new features (optional)"
                muted
              />
            </Recessed>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <Btn onClick={() => setStep(2)}>← Back</Btn>
              <Btn primary disabled={!canProceedStep3} onClick={handleCreate}>Create Game</Btn>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🎉</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Your game is ready!</div>
            <div style={{ fontSize: 12, color: 'var(--w95-muted)', marginBottom: 8 }}>Share this code or link with your players.</div>
            <Recessed style={{ padding: 16, margin: '8px 0', textAlign: 'center' }}>
              <Label>Game Code</Label>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--w95-navy)', letterSpacing: 6 }}>
                {gameCode}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--w95-muted)', marginTop: 6, wordBreak: 'break-all' }}>
                footballpontoon.co.uk/join/{gameCode}
              </div>
            </Recessed>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Btn className="btn-whatsapp">💬 Share to WhatsApp</Btn>
              <Btn onClick={() => navigator.clipboard?.writeText(`footballpontoon.co.uk/join/${gameCode}`)}>
                📋 Copy Link
              </Btn>
              <Divider />
              <Btn primary onClick={() => router.push(`/game/${gameCode}/select`)}>🎯 Make Your Picks</Btn>
              <Btn onClick={() => router.push('/admin')}>⚙️ Go to Admin Panel</Btn>
            </div>
          </div>
        )}
      </Window>
    </Shell>
  );
}
