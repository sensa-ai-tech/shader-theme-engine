/**
 * shader-utils.ts — Zero-dependency WebGL2 shader utilities
 *
 * Handles context creation, shader compilation, program linking,
 * uniform management, and animation loop.
 */

export type UniformValue =
  | { type: '1f'; value: number }
  | { type: '2f'; value: [number, number] }
  | { type: '3f'; value: [number, number, number] }
  | { type: '4f'; value: [number, number, number, number] }
  | { type: '1i'; value: number };

export interface ShaderProgramInfo {
  program: WebGLProgram;
  uniformLocations: Map<string, WebGLUniformLocation>;
}

export interface WebGLContextResult {
  gl: WebGL2RenderingContext | WebGLRenderingContext;
  isWebGL2: boolean;
}

/** Default fullscreen quad vertex shader */
export const DEFAULT_VERTEX_SHADER = `#version 300 es
precision highp float;
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

/** WebGL1 fallback vertex shader */
export const DEFAULT_VERTEX_SHADER_V1 = `
precision highp float;
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

/**
 * Create a WebGL2 context, falling back to WebGL1 if unavailable.
 * Uses conservative context options to minimise memory footprint.
 */
export function createWebGLContext(
  canvas: HTMLCanvasElement,
): WebGLContextResult | null {
  const opts: WebGLContextAttributes = {
    antialias: false,
    depth: false,
    stencil: false,
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
  };

  const gl2 = canvas.getContext('webgl2', opts) as WebGL2RenderingContext | null;
  if (gl2) return { gl: gl2, isWebGL2: true };

  const gl1 = canvas.getContext('webgl', opts) as WebGLRenderingContext | null;
  if (gl1) return { gl: gl1, isWebGL2: false };

  return null;
}

/**
 * Compile a single shader (vertex or fragment).
 * Returns the compiled shader or throws with a descriptive error.
 */
export function compileShader(
  gl: WebGL2RenderingContext | WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error(`[ShaderUtils] Failed to create shader of type ${type}`);
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? 'unknown error';
    gl.deleteShader(shader);
    throw new Error(`[ShaderUtils] Shader compile error:\n${log}`);
  }

  return shader;
}

/**
 * Link a vertex + fragment shader into a program.
 * Sets up the fullscreen quad position attribute.
 */
export function createProgram(
  gl: WebGL2RenderingContext | WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    throw new Error('[ShaderUtils] Failed to create program');
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? 'unknown error';
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    throw new Error(`[ShaderUtils] Program link error:\n${log}`);
  }

  // Shaders are linked — we can detach and delete the individual shaders
  gl.detachShader(program, vs);
  gl.detachShader(program, fs);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  return program;
}

/**
 * Create the fullscreen quad geometry buffer (two triangles covering [-1,1]).
 */
export function createFullscreenQuad(
  gl: WebGL2RenderingContext | WebGLRenderingContext,
  program: WebGLProgram,
): WebGLBuffer {
  const positions = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1,
  ]);

  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error('[ShaderUtils] Failed to create buffer');
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(program, 'a_position');
  if (posLoc >= 0) {
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  }

  return buffer;
}

/**
 * Cache and resolve uniform locations for a program.
 */
export function getUniformLocations(
  gl: WebGL2RenderingContext | WebGLRenderingContext,
  program: WebGLProgram,
  names: string[],
): Map<string, WebGLUniformLocation> {
  const map = new Map<string, WebGLUniformLocation>();
  for (const name of names) {
    const loc = gl.getUniformLocation(program, name);
    if (loc !== null) {
      map.set(name, loc);
    }
  }
  return map;
}

/**
 * Set a uniform value by name using the cached location map.
 */
export function setUniform(
  gl: WebGL2RenderingContext | WebGLRenderingContext,
  locations: Map<string, WebGLUniformLocation>,
  name: string,
  value: UniformValue,
): void {
  const loc = locations.get(name);
  if (!loc) return;

  switch (value.type) {
    case '1f':
      gl.uniform1f(loc, value.value);
      break;
    case '2f':
      gl.uniform2f(loc, value.value[0], value.value[1]);
      break;
    case '3f':
      gl.uniform3f(loc, value.value[0], value.value[1], value.value[2]);
      break;
    case '4f':
      gl.uniform4f(
        loc,
        value.value[0],
        value.value[1],
        value.value[2],
        value.value[3],
      );
      break;
    case '1i':
      gl.uniform1i(loc, value.value);
      break;
  }
}

/**
 * Upload a Uint8Array as a 2D RGBA texture.
 * Useful for pre-computed noise textures.
 */
export function createTexture(
  gl: WebGL2RenderingContext | WebGLRenderingContext,
  width: number,
  height: number,
  data: Uint8Array,
): WebGLTexture {
  const texture = gl.createTexture();
  if (!texture) {
    throw new Error('[ShaderUtils] Failed to create texture');
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    data,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return texture;
}

/**
 * Dispose all WebGL resources for a shader instance.
 */
export function disposeResources(
  gl: WebGL2RenderingContext | WebGLRenderingContext,
  resources: {
    program?: WebGLProgram | null;
    buffer?: WebGLBuffer | null;
    textures?: (WebGLTexture | null)[];
  },
): void {
  if (resources.program) gl.deleteProgram(resources.program);
  if (resources.buffer) gl.deleteBuffer(resources.buffer);
  if (resources.textures) {
    for (const tex of resources.textures) {
      if (tex) gl.deleteTexture(tex);
    }
  }
}
