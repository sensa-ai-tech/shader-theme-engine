import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface ProjectInfo {
  /** Whether the cwd appears to be a Next.js project */
  isNextProject: boolean;
  /** 'app' or 'pages' router */
  router: 'app' | 'pages' | 'unknown';
  /** Whether src/ directory is used */
  hasSrcDir: boolean;
  /** Whether TypeScript is used */
  isTypeScript: boolean;
  /** Detected Tailwind major version, or 0 if not found */
  tailwindVersion: number;
  /** Whether @shader-theme/core is already installed */
  hasShaderTheme: boolean;
  /** Root path of the project (cwd) */
  rootDir: string;
}

export function detectProject(cwd: string): ProjectInfo {
  const info: ProjectInfo = {
    isNextProject: false,
    router: 'unknown',
    hasSrcDir: false,
    isTypeScript: false,
    tailwindVersion: 0,
    hasShaderTheme: false,
    rootDir: cwd,
  };

  // Check package.json
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) return info;

  let pkg: Record<string, unknown>;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  } catch {
    return info;
  }

  const allDeps = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };

  // Next.js check
  if ('next' in allDeps) {
    info.isNextProject = true;
  }

  // TypeScript check
  info.isTypeScript =
    existsSync(join(cwd, 'tsconfig.json')) || 'typescript' in allDeps;

  // src/ directory
  info.hasSrcDir = existsSync(join(cwd, 'src'));

  // Router detection
  const base = info.hasSrcDir ? join(cwd, 'src') : cwd;
  if (existsSync(join(base, 'app'))) {
    info.router = 'app';
  } else if (existsSync(join(base, 'pages'))) {
    info.router = 'pages';
  }

  // Tailwind version
  const twVersion = allDeps['tailwindcss'];
  if (twVersion) {
    const match = twVersion.match(/(\d+)/);
    if (match) info.tailwindVersion = parseInt(match[1], 10);
  }

  // Shader theme installed?
  info.hasShaderTheme = '@shader-theme/core' in allDeps;

  return info;
}
