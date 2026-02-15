import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { writeFileSafe } from '../utils/fs.js';

export interface NewProjectOptions {
  projectName: string;
  targetDir: string;
}

/**
 * Scaffold a new Next.js project using create-next-app.
 * Returns the project directory path.
 */
export function scaffoldNewProject(options: NewProjectOptions): string {
  const { projectName, targetDir } = options;
  const projectDir = join(targetDir, projectName);

  // Run create-next-app with pre-configured options
  execSync(
    `echo N | npx create-next-app@latest "${projectName}" --typescript --tailwind --eslint --app --src-dir --no-import-alias --turbopack`,
    {
      cwd: targetDir,
      stdio: 'inherit',
      timeout: 120_000,
    },
  );

  // Add transpilePackages to next.config.ts
  const nextConfigPath = join(projectDir, 'next.config.ts');
  if (existsSync(nextConfigPath)) {
    const content = readFileSync(nextConfigPath, 'utf-8');
    if (!content.includes('transpilePackages')) {
      const updated = content.replace(
        'const nextConfig: NextConfig = {',
        "const nextConfig: NextConfig = {\n  transpilePackages: ['@shader-theme/core'],",
      );
      writeFileSync(nextConfigPath, updated, 'utf-8');
    }
  }

  return projectDir;
}

/**
 * Install @shader-theme/core into a project using the detected package manager.
 */
export function installShaderTheme(projectDir: string): void {
  const pm = detectPackageManager(projectDir);
  const cmd =
    pm === 'pnpm'
      ? 'pnpm add @shader-theme/core'
      : pm === 'yarn'
        ? 'yarn add @shader-theme/core'
        : 'npm install @shader-theme/core';

  execSync(cmd, { cwd: projectDir, stdio: 'inherit', timeout: 60_000 });
}

function detectPackageManager(
  dir: string,
): 'npm' | 'yarn' | 'pnpm' {
  if (existsSync(join(dir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(dir, 'yarn.lock'))) return 'yarn';
  return 'npm';
}
