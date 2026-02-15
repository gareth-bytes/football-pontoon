'use client';

// ═══════════════════════════════════════════════════
// WIN95 COMPONENT LIBRARY
// ═══════════════════════════════════════════════════

export function Window({ title, icon = '📁', active = true, children }) {
  return (
    <div className="win95-window bevel-out">
      <div className={`win95-titlebar ${!active ? 'win95-titlebar-inactive' : ''}`}>
        <span className="win95-titlebar-text">
          <span style={{ fontSize: 11 }}>{icon}</span> {title}
        </span>
        <div className="win95-titlebar-buttons">
          {['—', '□', '✕'].map((b, i) => (
            <div key={i} className="win95-titlebar-btn">{b}</div>
          ))}
        </div>
      </div>
      <div className="win95-window-body">{children}</div>
    </div>
  );
}

export function Btn({ children, onClick, primary = false, disabled = false, className = '', style = {} }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`win95-btn bevel-out ${primary ? 'win95-btn-primary' : ''} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}

export function Input({ placeholder, value, onChange, type = 'text', disabled = false, style = {} }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value || ''}
      onChange={e => onChange?.(e.target.value)}
      disabled={disabled}
      className="win95-input bevel-in"
      style={style}
    />
  );
}

export function Badge({ text, bg, color = '#000' }) {
  return (
    <span className="win95-badge bevel-in" style={{ color, background: bg }}>
      {text}
    </span>
  );
}

export function Recessed({ children, className = '', style = {} }) {
  return (
    <div className={`win95-recessed bevel-in ${className}`} style={style}>
      {children}
    </div>
  );
}

export function Divider() {
  return <div className="win95-divider" />;
}

export function Label({ children }) {
  return (
    <div style={{ fontFamily: 'var(--font-system)', fontSize: 11, fontWeight: 700, color: 'var(--w95-muted)', marginBottom: 4 }}>
      {children}
    </div>
  );
}

export function Check({ checked, label, onChange, muted = false }) {
  return (
    <div className="win95-checkbox" onClick={onChange}>
      <div className="win95-checkbox-box bevel-in">
        {checked && <span>✓</span>}
      </div>
      <span style={{ fontSize: 12, color: muted ? 'var(--w95-muted)' : 'var(--w95-black)', lineHeight: 1.5 }}>
        {label}
      </span>
    </div>
  );
}

export function Radio({ checked, label, onClick }) {
  return (
    <div className="win95-checkbox" onClick={onClick}>
      <div className="win95-checkbox-box bevel-in" style={{ borderRadius: '50%' }}>
        {checked && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--w95-black)' }} />}
      </div>
      <span style={{ fontSize: 12 }}>{label}</span>
    </div>
  );
}

export function TabBar({ tabs, active, onSelect }) {
  return (
    <div style={{ display: 'flex', marginBottom: -1 }}>
      {tabs.map((t, i) => (
        <div
          key={i}
          onClick={() => onSelect(t.id)}
          className={`win95-tab ${active === t.id ? 'win95-tab-active' : 'win95-tab-inactive'}`}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}

export function WoodenSpoon() {
  return (
    <span className="wooden-spoon-badge bevel-in">
      <span style={{ fontSize: 12 }}>🥄</span> WOODEN SPOON
    </span>
  );
}

export function InfoPanel({ children, variant = 'yellow' }) {
  const cls = variant === 'blue' ? 'win95-info-panel-blue' : 'win95-info-panel';
  return <div className={`${cls} bevel-in`}>{children}</div>;
}

export function Row({ children, index = 0, style = {} }) {
  return (
    <div
      className={index % 2 === 0 ? 'win95-row-even' : 'win95-row-odd'}
      style={{ borderBottom: '1px solid #E8E8E8', ...style }}
    >
      {children}
    </div>
  );
}
