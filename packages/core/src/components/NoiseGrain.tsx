'use client';

import { useCallback, type CSSProperties, type ReactNode } from 'react';
import { ShaderCanvas, type ShaderFrameContext } from './ShaderCanvas';

const FRAG_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_density;
uniform float u_speed;
uniform vec3 u_color;
uniform float u_opacity;

out vec4 fragColor;

float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float timeOffset = floor(u_time * u_speed * 10.0);
    float grain = hash(gl_FragCoord.xy + timeOffset);
    grain = step(1.0 - u_density, grain);
    vec3 color = u_color;
    float alpha = grain * u_opacity;
    fragColor = vec4(color, alpha);
}`;

export interface NoiseGrainProps {
  /** Grain color as [r, g, b] floats in 0-1 range */
  color?: [number, number, number];
  /** Grain density 0-1 (default: 0.05) */
  density?: number;
  /** Animation speed (default: 0 = static, >0 = animated grain) */
  speed?: number;
  /** Overlay opacity (default: 0.15) */
  opacity?: number;
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Fallback content */
  fallback?: ReactNode;
}

export function NoiseGrain({
  color = [1.0, 1.0, 1.0],
  density = 0.05,
  speed = 0,
  opacity = 0.15,
  className,
  style,
  fallback,
}: NoiseGrainProps) {
  const handleFrame = useCallback(
    (ctx: ShaderFrameContext) => {
      ctx.setUniform('u_color', { type: '3f', value: color });
      ctx.setUniform('u_density', { type: '1f', value: density });
      ctx.setUniform('u_speed', { type: '1f', value: speed });
      ctx.setUniform('u_opacity', { type: '1f', value: opacity });
    },
    [color, density, speed, opacity],
  );

  return (
    <ShaderCanvas
      fragmentShader={FRAG_SHADER}
      uniformNames={['u_color', 'u_density', 'u_speed', 'u_opacity']}
      onFrame={handleFrame}
      className={className}
      style={style}
      speed={speed}
      fallback={fallback}
    />
  );
}
