'use client';

import { useState } from 'react';

interface ThemeSelectorProps {
  themes: string[];
  current: string;
  onChange: (name: string) => void;
}

const THEME_META: Record<string, { label: string; emoji: string }> = {
  'nebula-tech': { label: 'Nebula Tech', emoji: '\u{1f30c}' },
  'soft-glow': { label: 'Soft Glow', emoji: '\u{1f31f}' },
  'minimal-pulse': { label: 'Minimal Pulse', emoji: '\u{1f5a4}' },
};

export function ThemeSelector({ themes, current, onChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 1000,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '0.75rem',
          padding: '0.625rem 1rem',
          fontSize: '0.875rem',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span>{THEME_META[current]?.emoji ?? ''}</span>
        <span>{THEME_META[current]?.label ?? current}</span>
        <span style={{ opacity: 0.5, marginLeft: '0.25rem' }}>{isOpen ? '\u25B2' : '\u25BC'}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            background: 'rgba(0,0,0,0.85)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '0.75rem',
            padding: '0.5rem',
            backdropFilter: 'blur(12px)',
            minWidth: '200px',
          }}
        >
          {themes.map((name) => {
            const meta = THEME_META[name] ?? { label: name, emoji: '' };
            const isActive = name === current;
            return (
              <button
                key={name}
                onClick={() => {
                  onChange(name);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                }}
              >
                <span>{meta.emoji}</span>
                <span style={{ fontWeight: isActive ? 600 : 400 }}>{meta.label}</span>
                {isActive && <span style={{ marginLeft: 'auto', opacity: 0.5 }}>\u2713</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
