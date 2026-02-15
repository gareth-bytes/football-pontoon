import { NextResponse } from 'next/server';

export async function POST(request) {
  const { adminName, adminEmail, gameName, gameCode, siteUrl, sweepAmount } = await request.json();

  if (!adminEmail || !gameCode) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const joinUrl = `${siteUrl}/join?code=${gameCode}`;
  const loginUrl = `${siteUrl}/login`;
  const sweepText = sweepAmount ? `£${sweepAmount} per person` : 'No sweepstake';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#008080;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#008080;padding:24px 16px;">
    <tr><td align="center">
      <table width="400" cellpadding="0" cellspacing="0" style="background:#C0C0C0;border-top:2px solid #FFF;border-left:2px solid #FFF;border-right:2px solid #808080;border-bottom:2px solid #808080;box-shadow:2px 2px 0 #000;">
        <!-- Title bar -->
        <tr><td style="background:linear-gradient(90deg,#000080,#1034A6);padding:4px 6px;">
          <span style="color:#FFF;font-size:13px;font-weight:700;">⚽ Football Pontoon — Your Game is Ready!</span>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:16px;">
          <p style="font-size:14px;margin:0 0 12px;color:#000;">Hi ${adminName},</p>
          <p style="font-size:13px;margin:0 0 16px;color:#000;line-height:1.6;">Your game <strong>${gameName}</strong> has been created! Here's everything you need to get your players involved.</p>

          <!-- Game code panel -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF;border-top:2px solid #808080;border-left:2px solid #808080;border-right:2px solid #FFF;border-bottom:2px solid #FFF;margin-bottom:16px;">
            <tr><td style="padding:16px;text-align:center;">
              <div style="font-size:11px;color:#4A4A4A;font-weight:700;margin-bottom:4px;">GAME CODE</div>
              <div style="font-family:Consolas,'Courier New',monospace;font-size:32px;font-weight:700;color:#000080;letter-spacing:6px;">${gameCode}</div>
              <div style="font-size:11px;color:#4A4A4A;margin-top:6px;">Sweepstake: ${sweepText}</div>
            </td></tr>
          </table>

          <!-- Share link -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
            <tr><td>
              <p style="font-size:12px;color:#4A4A4A;margin:0 0 6px;font-weight:700;">Share this link with your players:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF;border-top:2px solid #808080;border-left:2px solid #808080;border-right:2px solid #FFF;border-bottom:2px solid #FFF;">
                <tr><td style="padding:8px;">
                  <a href="${joinUrl}" style="font-family:Consolas,'Courier New',monospace;font-size:12px;color:#0000CC;word-break:break-all;">${joinUrl}</a>
                </td></tr>
              </table>
            </td></tr>
          </table>

          <!-- What to do next -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFF0;border-top:2px solid #808080;border-left:2px solid #808080;border-right:2px solid #FFF;border-bottom:2px solid #FFF;margin-bottom:16px;">
            <tr><td style="padding:12px;">
              <p style="font-size:12px;font-weight:700;color:#000080;margin:0 0 6px;">What to do next:</p>
              <p style="font-size:12px;color:#000;margin:0 0 4px;line-height:1.6;">1. <strong>Share the code or link</strong> with your friends and colleagues</p>
              <p style="font-size:12px;color:#000;margin:0 0 4px;line-height:1.6;">2. <strong>Pick your own teams</strong> before the deadline</p>
              <p style="font-size:12px;color:#000;margin:0;line-height:1.6;">3. <strong>Log in as admin</strong> to manage players and track payments</p>
            </td></tr>
          </table>

          <!-- Buttons -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
            <tr>
              <td width="48%" style="padding-right:4px;">
                <a href="${joinUrl}" style="display:block;text-align:center;padding:10px 8px;background:#C0C0C0;border-top:2px solid #FFF;border-left:2px solid #FFF;border-right:2px solid #808080;border-bottom:2px solid #808080;font-size:12px;font-weight:700;color:#000;text-decoration:none;">🎯 Pick Your Teams</a>
              </td>
              <td width="48%" style="padding-left:4px;">
                <a href="${loginUrl}" style="display:block;text-align:center;padding:10px 8px;background:#C0C0C0;border-top:2px solid #FFF;border-left:2px solid #FFF;border-right:2px solid #808080;border-bottom:2px solid #808080;font-size:12px;font-weight:700;color:#000;text-decoration:none;">🔑 Admin Login</a>
              </td>
            </tr>
          </table>

          <!-- Footer -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #808080;margin-top:8px;">
            <tr><td style="padding-top:8px;">
              <p style="font-size:10px;color:#4A4A4A;margin:0;line-height:1.6;">Keep this email — you'll need the game code to manage your game. If you have any questions, reply to this email or contact hello@footballpontoon.co.uk</p>
            </td></tr>
          </table>
        </td></tr>
      </table>

      <!-- Taskbar -->
      <table width="400" cellpadding="0" cellspacing="0" style="background:#C0C0C0;border-top:2px solid #FFF;margin-top:2px;">
        <tr><td style="padding:3px 6px;">
          <span style="font-size:10px;color:#000;font-weight:700;">🪟 Start</span>
          <span style="font-size:10px;color:#4A4A4A;margin-left:12px;">⚽ Football Pontoon</span>
        </td></tr>
      </table>

    </td></tr>
  </table>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Football Pontoon <hello@footballpontoon.co.uk>',
        to: adminEmail,
        subject: `⚽ Your game "${gameName}" is ready! Code: ${gameCode}`,
        html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error('Resend error:', result);
      return NextResponse.json({ error: result.message || 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
