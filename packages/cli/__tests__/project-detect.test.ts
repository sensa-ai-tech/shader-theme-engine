import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { detectProject } from '../src/resolvers/project-detect.js';

describe('detectProject', () => {
  it('should detect the demo package as a Next.js project', () => {
    const demoDir = join(__dirname, '..', '..', 'demo');
    const info = detectProject(demoDir);

    expect(info.isNextProject).toBe(true);
    expect(info.router).toBe('app');
    expect(info.hasSrcDir).toBe(true);
    expect(info.isTypeScript).toBe(true);
    expect(info.tailwindVersion).toBeGreaterThanOrEqual(4);
    expect(info.hasShaderTheme).toBe(true);
  });

  it('should detect the CLI package as not a Next.js project', () => {
    const cliDir = join(__dirname, '..');
    const info = detectProject(cliDir);

    expect(info.isNextProject).toBe(false);
    expect(info.router).toBe('unknown');
  });

  it('should return defaults for non-existent directory', () => {
    const info = detectProject('/non/existent/path');

    expect(info.isNextProject).toBe(false);
    expect(info.router).toBe('unknown');
    expect(info.hasSrcDir).toBe(false);
    expect(info.isTypeScript).toBe(false);
    expect(info.tailwindVersion).toBe(0);
    expect(info.hasShaderTheme).toBe(false);
  });
});
