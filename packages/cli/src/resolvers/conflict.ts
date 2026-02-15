import { existsSync } from 'node:fs';

export type ConflictAction = 'overwrite' | 'skip' | 'rename';

export interface ConflictResult {
  action: ConflictAction;
  path: string;
}

/**
 * Check if target path already exists.
 * Returns the conflict info if there's a conflict.
 */
export function checkConflict(targetPath: string): ConflictResult | null {
  if (!existsSync(targetPath)) return null;
  return { action: 'skip', path: targetPath };
}

/**
 * Generate a renamed path by appending a numeric suffix.
 * e.g., "page.tsx" → "page.shader.tsx"
 */
export function getRenamePath(originalPath: string): string {
  const dotIdx = originalPath.lastIndexOf('.');
  if (dotIdx === -1) return `${originalPath}.shader`;
  return `${originalPath.slice(0, dotIdx)}.shader${originalPath.slice(dotIdx)}`;
}
