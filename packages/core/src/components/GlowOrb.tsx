'use client';

import { useCallback, useRef, useEffect, type CSSProperties, type ReactNode } from 'react';
import { ShaderCanvas, type ShaderFrameContext } from './ShaderCanvas';

const FRAG_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_glowColor;
uniform float u_intensity;
uniform float u_radius;
uniform float u_speed;

out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 mouse = u_mouse / u_resolution;
    if (u_mouse.x <= 0.0 && u_mouse.y <= 0.0) {
        mouse = vec2(0.5);
    }
    float drift = u_time * u_speed;
    vec2 orbCenter = mouse + vec2(sin(drift * 0.7) * 0.02, cos(drift * 0.9) * 0.02);
    float dist = distance(uv * aspect, orbCenter * aspect);
    float normalizedRadius = u_radius / u_resolution.x;
    float glow = exp(-dist * dist / (normalizedRadius * normalizedRadius * 2.0));
    glow *= u_intensity;
    vec3 color = u_glowColor * glow;
    float alpha = glow;
    fragColor = vec4(color, alpha);
}`;

export interface GlowOrbProps {
  /** Glow color as [r, g, b] floats in 0-1 range */
  glowColor?: [number, number, number];
  /** Glow intensity (default: 0.8) */
  intensity?: number;
  /** Glow radius in pixels (default: 300) */
  radius?: number;
  /** Animation speed (default: 0.5) */
  speed?: number;
  /** Whether to track mouse/touch (default: true) */
  trackMouse?: boolean;
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Fallback content */
  fallback?: ReactNode;
}

export function GlowOrb({
  glowColor = [0.318, 0.0, 1.0],  // #5100ff
  intensity = 0.8,
  radius = 300,
  speed = 0.5,
  trackMouse = true,
  className,
  style,
  fallback,
}: GlowOrbProps) {
  const mouseRef = useRef<[number, number]>([0, 0]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!trackMouse) return;

    const handleMove = (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      mouseRef.current = [
        (clientX - rect.left) * dpr,
        (rect.height - (clientY - rect.top)) * dpr, // Flip Y for WebGL
      ];
    };

    const handleMouse = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchmove', handleTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, [trackMouse]);

  const handleFrame = useCallback(
    (ctx: ShaderFrameContext) => {
      ctx.setUniform('u_glowColor', { type: '3f', value: glowColor });
      ctx.setUniform('u_intensity', { type: '1f', value: intensity });
      ctx.setUniform('u_radius', { type: '1f', value: radius });
      ctx.setUniform('u_speed', { type: '1f', value: speed });
      ctx.setUniform('u_mouse', { type: '2f', value: mouseRef.current });
    },
    [glowColor, intensity, radius, speed],
  );

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ShaderCanvas
        fragmentShader={FRAG_SHADER}
        uniformNames={['u_glowColor', 'u_intensity', 'u_radius', 'u_speed', 'u_mouse']}
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
                background: `radial-gradient(circle at 50% 50%, rgba(${glowColor.map(c => Math.round(c * 255)).join(',')}, ${intensity}), transparent 70%)`,
              }}
            />
          )
        }
      />
    </div>
  );
}
