'use client';

import dynamic from 'next/dynamic';

const MeshGradient = dynamic(
  () =>
    import('@shader-theme/core/components/MeshGradient').then(
      (m) => m.MeshGradient,
    ),
  { ssr: false },
);
const GlowOrb = dynamic(
  () =>
    import('@shader-theme/core/components/GlowOrb').then((m) => m.GlowOrb),
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
    <div className="min-h-screen bg-[#050510] text-white font-sans">
      {/* Hero — MeshGradient */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <MeshGradient
            color1={[0.318, 0.0, 1.0]}
            color2={[0.0, 0.4, 0.9]}
            color3={[0.1, 0.0, 0.5]}
            speed={0.8}
            distortion={1.4}
            seed={42}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="relative z-10 text-center px-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Your Brand Here
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-8">
            A stunning landing page powered by GPU shader effects.
          </p>
          <button className="bg-[#5100ff] hover:bg-[#6620ff] text-white px-8 py-3 rounded-xl text-lg font-semibold transition-colors">
            Get Started
          </button>
        </div>
      </section>

      {/* Features — GlowOrb */}
      <section className="relative py-24 px-8">
        <div className="absolute inset-0 pointer-events-none">
          <GlowOrb
            glowColor={[0.318, 0.0, 1.0]}
            intensity={0.4}
            radius={400}
            speed={0.3}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Feature One', desc: 'Description of your first key feature.' },
              { title: 'Feature Two', desc: 'Description of your second key feature.' },
              { title: 'Feature Three', desc: 'Description of your third key feature.' },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-white/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer — NoiseGrain */}
      <footer className="relative py-16 px-8 border-t border-white/10">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <NoiseGrain
            color={[1.0, 1.0, 1.0]}
            density={0.04}
            speed={0}
            opacity={0.12}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="relative z-10 text-center">
          <p className="text-white/40">Your Company &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
}
