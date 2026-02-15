import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

/** Ensure parent directories exist, then write file */
export function writeFileSafe(filePath: string, content: string): void {
  const dir = dirname(filePath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
}

/** Read file if it exists, otherwise return undefined */
export function readFileSafe(filePath: string): string | undefined {
  if (!existsSync(filePath)) return undefined;
  return readFileSync(filePath, 'utf-8');
}

/** Check if a file or directory exists */
export function exists(p: string): boolean {
  return existsSync(p);
}

/** Resolve relative to cwd */
export function resolveCwd(...segments: string[]): string {
  return resolve(process.cwd(), ...segments);
}

/** Get the templates directory (relative to the CLI package) */
export function getTemplatesDir(): string {
  // In development (tsx), we're in src/; in production, we're in dist/
  // Templates are always at the package root level
  const thisFile = new URL(import.meta.url).pathname;
  // On Windows, remove leading slash from /C:/...
  const normalized = process.platform === 'win32' && thisFile.startsWith('/')
    ? thisFile.slice(1)
    : thisFile;
  // Walk up from src/utils/ or dist/utils/ to package root
  return resolve(dirname(normalized), '..', '..', 'templates');
}
