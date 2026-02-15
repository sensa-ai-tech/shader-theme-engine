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

interface SoftGlowPageProps {
  theme: ThemeConfig;
}

export function SoftGlowPage({ theme }: SoftGlowPageProps) {
  const { colors, sections } = theme;

  return (
    <div style={{ background: colors.background, color: colors.foreground, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero */}
      {sections.hero && (
        <ThemeSection
          config={sections.hero}
          style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          <div style={{ textAlign: 'center', padding: '0 2rem' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 300, letterSpacing: '0.02em', marginBottom: '1.5rem', color: colors.foreground }}>
              Soft Glow
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', opacity: 0.7, maxWidth: '36rem', margin: '0 auto 2rem', lineHeight: 1.8 }}>
              Warm, inviting brand presence. Low-saturation gradients
              that feel premium without overwhelming your content.
            </p>
            <code style={{ display: 'inline-block', background: 'rgba(0,0,0,0.05)', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '1rem', fontFamily: 'monospace', color: colors.foreground }}>
              npx shader-theme init --theme soft-glow
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
          <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, textAlign: 'center', marginBottom: '4rem', letterSpacing: '0.02em' }}>
              Why brands love this
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
              {[
                { title: 'Warm Palette', desc: 'Carefully curated low-saturation colors that convey trust and warmth.' },
                { title: 'Content First', desc: 'Subtle shader effects that enhance without distracting from your message.' },
                { title: 'Lightweight', desc: 'Only 2 shader instances — fast even on budget devices.' },
              ].map((f) => (
                <div
                  key={f.title}
                  style={{
                    background: '#fff',
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.75rem' }}>{f.title}</h3>
                  <p style={{ opacity: 0.6, lineHeight: 1.7, fontSize: '0.95rem' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ThemeSection>
      )}

      {/* CTA */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '1.5rem' }}>
          Elevate your brand
        </h2>
        <p style={{ opacity: 0.6, marginBottom: '2rem', fontSize: '1.1rem' }}>
          Premium look. Minimal code. Maximum impact.
        </p>
        <button
          style={{
            background: colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: '2rem',
            padding: '0.875rem 2.5rem',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 2rem', borderTop: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
        <p style={{ opacity: 0.4, fontSize: '0.9rem' }}>
          ShaderTheme Engine — Open Source MIT License
        </p>
      </footer>
    </div>
  );
}
