import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { generateThemeFiles, generateSetupGuide } from '../src/generators/theme';
import type { ProjectInfo } from '../src/resolvers/project-detect';

const TMP = join(__dirname, '__tmp_gen_test__');

function makeProjectInfo(overrides: Partial<ProjectInfo> = {}): ProjectInfo {
  return {
    isNextProject: true,
    router: 'app',
    hasSrcDir: true,
    isTypeScript: true,
    tailwindVersion: 4,
    hasShaderTheme: false,
    rootDir: TMP,
    ...overrides,
  };
}

beforeEach(() => {
  // Create minimal project structure
  mkdirSync(join(TMP, 'src', 'app'), { recursive: true });
  writeFileSync(join(TMP, 'package.json'), JSON.stringify({ name: 'test', dependencies: { next: '16.0.0' } }));
});

afterEach(() => {
  rmSync(TMP, { recursive: true, force: true });
});

describe('generateThemeFiles', () => {
  it('should create page.tsx in src/app/ for src-dir projects', () => {
    const results = generateThemeFiles({
      themeName: 'nebula-tech',
      projectInfo: makeProjectInfo({ hasSrcDir: true }),
    });
    const pageResult = results.find((r) => r.path.endsWith('page.tsx'));
    expect(pageResult).toBeDefined();
    expect(pageResult!.path).toContain(join('src', 'app'));
    expect(existsSync(pageResult!.path)).toBe(true);
  });

  it('should create page.tsx in app/ for non-src-dir projects', () => {
    mkdirSync(join(TMP, 'app'), { recursive: true });
    const results = generateThemeFiles({
      themeName: 'soft-glow',
      projectInfo: makeProjectInfo({ hasSrcDir: false }),
    });
    const pageResult = results.find((r) => r.path.endsWith('page.tsx'));
    expect(pageResult).toBeDefined();
    expect(pageResult!.path).toContain(join(TMP, 'app'));
  });

  it('should rename existing page.tsx instead of overwriting', () => {
    // Create an existing page
    const existingPage = join(TMP, 'src', 'app', 'page.tsx');
    writeFileSync(existingPage, 'existing content');

    const results = generateThemeFiles({
      themeName: 'minimal-pulse',
      projectInfo: makeProjectInfo(),
    });

    const renamed = results.find((r) => r.action === 'renamed');
    expect(renamed).toBeDefined();
    expect(renamed!.path).toContain('page.shader');
    // Original content should NOT be overwritten
    expect(readFileSync(existingPage, 'utf-8')).toBe('existing content');
  });

  it('should overwrite when overwrite=true', () => {
    const existingPage = join(TMP, 'src', 'app', 'page.tsx');
    writeFileSync(existingPage, 'old content');

    const results = generateThemeFiles({
      themeName: 'nebula-tech',
      projectInfo: makeProjectInfo(),
      overwrite: true,
    });

    const created = results.find((r) => r.action === 'created' && r.path.endsWith('page.tsx'));
    expect(created).toBeDefined();
    const content = readFileSync(existingPage, 'utf-8');
    expect(content).not.toBe('old content');
    expect(content).toContain('@shader-theme/core');
  });

  it('should generate config JSON', () => {
    const results = generateThemeFiles({
      themeName: 'nebula-tech',
      projectInfo: makeProjectInfo(),
    });
    const configResult = results.find((r) => r.path.endsWith('shader-theme.config.json'));
    expect(configResult).toBeDefined();
    expect(configResult!.action).toBe('created');
  });

  it('should work for all 3 themes', () => {
    for (const theme of ['nebula-tech', 'soft-glow', 'minimal-pulse']) {
      // Clean up page between runs
      const pagePath = join(TMP, 'src', 'app', 'page.tsx');
      if (existsSync(pagePath)) rmSync(pagePath);
      const configPath = join(TMP, 'shader-theme.config.json');
      if (existsSync(configPath)) rmSync(configPath);

      const results = generateThemeFiles({
        themeName: theme,
        projectInfo: makeProjectInfo(),
      });
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.path.endsWith('page.tsx') || r.path.includes('page.shader'))).toBe(true);
    }
  });
});

describe('generateSetupGuide', () => {
  it('should include theme name', () => {
    const guide = generateSetupGuide(makeProjectInfo(), 'nebula-tech');
    expect(guide).toContain('nebula-tech');
  });

  it('should reference TypeScript config for TS projects', () => {
    const guide = generateSetupGuide(makeProjectInfo({ isTypeScript: true }), 'soft-glow');
    expect(guide).toContain('next.config.ts');
  });

  it('should reference JavaScript config for JS projects', () => {
    const guide = generateSetupGuide(makeProjectInfo({ isTypeScript: false }), 'minimal-pulse');
    expect(guide).toContain('next.config.js');
  });

  it('should include src/app path for src-dir projects', () => {
    const guide = generateSetupGuide(makeProjectInfo({ hasSrcDir: true }), 'nebula-tech');
    expect(guide).toContain('src/app/layout');
  });

  it('should include app/ path for non-src-dir projects', () => {
    const guide = generateSetupGuide(makeProjectInfo({ hasSrcDir: false }), 'nebula-tech');
    expect(guide).toContain('app/layout');
    expect(guide).not.toContain('src/app/layout');
  });

  it('should include check command', () => {
    const guide = generateSetupGuide(makeProjectInfo(), 'nebula-tech');
    expect(guide).toContain('shader-theme check');
  });
});
