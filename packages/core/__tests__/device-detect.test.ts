import { describe, it, expect } from 'vitest';
import { getRecommendedMaxShaders } from '../src/lib/device-detect';

describe('getRecommendedMaxShaders', () => {
  it('should return 4 for high tier', () => {
    expect(getRecommendedMaxShaders('high')).toBe(4);
  });

  it('should return 3 for medium tier', () => {
    expect(getRecommendedMaxShaders('medium')).toBe(3);
  });

  it('should return 1 for low tier', () => {
    expect(getRecommendedMaxShaders('low')).toBe(1);
  });

  it('should return 0 for none tier', () => {
    expect(getRecommendedMaxShaders('none')).toBe(0);
  });
});

// Note: detectDevice() requires a real browser context with WebGL support.
// It will be tested via Playwright in browser tests.
