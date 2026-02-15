import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const SRC_DIR = join(__dirname, '..', 'src');

/**
 * Calculate total size of all .ts/.tsx source files in a directory (recursive).
 */
function getDirectorySize(dir: string, extensions = ['.ts', '.tsx']): number {
  let total = 0;

  function walk(d: string) {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const fullPath = join(d, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (extensions.includes(extname(entry.name))) {
        total += statSync(fullPath).size;
      }
    }
  }

  walk(dir);
  return total;
}

/**
 * Count non-empty, non-comment lines in a file.
 */
function countCodeLines(filePath: string): number {
  const content = readFileSync(filePath, 'utf-8');
  return content
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith('//') && !trimmed.startsWith('*');
    }).length;
}

describe('Bundle size monitoring', () => {
  it('core TypeScript source should be under 60KB (raw, excludes JSON themes)', () => {
    const totalBytes = getDirectorySize(SRC_DIR, ['.ts', '.tsx']);
    const totalKB = totalBytes / 1024;

    console.log(`  Core TS source size: ${totalKB.toFixed(1)} KB (raw)`);
    // Raw source includes types, JSDoc, Zod schemas — 60KB raw ≈ ~15KB gzipped
    expect(totalKB).toBeLessThan(60);
  });

  it('shader-utils.ts should be under 300 lines of code', () => {
    const filePath = join(SRC_DIR, 'lib', 'shader-utils.ts');
    const lines = countCodeLines(filePath);

    console.log(`  shader-utils.ts: ${lines} lines of code`);
    expect(lines).toBeLessThan(300);
  });

  it('ShaderCanvas.tsx should be under 300 lines of code', () => {
    const filePath = join(SRC_DIR, 'components', 'ShaderCanvas.tsx');
    const lines = countCodeLines(filePath);

    console.log(`  ShaderCanvas.tsx: ${lines} lines of code`);
    expect(lines).toBeLessThan(300);
  });

  it('each shader component should be under 150 lines of code', () => {
    const components = ['MeshGradient.tsx', 'NoiseGrain.tsx', 'GlowOrb.tsx'];

    for (const comp of components) {
      const filePath = join(SRC_DIR, 'components', comp);
      const lines = countCodeLines(filePath);
      console.log(`  ${comp}: ${lines} lines of code`);
      expect(lines).toBeLessThan(150);
    }
  });

  it('noise-texture.ts should be under 200 lines of code', () => {
    const filePath = join(SRC_DIR, 'lib', 'noise-texture.ts');
    const lines = countCodeLines(filePath);

    console.log(`  noise-texture.ts: ${lines} lines of code`);
    expect(lines).toBeLessThan(200);
  });

  it('theme-config.ts (Zod schema) should be under 200 lines of code', () => {
    const filePath = join(SRC_DIR, 'lib', 'theme-config.ts');
    const lines = countCodeLines(filePath);

    console.log(`  theme-config.ts: ${lines} lines of code`);
    expect(lines).toBeLessThan(200);
  });

  it('no single source file should exceed 300 lines (project rule)', () => {
    const violations: string[] = [];

    function checkDir(dir: string) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          checkDir(fullPath);
        } else if (['.ts', '.tsx'].includes(extname(entry.name))) {
          const content = readFileSync(fullPath, 'utf-8');
          const lineCount = content.split('\n').length;
          if (lineCount > 300) {
            const relPath = fullPath.replace(SRC_DIR, 'src');
            violations.push(`${relPath}: ${lineCount} lines`);
          }
        }
      }
    }

    checkDir(SRC_DIR);

    if (violations.length > 0) {
      console.log('  Files exceeding 300 lines:', violations);
    }
    expect(violations).toHaveLength(0);
  });
});
