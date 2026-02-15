import { z } from 'zod';

// ─── Zod Schemas ────────────────────────────────────────────────────

const vec3Schema = z.tuple([z.number(), z.number(), z.number()]);

const shaderTypeSchema = z.enum([
  'mesh-gradient',
  'noise-grain',
  'glow-orb',
  'none',
]);

const prioritySchema = z.enum(['high', 'medium', 'low']);

const mobileStrategySchema = z.enum(['simplify', 'css-only', 'disable']);

const cssFallbackSchema = z.object({
  type: z.literal('css'),
  value: z.string(),
});

const noneFallbackSchema = z.object({
  type: z.literal('none'),
});

const fallbackSchema = z.discriminatedUnion('type', [
  cssFallbackSchema,
  noneFallbackSchema,
]);

/** Params common to MeshGradient */
const meshGradientParamsSchema = z.object({
  color1: vec3Schema,
  color2: vec3Schema,
  color3: vec3Schema,
  speed: z.number().min(0).default(1.0),
  distortion: z.number().min(0).default(1.2),
  seed: z.number().int().default(0),
});

/** Params common to NoiseGrain */
const noiseGrainParamsSchema = z.object({
  color: vec3Schema,
  density: z.number().min(0).max(1).default(0.05),
  speed: z.number().min(0).default(0),
  opacity: z.number().min(0).max(1).default(0.15),
});

/** Params common to GlowOrb */
const glowOrbParamsSchema = z.object({
  glowColor: vec3Schema,
  intensity: z.number().min(0).default(0.8),
  radius: z.number().min(0).default(300),
  speed: z.number().min(0).default(0.5),
  trackMouse: z.boolean().default(true),
});

const sectionConfigSchema = z.object({
  shader: shaderTypeSchema,
  priority: prioritySchema,
  params: z.record(z.union([z.number(), z.string(), z.boolean(), z.array(z.number())])),
  fallback: fallbackSchema,
});

const colorsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  foreground: z.string(),
});

const performanceSchema = z.object({
  maxShaderInstances: z.number().int().min(0).max(8).default(4),
  mobileStrategy: mobileStrategySchema.default('simplify'),
});

export const themeConfigSchema = z.object({
  name: z.string().min(1),
  version: z.string().default('1.0.0'),
  description: z.string().default(''),
  colors: colorsSchema,
  performance: performanceSchema,
  sections: z.record(sectionConfigSchema),
});

// ─── TypeScript Types (derived from Zod) ────────────────────────────

export type Vec3 = z.infer<typeof vec3Schema>;
export type ShaderType = z.infer<typeof shaderTypeSchema>;
export type Priority = z.infer<typeof prioritySchema>;
export type MobileStrategy = z.infer<typeof mobileStrategySchema>;
export type SectionFallback = z.infer<typeof fallbackSchema>;
export type SectionConfig = z.infer<typeof sectionConfigSchema>;
export type ThemeColors = z.infer<typeof colorsSchema>;
export type ThemePerformance = z.infer<typeof performanceSchema>;
export type ThemeConfig = z.infer<typeof themeConfigSchema>;

/** Typed shader params for each shader type */
export type MeshGradientParams = z.infer<typeof meshGradientParamsSchema>;
export type NoiseGrainParams = z.infer<typeof noiseGrainParamsSchema>;
export type GlowOrbParams = z.infer<typeof glowOrbParamsSchema>;

// ─── Validation Helper ──────────────────────────────────────────────

export function parseThemeConfig(data: unknown): ThemeConfig {
  return themeConfigSchema.parse(data);
}

export function validateThemeConfig(
  data: unknown,
): { success: true; data: ThemeConfig } | { success: false; errors: string[] } {
  const result = themeConfigSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`,
    ),
  };
}

// ─── Sub-schemas (for CLI param validation) ─────────────────────────

export {
  meshGradientParamsSchema,
  noiseGrainParamsSchema,
  glowOrbParamsSchema,
  sectionConfigSchema,
  vec3Schema,
};
