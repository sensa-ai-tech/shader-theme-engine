'use client';

import dynamic from 'next/dynamic';

const GlowOrb = dynamic(
  () =>
    import('@shader-theme/core/components/GlowOrb').then((m) => m.GlowOrb),
  { ssr: false },
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#e0e0e0]" style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
      {/* Hero — single subtle GlowOrb */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <GlowOrb
            glowColor={[0.914, 0.271, 0.376]}
            intensity={0.25}
            radius={500}
            speed={0.15}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="relative z-10 text-center px-8">
          <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter mb-8 leading-none">
            Your
            <br />
            <span className="text-[#e94560]">Brand</span>
          </h1>
          <p className="text-base md:text-lg text-[#e0e0e0]/50 max-w-md mx-auto mb-12 leading-relaxed font-light">
            Minimal. Focused. Beautiful.
          </p>
          <button className="border border-[#e94560] text-[#e94560] hover:bg-[#e94560] hover:text-white px-8 py-3 rounded-lg text-sm font-normal tracking-wider transition-colors">
            GET STARTED
          </button>
        </div>
      </section>

      {/* Features — no shader, pure typography */}
      <section className="py-32 px-8">
        <div className="max-w-2xl mx-auto space-y-16">
          {[
            { num: '01', title: 'Simplicity', desc: 'One shader, maximum impact.' },
            { num: '02', title: 'Interaction', desc: 'The glow follows your cursor.' },
            { num: '03', title: 'Performance', desc: 'Ultra lightweight, mobile first.' },
          ].map((f) => (
            <div key={f.num} className="flex gap-8 items-start">
              <span className="text-sm font-semibold text-[#e94560] font-mono shrink-0 pt-1">
                {f.num}
              </span>
              <div>
                <h3 className="text-xl font-medium mb-2">{f.title}</h3>
                <p className="text-[#e0e0e0]/50 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/5 text-center">
        <p className="text-[#e0e0e0]/30 text-xs tracking-widest">
          YOUR COMPANY &copy; 2025
        </p>
      </footer>
    </div>
  );
}
