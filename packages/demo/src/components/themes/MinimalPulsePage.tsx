'use client';

import dynamic from 'next/dynamic';
import type { ThemeConfig } from '@shader-theme/core';

const ThemeSection = dynamic(
  () =>
    import('@shader-theme/core/components/ThemeSection').then(
      (m) => m.ThemeSection,
    ),
  { ssr: false },
);

interface MinimalPulsePageProps {
  theme: ThemeConfig;
}

export function MinimalPulsePage({ theme }: MinimalPulsePageProps) {
  const { colors, sections } = theme;

  return (
    <div style={{ background: colors.background, color: colors.foreground, fontFamily: '"Inter", system-ui, sans-serif' }}>
      {/* Hero — single subtle glow */}
      {sections.hero && (
        <ThemeSection
          config={sections.hero}
          style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          <div style={{ textAlign: 'center', padding: '0 2rem' }}>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 200, letterSpacing: '-0.04em', marginBottom: '2rem', lineHeight: 1.1 }}>
              Minimal
              <br />
              <span style={{ color: colors.accent }}>Pulse</span>
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', opacity: 0.5, maxWidth: '32rem', margin: '0 auto 3rem', lineHeight: 1.8, fontWeight: 300 }}>
              Less is more. A single glow orb that follows your cursor,
              creating an intimate, focused experience.
            </p>
            <code style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '0.95rem', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
              npx shader-theme init --theme minimal-pulse
            </code>
          </div>
        </ThemeSection>
      )}

      {/* Features — no shader, pure typography */}
      <section style={{ padding: '8rem 2rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {[
              { num: '01', title: 'Single Shader', desc: 'One carefully placed glow orb. Maximum impact with minimum GPU load.' },
              { num: '02', title: 'Mouse Reactive', desc: 'The glow follows your cursor, creating a sense of depth and interaction.' },
              { num: '03', title: 'Ultra Lightweight', desc: 'Under 8KB total. Mobile-first with CSS-only fallback strategy.' },
            ].map((f) => (
              <div
                key={f.num}
                style={{
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: colors.accent, fontFamily: 'monospace', flexShrink: 0, paddingTop: '0.2rem' }}>
                  {f.num}
                </span>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: '0.5rem' }}>{f.title}</h3>
                  <p style={{ opacity: 0.5, lineHeight: 1.7, fontSize: '1rem' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 200, marginBottom: '2rem', letterSpacing: '-0.01em' }}>
          Start minimal. Stay minimal.
        </p>
        <button
          style={{
            background: 'transparent',
            color: colors.accent,
            border: `1px solid ${colors.accent}`,
            borderRadius: '0.5rem',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: 400,
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ opacity: 0.3, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
          ShaderTheme Engine — MIT License
        </p>
      </footer>
    </div>
  );
}
