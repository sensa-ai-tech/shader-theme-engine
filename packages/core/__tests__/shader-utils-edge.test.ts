import { describe, it, expect, vi } from 'vitest';
import {
  setUniform,
  disposeResources,
  getUniformLocations,
} from '../src/lib/shader-utils';

describe('shader-utils edge cases', () => {
  describe('setUniform', () => {
    it('should silently skip when location is not found', () => {
      const mockGl = {
        uniform1f: vi.fn(),
        uniform2f: vi.fn(),
        uniform3f: vi.fn(),
        uniform4f: vi.fn(),
        uniform1i: vi.fn(),
      };
      const emptyMap = new Map<string, WebGLUniformLocation>();

      // Should not throw when uniform name is not in map
      expect(() =>
        setUniform(
          mockGl as unknown as WebGLRenderingContext,
          emptyMap,
          'u_nonexistent',
          { type: '1f', value: 1.0 },
        ),
      ).not.toThrow();

      // Should not have called any uniform setter
      expect(mockGl.uniform1f).not.toHaveBeenCalled();
    });

    it('should call correct uniform setter for each type', () => {
      const mockLoc = {} as WebGLUniformLocation;
      const locations = new Map([['u_test', mockLoc]]);
      const mockGl = {
        uniform1f: vi.fn(),
        uniform2f: vi.fn(),
        uniform3f: vi.fn(),
        uniform4f: vi.fn(),
        uniform1i: vi.fn(),
      };
      const gl = mockGl as unknown as WebGLRenderingContext;

      setUniform(gl, locations, 'u_test', { type: '1f', value: 42 });
      expect(mockGl.uniform1f).toHaveBeenCalledWith(mockLoc, 42);

      setUniform(gl, locations, 'u_test', { type: '2f', value: [1, 2] });
      expect(mockGl.uniform2f).toHaveBeenCalledWith(mockLoc, 1, 2);

      setUniform(gl, locations, 'u_test', { type: '3f', value: [1, 2, 3] });
      expect(mockGl.uniform3f).toHaveBeenCalledWith(mockLoc, 1, 2, 3);

      setUniform(gl, locations, 'u_test', { type: '4f', value: [1, 2, 3, 4] });
      expect(mockGl.uniform4f).toHaveBeenCalledWith(mockLoc, 1, 2, 3, 4);

      setUniform(gl, locations, 'u_test', { type: '1i', value: 7 });
      expect(mockGl.uniform1i).toHaveBeenCalledWith(mockLoc, 7);
    });
  });

  describe('disposeResources', () => {
    it('should handle null/undefined resources gracefully', () => {
      const mockGl = {
        deleteProgram: vi.fn(),
        deleteBuffer: vi.fn(),
        deleteTexture: vi.fn(),
      };
      const gl = mockGl as unknown as WebGLRenderingContext;

      // All null — should not throw
      expect(() =>
        disposeResources(gl, { program: null, buffer: null, textures: [] }),
      ).not.toThrow();
      expect(mockGl.deleteProgram).not.toHaveBeenCalled();
      expect(mockGl.deleteBuffer).not.toHaveBeenCalled();
    });

    it('should dispose all provided resources', () => {
      const mockGl = {
        deleteProgram: vi.fn(),
        deleteBuffer: vi.fn(),
        deleteTexture: vi.fn(),
      };
      const gl = mockGl as unknown as WebGLRenderingContext;
      const mockProgram = {} as WebGLProgram;
      const mockBuffer = {} as WebGLBuffer;
      const mockTex1 = {} as WebGLTexture;
      const mockTex2 = {} as WebGLTexture;

      disposeResources(gl, {
        program: mockProgram,
        buffer: mockBuffer,
        textures: [mockTex1, mockTex2, null],
      });

      expect(mockGl.deleteProgram).toHaveBeenCalledWith(mockProgram);
      expect(mockGl.deleteBuffer).toHaveBeenCalledWith(mockBuffer);
      expect(mockGl.deleteTexture).toHaveBeenCalledTimes(2);
    });

    it('should handle empty textures array', () => {
      const mockGl = {
        deleteProgram: vi.fn(),
        deleteBuffer: vi.fn(),
        deleteTexture: vi.fn(),
      };
      const gl = mockGl as unknown as WebGLRenderingContext;

      disposeResources(gl, { textures: [] });
      expect(mockGl.deleteTexture).not.toHaveBeenCalled();
    });
  });

  describe('getUniformLocations', () => {
    it('should skip uniforms that return null', () => {
      const mockGl = {
        getUniformLocation: vi.fn().mockImplementation(
          (_prog: WebGLProgram, name: string) => {
            if (name === 'u_exists') return {} as WebGLUniformLocation;
            return null;
          },
        ),
      };
      const gl = mockGl as unknown as WebGLRenderingContext;
      const program = {} as WebGLProgram;

      const locs = getUniformLocations(gl, program, [
        'u_exists',
        'u_missing',
        'u_also_missing',
      ]);

      expect(locs.size).toBe(1);
      expect(locs.has('u_exists')).toBe(true);
      expect(locs.has('u_missing')).toBe(false);
    });

    it('should handle empty names array', () => {
      const mockGl = { getUniformLocation: vi.fn() };
      const gl = mockGl as unknown as WebGLRenderingContext;
      const program = {} as WebGLProgram;

      const locs = getUniformLocations(gl, program, []);
      expect(locs.size).toBe(0);
      expect(mockGl.getUniformLocation).not.toHaveBeenCalled();
    });
  });
});
