# Shader Effects Source Registry

All shader effects in this project must have clear provenance. This document tracks the origin, inspiration, and licensing of each shader effect.

## Source Categories

- **Original**: Written from scratch using standard mathematical functions
- **Paper-based**: Implemented from published academic papers (with citation)
- **MIT-derived**: Adapted from MIT-licensed open source (with attribution)

## Effects Registry

| Effect | Source | License | Notes |
|--------|--------|---------|-------|
| MeshGradient | Original | MIT | Simplex noise via texture lookup, multi-color blending |
| NoiseGrain | Original | MIT | Standard noise overlay technique, common in graphics |
| GlowOrb | Original | MIT | Radial gradient with mouse/touch tracking |

## Mathematical References

- Simplex Noise: Based on Ken Perlin's 2001 paper "Noise Hardware" (public domain algorithm)
- Perlin Noise: Original 1985 publication by Ken Perlin (public domain algorithm)

## Implementation Details

| Effect | GLSL File | Technique | Performance Notes |
|--------|-----------|-----------|-------------------|
| MeshGradient | `mesh-gradient.frag` | Pre-computed 512x512 noise texture + scrolling UV + 3-color blend | ~60 FPS on iPhone SE via texture lookup (vs ~30 FPS for realtime Simplex) |
| NoiseGrain | `noise-grain.frag` | Hash-based pseudo-random noise overlay | Minimal GPU cost, no texture required |
| GlowOrb | `glow-orb.frag` | SDF circle + smoothstep falloff + mouse uniform | Tracks pointer position via uniform injection |

## Noise Texture Generation

The `noise-texture.ts` module generates a Simplex noise texture on the CPU side:
- Algorithm: Simplex noise (Ken Perlin, 2001)
- Resolution: 512x512 by default (configurable)
- Octaves: 4 (configurable) for fractal detail
- Output: RGBA texture uploaded to GPU via `texImage2D`
- This avoids per-fragment noise computation, critical for mobile performance

## Excluded Sources

The following sources are NOT used due to licensing restrictions:
- Paper Shaders (paper-design/shaders): License prohibits competitive use
- Shadertoy contributions with CC BY-NC licenses
- Any shader code with GPL, CC BY-NC, or proprietary licenses
