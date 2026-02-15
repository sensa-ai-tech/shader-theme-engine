/**
 * device-detect.ts — GPU tier detection for automatic shader degradation
 *
 * Detects the GPU tier based on WebGL debug renderer info and returns
 * a tier level that determines which shader features to enable.
 */

export type GPUTier = 'high' | 'medium' | 'low' | 'none';

export interface DeviceCapabilities {
  tier: GPUTier;
  renderer: string;
  webgl2: boolean;
  maxTextureSize: number;
  prefersReducedMotion: boolean;
}

// Known high-end GPU patterns
const HIGH_PATTERNS = [
  /apple m[1-9]/i,
  /nvidia.*rtx/i,
  /nvidia.*gtx\s*(1[6-9]|[2-9]\d)/i,
  /amd.*radeon.*rx\s*(5[6-9]|6|7)/i,
  /amd.*radeon.*pro/i,
  /apple gpu/i, // Apple Silicon iGPU
];

// Known medium-tier GPU patterns
const MEDIUM_PATTERNS = [
  /intel.*iris/i,
  /intel.*uhd/i,
  /amd.*radeon/i,
  /nvidia.*gtx/i,
  /adreno.*6/i, // Qualcomm Adreno 6xx
  /mali-g7/i,   // ARM Mali G7x
];

// Known low-end GPU patterns
const LOW_PATTERNS = [
  /intel.*hd\s*graphics/i,
  /adreno.*[2-5]/i,
  /mali-[gt][2-5]/i,
  /powervr/i,
  /swiftshader/i, // Software renderer (Chrome fallback)
  /llvmpipe/i,    // Software renderer (Linux)
  /mesa/i,
];

/**
 * Detect GPU capabilities from a WebGL context.
 * Should be called once during app initialization.
 */
export function detectDevice(): DeviceCapabilities {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      tier: 'none',
      renderer: 'server',
      webgl2: false,
      maxTextureSize: 0,
      prefersReducedMotion: false,
    };
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  const canvas = document.createElement('canvas');
  const gl =
    (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ??
    (canvas.getContext('webgl') as WebGLRenderingContext | null);

  if (!gl) {
    return {
      tier: 'none',
      renderer: 'no-webgl',
      webgl2: false,
      maxTextureSize: 0,
      prefersReducedMotion,
    };
  }

  const isWebGL2 = gl instanceof WebGL2RenderingContext;
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;

  // Try to get unmasked renderer info
  let renderer = 'unknown';
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
  }

  // Release the test context
  const loseCtx = gl.getExtension('WEBGL_lose_context');
  if (loseCtx) loseCtx.loseContext();

  const tier = classifyGPU(renderer, maxTextureSize, isWebGL2);

  return {
    tier,
    renderer,
    webgl2: isWebGL2,
    maxTextureSize,
    prefersReducedMotion,
  };
}

function classifyGPU(
  renderer: string,
  maxTextureSize: number,
  isWebGL2: boolean,
): GPUTier {
  // No WebGL2 and small textures → likely very old hardware
  if (!isWebGL2 && maxTextureSize < 4096) return 'low';

  for (const pattern of HIGH_PATTERNS) {
    if (pattern.test(renderer)) return 'high';
  }

  for (const pattern of MEDIUM_PATTERNS) {
    if (pattern.test(renderer)) return 'medium';
  }

  for (const pattern of LOW_PATTERNS) {
    if (pattern.test(renderer)) return 'low';
  }

  // Unknown GPU — assume medium to be safe
  return 'medium';
}

/**
 * Get a recommended max shader count for this device tier.
 */
export function getRecommendedMaxShaders(tier: GPUTier): number {
  switch (tier) {
    case 'high':
      return 4;
    case 'medium':
      return 3;
    case 'low':
      return 1;
    case 'none':
      return 0;
  }
}
