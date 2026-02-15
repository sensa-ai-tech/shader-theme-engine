'use client';

import { type CSSProperties, type ReactNode } from 'react';
import { MeshGradient } from './MeshGradient';
import { NoiseGrain } from './NoiseGrain';
import { GlowOrb } from './GlowOrb';
import type { SectionConfig } from '../lib/theme-config';
import { ShaderPriority } from '../lib/shader-registry';

export interface ThemeSectionProps {
  /** Section configuration from ThemeConfig */
  config: SectionConfig;
  /** CSS class name for the shader container */
  className?: string;
  /** Inline styles for the shader container */
  style?: CSSProperties;
  /** Page content rendered on top of the shader */
  children?: ReactNode;
}

const PRIORITY_MAP: Record<string, number> = {
  high: ShaderPriority.HIGH,
  medium: ShaderPriority.MEDIUM,
  low: ShaderPriority.LOW,
};

function CssFallback({ value, style }: { value: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: value,
        ...style,
      }}
    />
  );
}

function renderShader(config: SectionConfig, style?: CSSProperties) {
  const { shader, params, fallback } = config;
  const shaderStyle: CSSProperties = { width: '100%', height: '100%', ...style };
  const fallbackElement =
    fallback.type === 'css' ? (
      <CssFallback value={fallback.value} />
    ) : undefined;

  switch (shader) {
    case 'mesh-gradient':
      return (
        <MeshGradient
          color1={params.color1 as [number, number, number]}
          color2={params.color2 as [number, number, number]}
          color3={params.color3 as [number, number, number]}
          speed={params.speed as number | undefined}
          distortion={params.distortion as number | undefined}
          seed={params.seed as number | undefined}
          style={shaderStyle}
          fallback={fallbackElement}
        />
      );
    case 'noise-grain':
      return (
        <NoiseGrain
          color={params.color as [number, number, number]}
          density={params.density as number | undefined}
          speed={params.speed as number | undefined}
          opacity={params.opacity as number | undefined}
          style={shaderStyle}
          fallback={fallbackElement}
        />
      );
    case 'glow-orb':
      return (
        <GlowOrb
          glowColor={params.glowColor as [number, number, number]}
          intensity={params.intensity as number | undefined}
          radius={params.radius as number | undefined}
          speed={params.speed as number | undefined}
          trackMouse={params.trackMouse as boolean | undefined}
          style={shaderStyle}
          fallback={fallbackElement}
        />
      );
    case 'none':
      return fallbackElement ?? null;
    default:
      return null;
  }
}

/**
 * Renders a shader based on a ThemeConfig section.
 * Children are layered on top of the shader via z-index.
 */
export function ThemeSection({
  config,
  className,
  style,
  children,
}: ThemeSectionProps) {
  const hasShader = config.shader !== 'none';

  return (
    <section className={className} style={{ position: 'relative', ...style }}>
      {hasShader && (
        <div
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          aria-hidden
        >
          {renderShader(config)}
        </div>
      )}
      {!hasShader && config.fallback.type === 'css' && (
        <CssFallback
          value={config.fallback.value}
          style={{ position: 'absolute', inset: 0 }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </section>
  );
}
