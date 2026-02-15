'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { icon: '⚽', label: 'Home', href: '/' },
  { icon: '🎮', label: 'Create a New Game', href: '/create' },
  { icon: '📂', label: 'Join an Existing Game', href: '/join' },
  { icon: '🔑', label: 'Admin Login', href: '/login' },
  null, // divider
  { icon: '📖', label: 'Rules of the Game', href: '/rules' },
  { icon: '📋', label: 'Terms & Conditions', href: '/terms' },
  { icon: '🔒', label: 'Privacy Policy', href: '/privacy' },
  { icon: '🟢', label: 'Responsible Play', href: '/responsible' },
];

const DESKTOP_ICONS = [
  { icon: '⚽', label: 'Pontoon', href: '/' },
  { icon: '🎮', label: 'Create', href: '/create' },
  { icon: '📂', label: 'Join', href: '/join' },
  { icon: '📖', label: 'Rules', href: '/rules' },
];

const SCREEN_LABELS = {
  '/': '⚽ Football Pontoon',
  '/create': '🎮 Create Game',
  '/join': '📂 Join Game',
  '/login': '🔑 Admin Login',
  '/admin': '⚙️ Admin Panel',
  '/rules': '📖 Rules',
  '/terms': '📋 Terms',
  '/privacy': '🔒 Privacy',
  '/responsible': '🟢 Responsible Play',
};

export default function Shell({ children }) {
  const [startOpen, setStartOpen] = useState(false);
  const [time, setTime] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, []);

  const navigate = (href) => {
    router.push(href);
    setStartOpen(false);
  };

  const screenLabel = SCREEN_LABELS[pathname] || '⚽ Football Pontoon';

  return (
    <div className="app-container">
      {/* Desktop area */}
      <div className="app-content" onClick={() => startOpen && setStartOpen(false)}>
        {/* Desktop icons */}
        <div style={{ display: 'flex', gap: 4, padding: '8px 8px 0', flexWrap: 'wrap' }}>
          {DESKTOP_ICONS.map((d, i) => (
            <div
              key={i}
              className="win95-desktop-icon"
              onClick={(e) => { e.stopPropagation(); navigate(d.href); }}
            >
              <div className="win95-desktop-icon-emoji">{d.icon}</div>
              <div className="win95-desktop-icon-label">{d.label}</div>
            </div>
          ))}
        </div>

        {/* Page content */}
        {children}
      </div>

      {/* Start Menu */}
      {startOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', maxWidth: 420, width: 'calc(100% - 16px)', zIndex: 100 }}
        >
          <div className="win95-start-menu bevel-out" style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <div style={{ display: 'flex' }}>
              <div className="win95-start-sidebar">
                <span className="win95-start-sidebar-text">PONTOON FC</span>
              </div>
              <div style={{ flex: 1 }}>
                {NAV_ITEMS.map((item, i) => {
                  if (!item) return <div key={i} className="win95-start-divider" />;
                  const isActive = pathname === item.href;
                  return (
                    <div
                      key={i}
                      className={`win95-start-item ${isActive ? 'win95-start-item-active' : ''}`}
                      onClick={() => navigate(item.href)}
                    >
                      <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="win95-taskbar">
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <div
            className="win95-start-btn bevel-out"
            style={startOpen ? {
              borderTop: '2px solid var(--w95-grey-dark)',
              borderLeft: '2px solid var(--w95-grey-dark)',
              borderRight: '2px solid var(--w95-white)',
              borderBottom: '2px solid var(--w95-white)',
              background: 'var(--w95-grey-light)',
            } : {}}
            onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); }}
          >
            <span style={{ fontSize: 12 }}>🪟</span> Start
          </div>
          <div className="bevel-in" style={{
            fontFamily: 'var(--font-system)', fontSize: 10, fontWeight: 700,
            background: 'var(--w95-white)', padding: '3px 6px',
            maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {screenLabel}
          </div>
        </div>
        <div className="win95-clock bevel-in">
          <span style={{ fontSize: 10 }}>⚽</span> {time}
        </div>
      </div>
    </div>
  );
}
