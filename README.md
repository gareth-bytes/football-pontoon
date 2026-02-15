# Football Pontoon ⚽🃏

A social game management platform with a Windows 95 design aesthetic.

Pick 4 teams. Count their goals. Get to 21 without going bust!

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/YOUR_USERNAME/football-pontoon.git
cd football-pontoon
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Set up the database
# Go to your Supabase project → SQL Editor
# Paste and run the contents of lib/schema.sql

# 4. Run locally
npm run dev
# Visit http://localhost:3000
```

## Tech Stack

- **Next.js 15** — React framework with App Router
- **Supabase** — Database, auth (Google SSO + magic link), real-time
- **API-Football** — Live goal data
- **Vercel** — Hosting
- **Plausible** — Privacy-friendly analytics

## Project Structure

```
pontoon/
├── app/                    # Next.js App Router pages
│   ├── page.js             # Home
│   ├── create/page.js      # Create game wizard (4 steps)
│   ├── join/page.js        # Join game (supports ?code= prefill)
│   ├── login/page.js       # Admin login (Google SSO + magic link)
│   ├── admin/page.js       # Admin panel
│   ├── rules/page.js       # Full game rules
│   ├── terms/page.js       # Terms & Conditions
│   ├── privacy/page.js     # Privacy Policy
│   ├── responsible/page.js # Responsible Play
│   └── game/
│       └── [code]/
│           ├── page.js     # Leaderboard (pre-tournament + live)
│           ├── select/page.js  # Team selection
│           └── waiting/page.js # Waiting room
├── components/
│   ├── Shell.js            # App shell with taskbar + start menu
│   └── Win95.js            # Reusable Win95 component library
├── lib/
│   ├── supabase.js         # Supabase client
│   ├── game.js             # Game logic utilities
│   └── schema.sql          # Database schema (run in Supabase)
├── styles/
│   └── win95.css           # Win95 design system
├── package.json
├── next.config.js
└── .env.local.example
```

## Design

Windows 95 aesthetic with:
- Beveled 3D borders, recessed panels
- Navy blue title bars with min/max/close buttons  
- Working Start menu and taskbar
- System fonts (Segoe UI / Tahoma)
- WCAG AA accessible contrast ratios throughout

## Game Rules

- Pick 4 teams from a tournament
- Goals scored by your teams add to your total
- Regular time + extra time goals count; penalties don't
- Own goals count for the attacking team
- Hit 21 = PONTOON (best result)
- Over 21 = BUST (can't win)
- All teams eliminated = STUCK (score locked)
- Ties: prize shared equally
- Wooden Spoon: highest total (tiebreak: first to reach that score)

## TODO

- [ ] Connect Supabase auth (Google + magic link)  
- [ ] Wire up game creation to database
- [ ] Wire up join flow to database
- [ ] Wire up team selection + picks
- [ ] Build scoring engine (goals → scores)
- [ ] Connect API-Football for live data
- [ ] Real-time leaderboard updates
- [ ] WhatsApp share links
- [ ] Super admin dashboard
- [ ] Plausible analytics integration
- [ ] Domain setup + Vercel deployment
