# ShaderTheme Engine

One-click WebGL shader themes for Next.js. Choose a theme, run one command, get a production-ready landing page with GPU-accelerated visual effects in 30 seconds.

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`@shader-theme/core`](./packages/core) | WebGL2 shader engine + React components | 0.0.1 |
| [`shader-theme`](./packages/cli) | CLI tool for project setup | 0.0.1 |
| [`demo`](./packages/demo) | Demo site with all 3 themes | — |

## Quick Start

```bash
npx shader-theme init
```

## Themes

| Theme | Style | Effects |
|-------|-------|---------|
| Nebula Tech | Dark sci-fi | MeshGradient + GlowOrb + NoiseGrain |
| Soft Glow | Light warm brand | MeshGradient + NoiseGrain |
| Minimal Pulse | Ultra-minimal | GlowOrb only |

## Development

```bash
# Install dependencies
pnpm install

# Run demo
pnpm dev

# Run all tests
pnpm test

# Build demo
pnpm build
```

## Architecture

```
packages/
  core/     — Zero-dependency WebGL2 shader engine
    src/
      components/   — ShaderCanvas, MeshGradient, NoiseGrain, GlowOrb, ThemeSection
      lib/          — shader-utils, performance-monitor, shader-registry, noise-texture
      shaders/      — GLSL fragment shaders (.frag)
      themes/       — Built-in theme JSON configs
  cli/      — CLI tool (init, check, list)
    src/
      commands/     — init, check, list
      generators/   — project scaffolding, theme file generation
      resolvers/    — project detection, conflict resolution
    templates/      — Theme page templates, scaffold files
  demo/     — Next.js demo site
```

## Key Technical Decisions

- **Zero dependencies**: Pure WebGL2 (no Three.js), only Zod for config validation
- **Pre-computed noise textures**: CPU-side Simplex noise uploaded to GPU (60 FPS on mobile)
- **Context limiting**: Max 4 WebGL contexts per page with priority-based eviction
- **Build-time injection**: No React Context, theme config at build time
- **Auto-degradation**: FPS monitoring with automatic CSS fallback

## Browser Support

Chrome 80+, Firefox 80+, Safari 15+, Edge 80+, iOS Safari 15+

## Test Coverage

150 tests across core engine and CLI:
- Core: 96 tests (unit, integration, stress, bundle size monitoring)
- CLI: 54 tests (unit, integration, generators, filesystem utils)

## License

MIT
