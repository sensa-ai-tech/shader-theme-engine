// Components
export { ShaderCanvas } from './components/ShaderCanvas';
export type {
  ShaderCanvasProps,
  ShaderFrameContext,
  ShaderInitContext,
} from './components/ShaderCanvas';
export { FallbackWrapper } from './components/FallbackWrapper';
export type { FallbackWrapperProps } from './components/FallbackWrapper';
export { MeshGradient, hexToVec3 } from './components/MeshGradient';
export type { MeshGradientProps } from './components/MeshGradient';
export { NoiseGrain } from './components/NoiseGrain';
export type { NoiseGrainProps } from './components/NoiseGrain';
export { GlowOrb } from './components/GlowOrb';
export type { GlowOrbProps } from './components/GlowOrb';
export { ThemeSection } from './components/ThemeSection';
export type { ThemeSectionProps } from './components/ThemeSection';

// Lib — shader utils
export {
  createWebGLContext,
  compileShader,
  createProgram,
  createFullscreenQuad,
  getUniformLocations,
  setUniform,
  createTexture,
  disposeResources,
  DEFAULT_VERTEX_SHADER,
  DEFAULT_VERTEX_SHADER_V1,
} from './lib/shader-utils';
export type { UniformValue, ShaderProgramInfo, WebGLContextResult } from './lib/shader-utils';

// Lib — performance monitor
export { PerformanceMonitor, DOWNGRADE_EVENT } from './lib/performance-monitor';
export type { PerformanceMonitorOptions } from './lib/performance-monitor';

// Lib — shader registry
export {
  getShaderRegistry,
  resetShaderRegistry,
  ShaderPriority,
} from './lib/shader-registry';
export type { ShaderInstance, ShaderRegistryImpl } from './lib/shader-registry';

// Lib — noise texture
export { generateNoiseTexture } from './lib/noise-texture';
export type { NoiseTextureOptions, NoiseTextureResult } from './lib/noise-texture';

// Lib — device detect
export { detectDevice, getRecommendedMaxShaders } from './lib/device-detect';
export type { GPUTier, DeviceCapabilities } from './lib/device-detect';

// Lib — theme config
export {
  themeConfigSchema,
  parseThemeConfig,
  validateThemeConfig,
  meshGradientParamsSchema,
  noiseGrainParamsSchema,
  glowOrbParamsSchema,
  sectionConfigSchema,
  vec3Schema,
} from './lib/theme-config';
export type {
  Vec3,
  ShaderType,
  Priority,
  MobileStrategy,
  SectionFallback,
  SectionConfig,
  ThemeColors,
  ThemePerformance,
  ThemeConfig,
  MeshGradientParams,
  NoiseGrainParams,
  GlowOrbParams,
} from './lib/theme-config';

// Themes — built-in presets
export {
  nebulaTech,
  softGlow,
  minimalPulse,
  builtInThemes,
  getBuiltInTheme,
  listBuiltInThemes,
} from './themes';
