import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const CLI_DIR = join(__dirname, '..');
const TSX_PATH = join(CLI_DIR, 'node_modules', '.bin', 'tsx');
const BIN_PATH = join(CLI_DIR, 'src', 'bin.ts');

function runCli(args: string): string {
  return execSync(`npx tsx "${BIN_PATH}" ${args}`, {
    cwd: CLI_DIR,
    encoding: 'utf-8',
    timeout: 15_000,
    env: { ...process.env, FORCE_COLOR: '0' },
  });
}

describe('CLI integration', () => {
  it('should show help when invoked with --help', () => {
    const output = runCli('--help');
    expect(output).toContain('shader-theme');
    expect(output).toContain('init');
    expect(output).toContain('check');
    expect(output).toContain('list');
  });

  it('should show version when invoked with --version', () => {
    const output = runCli('--version');
    expect(output.trim()).toMatch(/shader-theme \d+\.\d+\.\d+/);
  });

  it('should list all 3 themes', () => {
    const output = runCli('list');
    expect(output).toContain('Nebula Tech');
    expect(output).toContain('Soft Glow');
    expect(output).toContain('Minimal Pulse');
    expect(output).toContain('nebula-tech');
    expect(output).toContain('soft-glow');
    expect(output).toContain('minimal-pulse');
  });

  it('should exit with error on unknown command', () => {
    expect(() => runCli('foobar')).toThrow();
  });

  it('should run check on demo project and find Next.js', () => {
    const demoDir = join(__dirname, '..', '..', 'demo');
    const output = runCli(`check --cwd "${demoDir}"`);
    expect(output).toContain('Next.js project detected');
  });

  it('should detect missing config in demo project', () => {
    const demoDir = join(__dirname, '..', '..', 'demo');
    const output = runCli(`check --cwd "${demoDir}"`);
    // Config file is not generated in demo — should flag it
    expect(output).toContain('Theme config file');
  });
});

describe('CLI edge cases', () => {
  it('should show help with -h shorthand', () => {
    const output = runCli('-h');
    expect(output).toContain('shader-theme');
    expect(output).toContain('init');
  });

  it('should show version with -v shorthand', () => {
    const output = runCli('-v');
    expect(output.trim()).toMatch(/shader-theme \d+\.\d+\.\d+/);
  });

  it('should show help when no command is given', () => {
    const output = runCli('');
    expect(output).toContain('shader-theme');
    expect(output).toContain('Usage:');
  });

  it('should handle check on non-Next.js directory', () => {
    const output = runCli(`check --cwd "${join(__dirname, '..')}"`);
    // CLI directory is not a Next.js project
    expect(output).toContain('Next.js project detected');
    // Should show failure
    expect(output).toContain('issue');
  });

  it('should handle list output with correct theme count', () => {
    const output = runCli('list');
    // Count theme names
    const themes = ['nebula-tech', 'soft-glow', 'minimal-pulse'];
    for (const t of themes) {
      expect(output).toContain(t);
    }
  });
});

describe('Template files exist', () => {
  const templatesDir = join(CLI_DIR, 'templates');

  it('should have all 3 theme templates', () => {
    expect(existsSync(join(templatesDir, 'themes', 'nebula-tech', 'page.tsx'))).toBe(true);
    expect(existsSync(join(templatesDir, 'themes', 'soft-glow', 'page.tsx'))).toBe(true);
    expect(existsSync(join(templatesDir, 'themes', 'minimal-pulse', 'page.tsx'))).toBe(true);
  });

  it('should have base config template', () => {
    expect(existsSync(join(templatesDir, 'base', 'shader-theme.config.json'))).toBe(true);
  });

  it('should have scaffold template', () => {
    expect(existsSync(join(templatesDir, 'scaffolds', 'next.config.ts'))).toBe(true);
  });

  it('all theme templates should use @shader-theme/core imports', () => {
    const themes = ['nebula-tech', 'soft-glow', 'minimal-pulse'];
    for (const theme of themes) {
      const content = readFileSync(
        join(templatesDir, 'themes', theme, 'page.tsx'),
        'utf-8',
      );
      expect(content).toContain('@shader-theme/core');
      expect(content).toContain("'use client'");
    }
  });
});
