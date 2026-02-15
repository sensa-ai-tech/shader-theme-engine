import pc from 'picocolors';

const THEMES = [
  {
    name: 'nebula-tech',
    label: 'Nebula Tech',
    style: 'Dark sci-fi',
    shaders: 'MeshGradient + GlowOrb + NoiseGrain',
  },
  {
    name: 'soft-glow',
    label: 'Soft Glow',
    style: 'Light warm brand',
    shaders: 'MeshGradient + NoiseGrain',
  },
  {
    name: 'minimal-pulse',
    label: 'Minimal Pulse',
    style: 'Ultra-minimal',
    shaders: 'GlowOrb',
  },
];

export function runList(): void {
  console.log('');
  console.log(pc.bold('  Available Themes'));
  console.log('');

  for (const t of THEMES) {
    console.log(`  ${pc.bold(pc.cyan(t.label))} ${pc.dim(`(${t.name})`)}`);
    console.log(`    ${pc.dim('Style:')} ${t.style}`);
    console.log(`    ${pc.dim('Shaders:')} ${t.shaders}`);
    console.log('');
  }

  console.log(pc.dim('  Usage: npx shader-theme init --theme <name>'));
  console.log('');
}
