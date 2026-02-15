import { describe, it, expect } from 'vitest';
import {
  parseThemeConfig,
  validateThemeConfig,
  themeConfigSchema,
} from '../src/lib/theme-config';
import type { ThemeConfig } from '../src/lib/theme-config';

const VALID_THEME: ThemeConfig = {
  name: 'test-theme',
  version: '1.0.0',
  description: 'A test theme',
  colors: {
    primary: '#5100ff',
    secondary: '#00ff80',
    accent: '#ffcc00',
    background: '#000000',
    foreground: '#ffffff',
  },
  performance: {
    maxShaderInstances: 4,
    mobileStrategy: 'simplify',
  },
  sections: {
    hero: {
      shader: 'mesh-gradient',
      priority: 'high',
      params: {
        color1: [0.318, 0.0, 1.0],
        color2: [0.0, 1.0, 0.502],
        color3: [1.0, 0.8, 0.0],
        speed: 1.0,
        distortion: 1.2,
      },
      fallback: {
        type: 'css',
        value: 'linear-gradient(135deg, #5100ff, #00ff80)',
      },
    },
    features: {
      shader: 'glow-orb',
      priority: 'medium',
      params: {
        glowColor: [0.318, 0.0, 1.0],
        intensity: 0.4,
        radius: 400,
        speed: 0.3,
      },
      fallback: { type: 'none' },
    },
    footer: {
      shader: 'none',
      priority: 'low',
      params: {},
      fallback: { type: 'none' },
    },
  },
};

describe('themeConfigSchema', () => {
  it('should validate a correct theme config', () => {
    const result = themeConfigSchema.safeParse(VALID_THEME);
    expect(result.success).toBe(true);
  });

  it('should reject config with missing name', () => {
    const { name, ...noName } = VALID_THEME;
    const result = themeConfigSchema.safeParse(noName);
    expect(result.success).toBe(false);
  });

  it('should reject config with invalid shader type', () => {
    const invalid = structuredClone(VALID_THEME);
    (invalid.sections.hero as Record<string, unknown>).shader = 'invalid-shader';
    const result = themeConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject config with invalid priority', () => {
    const invalid = structuredClone(VALID_THEME);
    (invalid.sections.hero as Record<string, unknown>).priority = 'critical';
    const result = themeConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject maxShaderInstances > 8', () => {
    const invalid = structuredClone(VALID_THEME);
    invalid.performance.maxShaderInstances = 10;
    const result = themeConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should apply defaults for version and description', () => {
    const minimal = {
      name: 'minimal',
      colors: VALID_THEME.colors,
      performance: { maxShaderInstances: 2 },
      sections: {},
    };
    const result = themeConfigSchema.parse(minimal);
    expect(result.version).toBe('1.0.0');
    expect(result.description).toBe('');
    expect(result.performance.mobileStrategy).toBe('simplify');
  });
});

describe('parseThemeConfig', () => {
  it('should return parsed theme for valid input', () => {
    const parsed = parseThemeConfig(VALID_THEME);
    expect(parsed.name).toBe('test-theme');
    expect(parsed.sections.hero.shader).toBe('mesh-gradient');
  });

  it('should throw ZodError for invalid input', () => {
    expect(() => parseThemeConfig({})).toThrow();
  });
});

describe('validateThemeConfig', () => {
  it('should return success for valid config', () => {
    const result = validateThemeConfig(VALID_THEME);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('test-theme');
    }
  });

  it('should return errors for invalid config', () => {
    const result = validateThemeConfig({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it('should report specific field paths in errors', () => {
    const result = validateThemeConfig({
      name: 'x',
      colors: { primary: '#fff' }, // missing other fields
      performance: {},
      sections: {},
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const hasColorPath = result.errors.some((e) => e.startsWith('colors.'));
      expect(hasColorPath).toBe(true);
    }
  });
});
