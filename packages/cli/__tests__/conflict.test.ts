import { describe, it, expect } from 'vitest';
import { checkConflict, getRenamePath } from '../src/resolvers/conflict.js';
import { join } from 'node:path';

describe('checkConflict', () => {
  it('should return null for non-existent file', () => {
    expect(checkConflict('/non/existent/file.tsx')).toBeNull();
  });

  it('should return conflict info for existing file', () => {
    // Use package.json which definitely exists
    const result = checkConflict(join(__dirname, '..', 'package.json'));
    expect(result).not.toBeNull();
    expect(result!.action).toBe('skip');
  });
});

describe('getRenamePath', () => {
  it('should insert .shader before extension', () => {
    expect(getRenamePath('page.tsx')).toBe('page.shader.tsx');
  });

  it('should handle path with directories', () => {
    expect(getRenamePath('src/app/page.tsx')).toBe('src/app/page.shader.tsx');
  });

  it('should handle file without extension', () => {
    expect(getRenamePath('README')).toBe('README.shader');
  });
});
