import { describe, it, expect } from 'vitest';
import {
  nebulaTech,
  softGlow,
  minimalPulse,
  builtInThemes,
  getBuiltInTheme,
  listBuiltInThemes,
} from '../src/themes';
import { validateThemeConfig, type ThemeConfig } from '../src/lib/theme-config';

describe('Built-in themes integration', () => {
  const themes: [string, ThemeConfig][] = [
    ['nebula-tech', nebulaTech],
    ['soft-glow', softGlow],
    ['minimal-pulse', minimalPulse],
  ];

  it.each(themes)('%s should be a valid ThemeConfig', (name, theme) => {
    const result = validateThemeConfig(theme);
    expect(result.success).toBe(true);
    expect(theme.name).toBe(name);
  });

  it.each(themes)('%s should have all required color fields', (_, theme) => {
    expect(theme.colors.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(theme.colors.secondary).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(theme.colors.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(theme.colors.background).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(theme.colors.foreground).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it.each(themes)(
    '%s should have at least one section with shader !== none',
    (_, theme) => {
      const shaderSections = Object.values(theme.sections).filter(
        (s) => s.shader !== 'none',
      );
      expect(shaderSections.length).toBeGreaterThan(0);
    },
  );

  it.each(themes)(
    '%s hero section should have high priority',
    (_, theme) => {
      if (theme.sections.hero) {
        expect(theme.sections.hero.priority).toBe('high');
      }
    },
  );

  it.each(themes)(
    '%s should have maxShaderInstances between 1 and 8',
    (_, theme) => {
      expect(theme.performance.maxShaderInstances).toBeGreaterThanOrEqual(1);
      expect(theme.performance.maxShaderInstances).toBeLessThanOrEqual(8);
    },
  );

  it.each(themes)(
    '%s sections with shaders should have valid CSS fallbacks',
    (_, theme) => {
      for (const [, section] of Object.entries(theme.sections)) {
        if (section.shader !== 'none' && section.fallback.type === 'css') {
          expect(section.fallback.value.length).toBeGreaterThan(0);
        }
      }
    },
  );

  describe('builtInThemes registry', () => {
    it('should contain exactly 3 themes', () => {
      expect(Object.keys(builtInThemes)).toHaveLength(3);
    });

    it('should list all theme names', () => {
      const names = listBuiltInThemes();
      expect(names).toContain('nebula-tech');
      expect(names).toContain('soft-glow');
      expect(names).toContain('minimal-pulse');
    });

    it('should return theme by name', () => {
      expect(getBuiltInTheme('nebula-tech')).toBe(nebulaTech);
      expect(getBuiltInTheme('soft-glow')).toBe(softGlow);
      expect(getBuiltInTheme('minimal-pulse')).toBe(minimalPulse);
    });

    it('should return undefined for unknown theme', () => {
      expect(getBuiltInTheme('non-existent')).toBeUndefined();
    });
  });

  describe('Theme differentiation', () => {
    it('nebula-tech should use MeshGradient as hero', () => {
      expect(nebulaTech.sections.hero?.shader).toBe('mesh-gradient');
    });

    it('soft-glow should use MeshGradient as hero with low distortion', () => {
      expect(softGlow.sections.hero?.shader).toBe('mesh-gradient');
      expect(softGlow.sections.hero?.params.distortion).toBeLessThan(1.0);
    });

    it('minimal-pulse should use GlowOrb as hero with low intensity', () => {
      expect(minimalPulse.sections.hero?.shader).toBe('glow-orb');
      expect(minimalPulse.sections.hero?.params.intensity).toBeLessThan(0.5);
    });

    it('each theme should have a distinct background color', () => {
      const bgs = new Set([
        nebulaTech.colors.background,
        softGlow.colors.background,
        minimalPulse.colors.background,
      ]);
      expect(bgs.size).toBe(3);
    });

    it('themes should have different maxShaderInstances', () => {
      // This validates the intentional performance tiering
      expect(nebulaTech.performance.maxShaderInstances).toBe(4);
      expect(softGlow.performance.maxShaderInstances).toBe(3);
      expect(minimalPulse.performance.maxShaderInstances).toBe(2);
    });
  });
});
