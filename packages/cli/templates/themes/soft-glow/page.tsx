'use client';

import dynamic from 'next/dynamic';

const MeshGradient = dynamic(
  () =>
    import('@shader-theme/core/components/MeshGradient').then(
      (m) => m.MeshGradient,
    ),
  { ssr: false },
);
const NoiseGrain = dynamic(
  () =>
    import('@shader-theme/core/components/NoiseGrain').then(
      (m) => m.NoiseGrain,
    ),
  { ssr: false },
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fef9f4] text-[#2d2d2d] font-sans">
      {/* Hero — MeshGradient (warm, desaturated) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <MeshGradient
            color1={[0.91, 0.659, 0.486]}
            color2={[0.831, 0.647, 0.647]}
            color3={[0.584, 0.882, 0.827]}
            speed={0.5}
            distortion={0.6}
            seed={17}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="relative z-10 text-center px-8">
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6">
            Your Brand Here
          </h1>
          <p className="text-lg md:text-xl text-[#2d2d2d]/70 max-w-xl mx-auto mb-8 leading-relaxed">
            A warm, inviting landing page with subtle shader effects.
          </p>
          <button className="bg-[#e8a87c] hover:bg-[#d89a6e] text-white px-8 py-3 rounded-full text-base font-medium transition-colors">
            Get Started
          </button>
        </div>
      </section>

      {/* Features — NoiseGrain (subtle overlay) */}
      <section className="relative py-24 px-8">
        <div className="absolute inset-0 pointer-events-none">
          <NoiseGrain
            color={[0.176, 0.176, 0.176]}
            density={0.03}
            speed={0}
            opacity={0.06}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-center mb-16 tracking-wide">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Quality', desc: 'Crafted with care and attention to detail.' },
              { title: 'Trust', desc: 'Built on a foundation of reliability.' },
              { title: 'Simplicity', desc: 'Clean design that puts your content first.' },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-black/5"
              >
                <h3 className="text-lg font-semibold mb-3">{f.title}</h3>
                <p className="text-[#2d2d2d]/60 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer — clean, no shader */}
      <footer className="py-12 px-8 border-t border-black/5 text-center">
        <p className="text-[#2d2d2d]/40 text-sm">Your Company &copy; 2025</p>
      </footer>
    </div>
  );
}
