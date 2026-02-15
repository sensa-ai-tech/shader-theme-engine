import { describe, it, expect } from 'vitest';
import { generateNoiseTexture } from '../src/lib/noise-texture';

describe('generateNoiseTexture', () => {
  it('should generate texture with correct dimensions', () => {
    const result = generateNoiseTexture({ width: 64, height: 64 });
    expect(result.width).toBe(64);
    expect(result.height).toBe(64);
    expect(result.data.length).toBe(64 * 64 * 4);
  });

  it('should generate RGBA data with alpha = 255', () => {
    const result = generateNoiseTexture({ width: 16, height: 16 });
    for (let i = 0; i < result.data.length; i += 4) {
      expect(result.data[i + 3]).toBe(255);
    }
  });

  it('should generate values in 0-255 range', () => {
    const result = generateNoiseTexture({ width: 32, height: 32 });
    for (let i = 0; i < result.data.length; i++) {
      expect(result.data[i]).toBeGreaterThanOrEqual(0);
      expect(result.data[i]).toBeLessThanOrEqual(255);
    }
  });

  it('should produce different results with different seeds', () => {
    const r1 = generateNoiseTexture({ width: 16, height: 16, seed: 0 });
    const r2 = generateNoiseTexture({ width: 16, height: 16, seed: 42 });

    let different = false;
    for (let i = 0; i < r1.data.length; i++) {
      if (r1.data[i] !== r2.data[i]) {
        different = true;
        break;
      }
    }
    expect(different).toBe(true);
  });

  it('should produce same results with same seed', () => {
    const r1 = generateNoiseTexture({ width: 16, height: 16, seed: 7 });
    const r2 = generateNoiseTexture({ width: 16, height: 16, seed: 7 });

    let same = true;
    for (let i = 0; i < r1.data.length; i++) {
      if (r1.data[i] !== r2.data[i]) {
        same = false;
        break;
      }
    }
    expect(same).toBe(true);
  });

  it('should respect custom scale and octaves', () => {
    // Different parameters should produce different textures
    const r1 = generateNoiseTexture({ width: 16, height: 16, scale: 2.0, octaves: 1 });
    const r2 = generateNoiseTexture({ width: 16, height: 16, scale: 8.0, octaves: 6 });

    let different = false;
    for (let i = 0; i < r1.data.length; i++) {
      if (r1.data[i] !== r2.data[i]) {
        different = true;
        break;
      }
    }
    expect(different).toBe(true);
  });

  it('should use default values when no options provided', () => {
    const result = generateNoiseTexture();
    expect(result.width).toBe(512);
    expect(result.height).toBe(512);
    expect(result.data.length).toBe(512 * 512 * 4);
  });
});
