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

interface NebulaTechPageProps {
  theme: ThemeConfig;
}

export function NebulaTechPage({ theme }: NebulaTechPageProps) {
  const { colors, sections } = theme;

  return (
    <div style={{ background: colors.background, color: colors.foreground }}>
      {/* Hero */}
      {sections.hero && (
        <ThemeSection
          config={sections.hero}
          style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          <div style={{ textAlign: 'center', padding: '0 2rem' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              Nebula Tech
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', opacity: 0.8, maxWidth: '40rem', margin: '0 auto 2rem' }}>
              Dark sci-fi aesthetic with flowing purple-blue fluid gradients.
              GPU-powered visuals that feel alive.
            </p>
            <code style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '1.1rem', fontFamily: 'monospace' }}>
              npx shader-theme init --theme nebula-tech
            </code>
          </div>
        </ThemeSection>
      )}

      {/* Features */}
      {sections.features && (
        <ThemeSection
          config={sections.features}
          style={{ padding: '6rem 2rem' }}
        >
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '4rem' }}>
              Features
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {[
                { title: 'Zero Dependencies', desc: 'Pure WebGL2 — no Three.js, no bloat.' },
                { title: 'SSR Safe', desc: 'Built for Next.js App Router with CSS fallback.' },
                { title: 'Auto Degradation', desc: 'GPU detection + FPS monitoring. Graceful fallback.' },
              ].map((f) => (
                <div
                  key={f.title}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{f.title}</h3>
                  <p style={{ opacity: 0.6, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ThemeSection>
      )}

      {/* CTA */}
      {sections.cta && (
        <ThemeSection
          config={sections.cta}
          style={{ padding: '6rem 2rem', textAlign: 'center' }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Ready to launch?
          </h2>
          <p style={{ opacity: 0.7, marginBottom: '2rem', fontSize: '1.2rem' }}>
            One command. Thirty seconds. Full shader theme.
          </p>
          <button
            style={{
              background: colors.primary,
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Get Started
          </button>
        </ThemeSection>
      )}

      {/* Footer */}
      {sections.footer && (
        <ThemeSection
          config={sections.footer}
          style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div style={{ textAlign: 'center', opacity: 0.4 }}>
            <p>ShaderTheme Engine — Open Source MIT License</p>
          </div>
        </ThemeSection>
      )}
    </div>
  );
}
