import { describe, it, expect } from 'vitest';
import { hexToVec3, vec3ToGlsl, vec3ToJson } from '../src/utils/color.js';

describe('hexToVec3', () => {
  it('should convert #000000 to [0, 0, 0]', () => {
    expect(hexToVec3('#000000')).toEqual([0, 0, 0]);
  });

  it('should convert #ffffff to [1, 1, 1]', () => {
    expect(hexToVec3('#ffffff')).toEqual([1, 1, 1]);
  });

  it('should convert #5100ff correctly', () => {
    const result = hexToVec3('#5100ff');
    expect(result[0]).toBeCloseTo(0.318, 2);
    expect(result[1]).toBeCloseTo(0.0, 2);
    expect(result[2]).toBeCloseTo(1.0, 2);
  });

  it('should handle hex without # prefix', () => {
    expect(hexToVec3('ff0000')).toEqual([1, 0, 0]);
  });

  it('should throw on invalid hex', () => {
    expect(() => hexToVec3('#fff')).toThrow('Invalid hex color');
    expect(() => hexToVec3('')).toThrow('Invalid hex color');
  });
});

describe('vec3ToGlsl', () => {
  it('should format as GLSL vec3', () => {
    expect(vec3ToGlsl([0.318, 0.0, 1.0])).toBe('vec3(0.318, 0.000, 1.000)');
  });
});

describe('vec3ToJson', () => {
  it('should format as JSON array', () => {
    expect(vec3ToJson([0.318, 0.0, 1.0])).toBe('[0.318, 0, 1]');
  });
});
