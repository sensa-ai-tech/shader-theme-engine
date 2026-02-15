import type { ShaderType, SectionConfig, Vec3 } from './editor-types';

/**
 * Convert a Vec3 (0-1 float RGB) to hex string.
 * Inverse of hexToVec3 from @shader-theme/core.
 */
export function vec3ToHex(v: Vec3): string {
  return (
    '#' +
    v
      .map((c) =>
        Math.round(Math.max(0, Math.min(1, c)) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

/**
 * Deep clone a plain JSON-compatible object.
 * Faster than structuredClone for small objects.
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/** Default shader params by shader type. */
export function defaultParamsForShader(
  shader: ShaderType,
): Record<string, number | boolean | number[]> {
  switch (shader) {
    case 'mesh-gradient':
      return {
        color1: [0.318, 0.0, 1.0],
        color2: [0.0, 1.0, 0.502],
        color3: [1.0, 0.8, 0.0],
        speed: 1.0,
        distortion: 1.2,
        seed: 0,
      };
    case 'noise-grain':
      return {
        color: [1.0, 1.0, 1.0],
        density: 0.05,
        speed: 0,
        opacity: 0.15,
      };
    case 'glow-orb':
      return {
        glowColor: [0.318, 0.0, 1.0],
        intensity: 0.8,
        radius: 300,
        speed: 0.5,
        trackMouse: true,
      };
    case 'none':
      return {};
  }
}

/** Create a default SectionConfig for a given shader type. */
export function defaultSectionConfig(shader: ShaderType = 'none'): SectionConfig {
  return {
    shader,
    priority: 'medium',
    params: defaultParamsForShader(shader),
    fallback: { type: 'none' },
  };
}
