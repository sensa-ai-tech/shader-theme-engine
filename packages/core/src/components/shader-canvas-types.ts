import type { CSSProperties, ReactNode } from 'react';
import type { UniformValue } from '../lib/shader-utils';

export interface ShaderCanvasProps {
  /** Fragment shader GLSL source */
  fragmentShader: string;
  /** Custom vertex shader (optional, uses fullscreen quad default) */
  vertexShader?: string;
  /** Uniform names to resolve locations for */
  uniformNames?: string[];
  /** Called each frame to set uniform values before draw */
  onFrame?: (ctx: ShaderFrameContext) => void;
  /** Called once after WebGL init succeeds, useful for uploading textures */
  onInit?: (ctx: ShaderInitContext) => void;
  /** CSS fallback content shown when WebGL is unavailable or performance is too low */
  fallback?: ReactNode;
  /** CSS class name for the container div */
  className?: string;
  /** Inline styles for the container div */
  style?: CSSProperties;
  /** Animation speed multiplier (default: 1.0, set 0 to pause) */
  speed?: number;
  /** Priority for ShaderRegistry (higher = less likely to be evicted) */
  priority?: number;
}

export interface ShaderFrameContext {
  gl: WebGL2RenderingContext | WebGLRenderingContext;
  program: WebGLProgram;
  uniformLocations: Map<string, WebGLUniformLocation>;
  time: number;
  deltaTime: number;
  resolution: [number, number];
  setUniform: (name: string, value: UniformValue) => void;
}

export interface ShaderInitContext {
  gl: WebGL2RenderingContext | WebGLRenderingContext;
  program: WebGLProgram;
  uniformLocations: Map<string, WebGLUniformLocation>;
  isWebGL2: boolean;
}

export interface ShaderResources {
  gl: WebGL2RenderingContext | WebGLRenderingContext;
  program: WebGLProgram;
  buffer: WebGLBuffer;
  uniformLocations: Map<string, WebGLUniformLocation>;
  isWebGL2: boolean;
}
