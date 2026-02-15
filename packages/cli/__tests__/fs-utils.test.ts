import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { writeFileSafe, readFileSafe, exists, getTemplatesDir } from '../src/utils/fs';

const TMP = join(__dirname, '__tmp_fs_test__');

beforeEach(() => {
  mkdirSync(TMP, { recursive: true });
});

afterEach(() => {
  rmSync(TMP, { recursive: true, force: true });
});

describe('writeFileSafe', () => {
  it('should create file in existing directory', () => {
    const p = join(TMP, 'hello.txt');
    writeFileSafe(p, 'world');
    expect(readFileSync(p, 'utf-8')).toBe('world');
  });

  it('should create nested directories automatically', () => {
    const p = join(TMP, 'deep', 'nested', 'dir', 'file.ts');
    writeFileSafe(p, 'content');
    expect(readFileSync(p, 'utf-8')).toBe('content');
  });

  it('should overwrite existing file', () => {
    const p = join(TMP, 'overwrite.txt');
    writeFileSafe(p, 'first');
    writeFileSafe(p, 'second');
    expect(readFileSync(p, 'utf-8')).toBe('second');
  });

  it('should handle unicode content', () => {
    const p = join(TMP, 'unicode.txt');
    const content = '中文繁體 日本語 한국어 🎨';
    writeFileSafe(p, content);
    expect(readFileSync(p, 'utf-8')).toBe(content);
  });
});

describe('readFileSafe', () => {
  it('should return file content when exists', () => {
    const p = join(TMP, 'read.txt');
    writeFileSync(p, 'data');
    expect(readFileSafe(p)).toBe('data');
  });

  it('should return undefined for non-existent file', () => {
    expect(readFileSafe(join(TMP, 'missing.txt'))).toBeUndefined();
  });
});

describe('exists', () => {
  it('should return true for existing file', () => {
    const p = join(TMP, 'e.txt');
    writeFileSync(p, '');
    expect(exists(p)).toBe(true);
  });

  it('should return true for existing directory', () => {
    expect(exists(TMP)).toBe(true);
  });

  it('should return false for non-existent path', () => {
    expect(exists(join(TMP, 'nope'))).toBe(false);
  });
});

describe('getTemplatesDir', () => {
  it('should resolve to a directory containing themes/', () => {
    const dir = getTemplatesDir();
    expect(existsSync(join(dir, 'themes'))).toBe(true);
  });

  it('should contain all 3 theme subdirectories', () => {
    const dir = getTemplatesDir();
    expect(existsSync(join(dir, 'themes', 'nebula-tech'))).toBe(true);
    expect(existsSync(join(dir, 'themes', 'soft-glow'))).toBe(true);
    expect(existsSync(join(dir, 'themes', 'minimal-pulse'))).toBe(true);
  });

  it('should contain base and scaffolds', () => {
    const dir = getTemplatesDir();
    expect(existsSync(join(dir, 'base'))).toBe(true);
    expect(existsSync(join(dir, 'scaffolds'))).toBe(true);
  });
});
