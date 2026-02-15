'use client';

import { useCallback, useRef, type CSSProperties, type ReactNode } from 'react';
import { ShaderCanvas, type ShaderFrameContext, type ShaderInitContext } from './ShaderCanvas';
import { generateNoiseTexture } from '../lib/noise-texture';
import { createTexture } from '../lib/shader-utils';

// Inline the GLSL as a string — bundlers will handle this at build time.
// In production, CLI templates pre-bake this; for the engine, we inline it.
const FRAG_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_speed;
uniform float u_distortion;
uniform sampler2D u_noise;

out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 scroll1 = uv + vec2(u_time * u_speed * 0.1, u_time * u_speed * 0.07);
    vec2 scroll2 = uv + vec2(-u_time * u_speed * 0.08, u_time * u_speed * 0.12);
    vec3 noise1 = texture(u_noise, scroll1 * 0.8).rgb;
    vec3 noise2 = texture(u_noise, scroll2 * 1.2).rgb;
    float distort = (noise1.r + noise2.g - 1.0) * u_distortion;
    vec2 distortedUV = uv + vec2(distort * 0.15, distort * 0.1);
    float blend1 = noise1.r * 0.5 + noise2.r * 0.5;
    float blend2 = noise1.g * 0.4 + noise2.b * 0.6;
    vec3 color = mix(u_color1, u_color2, smoothstep(0.2, 0.8, blend1 + distortedUV.x * 0.3));
    color = mix(color, u_color3, smoothstep(0.3, 0.7, blend2 + distortedUV.y * 0.2));
    float vignette = 1.0 - distance(uv, vec2(0.5)) * 0.4;
    color *= vignette;
    fragColor = vec4(color, 1.0);
}`;

export interface MeshGradientProps {
  /** Primary color as [r, g, b] floats in 0-1 range */
  color1?: [number, number, number];
  /** Secondary color as [r, g, b] floats in 0-1 range */
  color2?: [number, number, number];
  /** Accent color as [r, g, b] floats in 0-1 range */
  color3?: [number, number, number];
  /** Animation speed multiplier (default: 1.0) */
  speed?: number;
  /** Distortion intensity (default: 1.2) */
  distortion?: number;
  /** Noise texture seed (default: 0) */
  seed?: number;
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Fallback content */
  fallback?: ReactNode;
}

/** Hex string to [r, g, b] floats in 0-1 */
export function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
  ];
}

export function MeshGradient({
  color1 = [0.318, 0.0, 1.0],    // #5100ff
  color2 = [0.0, 1.0, 0.502],     // #00ff80
  color3 = [1.0, 0.8, 0.0],       // #ffcc00
  speed = 1.0,
  distortion = 1.2,
  seed = 0,
  className,
  style,
  fallback,
}: MeshGradientProps) {
  const textureRef = useRef<WebGLTexture | null>(null);

  const handleInit = useCallback(
    (ctx: ShaderInitContext) => {
      const { gl, uniformLocations } = ctx;

      // Generate and upload noise texture
      const noise = generateNoiseTexture({
        width: 512,
        height: 512,
        scale: 4.0,
        octaves: 4,
        seed,
      });
      const tex = createTexture(gl, noise.width, noise.height, noise.data);
      textureRef.current = tex;

      // Bind texture to unit 0
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      const noiseLoc = uniformLocations.get('u_noise');
      if (noiseLoc) gl.uniform1i(noiseLoc, 0);
    },
    [seed],
  );

  const handleFrame = useCallback(
    (ctx: ShaderFrameContext) => {
      ctx.setUniform('u_color1', { type: '3f', value: color1 });
      ctx.setUniform('u_color2', { type: '3f', value: color2 });
      ctx.setUniform('u_color3', { type: '3f', value: color3 });
      ctx.setUniform('u_speed', { type: '1f', value: speed });
      ctx.setUniform('u_distortion', { type: '1f', value: distortion });
    },
    [color1, color2, color3, speed, distortion],
  );

  return (
    <ShaderCanvas
      fragmentShader={FRAG_SHADER}
      uniformNames={[
        'u_color1',
        'u_color2',
        'u_color3',
        'u_speed',
        'u_distortion',
        'u_noise',
      ]}
      onInit={handleInit}
      onFrame={handleFrame}
      className={className}
      style={style}
      speed={speed}
      fallback={
        fallback ?? (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, rgb(${color1.map(c => Math.round(c * 255)).join(',')}), rgb(${color2.map(c => Math.round(c * 255)).join(',')}), rgb(${color3.map(c => Math.round(c * 255)).join(',')}))`,
            }}
          />
        )
      }
    />
  );
}
