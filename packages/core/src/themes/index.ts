import { parseThemeConfig, type ThemeConfig } from '../lib/theme-config';
import nebulaTechJson from './nebula-tech.json';
import softGlowJson from './soft-glow.json';
import minimalPulseJson from './minimal-pulse.json';

/** Pre-validated built-in themes */
export const nebulaTech: ThemeConfig = parseThemeConfig(nebulaTechJson);
export const softGlow: ThemeConfig = parseThemeConfig(softGlowJson);
export const minimalPulse: ThemeConfig = parseThemeConfig(minimalPulseJson);

/** All built-in themes keyed by name */
export const builtInThemes: Record<string, ThemeConfig> = {
  'nebula-tech': nebulaTech,
  'soft-glow': softGlow,
  'minimal-pulse': minimalPulse,
};

/** Get a built-in theme by name, or undefined if not found */
export function getBuiltInTheme(name: string): ThemeConfig | undefined {
  return builtInThemes[name];
}

/** List all available built-in theme names */
export function listBuiltInThemes(): string[] {
  return Object.keys(builtInThemes);
}
