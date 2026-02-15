# @shader-theme/core

Zero-dependency WebGL2 shader engine for Next.js. Provides GPU-accelerated visual effects (fluid gradients, noise textures, glow orbs) as drop-in React components with automatic performance monitoring and CSS fallback.

## Installation

```bash
npm install @shader-theme/core
# or
pnpm add @shader-theme/core
```

## Quick Start

```tsx
'use client';

import { MeshGradient } from '@shader-theme/core';

export default function Hero() {
  return (
    <MeshGradient
      color1="#7c3aed"
      color2="#2563eb"
      color3="#06b6d4"
      speed={0.3}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
```

## Components

### `<MeshGradient />`
Flowing multi-color fluid gradient using pre-computed noise textures.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color1` | `string` | `"#7c3aed"` | First gradient color (hex) |
| `color2` | `string` | `"#2563eb"` | Second gradient color (hex) |
| `color3` | `string` | `"#06b6d4"` | Third gradient color (hex) |
| `speed` | `number` | `0.4` | Animation speed |
| `distortion` | `number` | `1.5` | Noise distortion amount |
| `className` | `string` | — | CSS class for container |
| `style` | `CSSProperties` | — | Inline styles |
| `fallback` | `ReactNode` | — | CSS fallback when WebGL unavailable |

### `<NoiseGrain />`
Subtle noise texture overlay for adding visual depth.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `intensity` | `number` | `0.15` | Grain visibility (0-1) |
| `speed` | `number` | `0.5` | Animation speed |
| `scale` | `number` | `2.0` | Grain scale |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |
| `fallback` | `ReactNode` | — | CSS fallback |

### `<GlowOrb />`
Mouse/touch-tracking glow orb effect.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `"#7c3aed"` | Glow color (hex) |
| `intensity` | `number` | `0.8` | Glow strength (0-1) |
| `radius` | `number` | `0.3` | Orb radius |
| `speed` | `number` | `1.0` | Animation speed |
| `trackMouse` | `boolean` | `true` | Follow mouse/touch |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |
| `fallback` | `ReactNode` | — | CSS fallback |

### `<ThemeSection />`
Generic renderer that maps a `SectionConfig` to the appropriate shader component.

```tsx
import { ThemeSection, nebulaTech } from '@shader-theme/core';

<ThemeSection config={nebulaTech.sections.hero} colors={nebulaTech.colors}>
  <h1>Hero Content</h1>
</ThemeSection>
```

### `<FallbackWrapper />`
Error boundary that catches WebGL failures and renders CSS fallback.

### `<ShaderCanvas />`
Low-level canvas component for custom GLSL shaders. Used internally by all shader components.

## Built-in Themes

Three production-ready themes included:

| Theme | Style | Shaders Used |
|-------|-------|--------------|
| `nebula-tech` | Dark sci-fi | MeshGradient + GlowOrb + NoiseGrain |
| `soft-glow` | Light warm brand | MeshGradient + NoiseGrain |
| `minimal-pulse` | Ultra-minimal | GlowOrb only |

```tsx
import { nebulaTech, softGlow, minimalPulse } from '@shader-theme/core';
import { getBuiltInTheme, listBuiltInThemes } from '@shader-theme/core';

const theme = getBuiltInTheme('nebula-tech');
const names = listBuiltInThemes(); // ['nebula-tech', 'soft-glow', 'minimal-pulse']
```

## Performance

- **Auto-monitoring**: FPS tracking with 2-second sliding window
- **Auto-downgrade**: Falls back to CSS when FPS drops below 55
- **Context limiting**: Max 4 WebGL contexts per page with priority-based eviction
- **Device detection**: GPU tier classification (high/medium/low)
- **prefers-reduced-motion**: Respects user accessibility settings

### Bundle Size

| Metric | Value |
|--------|-------|
| Raw TypeScript source | ~54 KB |
| Estimated gzipped | ~15 KB |
| Zero external runtime deps | (only Zod for config validation) |

## Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 80+ | Full WebGL2 |
| Firefox | 80+ | Full WebGL2 |
| Safari | 15+ | WebGL2, 100ms context restore delay |
| Edge | 80+ | Full WebGL2 |
| iOS Safari | 15+ | WebGL2 with simplified shaders |
| Chrome Android | 80+ | Full WebGL2 |

Older browsers automatically receive CSS gradient fallbacks.

## Architecture

```
ShaderCanvas (base)
  ├── WebGL2 context (fallback to WebGL1)
  ├── ResizeObserver + DPR-aware
  ├── Context loss/restore handling
  ├── requestAnimationFrame loop
  └── PerformanceMonitor (auto-downgrade)

ShaderRegistry (global singleton)
  ├── Priority system: HIGH(100) / MEDIUM(50) / LOW(10)
  ├── Max instances limit (default 4)
  ├── IntersectionObserver visibility tracking
  └── LRU eviction for over-limit contexts

NoiseTexture (CPU pre-computed)
  └── 512x512 Simplex noise → GPU texture upload
```

## Next.js Configuration

Add to `next.config.ts`:

```ts
const nextConfig = {
  transpilePackages: ['@shader-theme/core'],
};
```

## License

MIT
