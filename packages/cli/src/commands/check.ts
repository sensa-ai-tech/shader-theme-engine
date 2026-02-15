import pc from 'picocolors';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { detectProject } from '../resolvers/project-detect.js';

interface CheckResult {
  label: string;
  passed: boolean;
  suggestion?: string;
}

export function runCheck(cwd?: string): void {
  const dir = cwd ?? process.cwd();
  const results: CheckResult[] = [];

  console.log('');
  console.log(pc.bold('  shader-theme check'));
  console.log('');

  const project = detectProject(dir);

  // 1. Next.js project?
  results.push({
    label: 'Next.js project detected',
    passed: project.isNextProject,
    suggestion: 'Run `shader-theme init` in a Next.js project directory',
  });

  // 2. App Router?
  results.push({
    label: 'App Router detected',
    passed: project.router === 'app',
    suggestion:
      project.router === 'pages'
        ? 'ShaderTheme requires App Router. Migrate from Pages Router.'
        : 'Create an `app/` directory (or `src/app/` if using src layout)',
  });

  // 3. TypeScript?
  results.push({
    label: 'TypeScript configured',
    passed: project.isTypeScript,
    suggestion: 'Add a tsconfig.json to enable TypeScript',
  });

  // 4. Tailwind CSS?
  results.push({
    label: `Tailwind CSS v${project.tailwindVersion || '?'} installed`,
    passed: project.tailwindVersion >= 3,
    suggestion: 'Install Tailwind CSS: npx @tailwindcss/upgrade',
  });

  // 5. @shader-theme/core installed?
  results.push({
    label: '@shader-theme/core installed',
    passed: project.hasShaderTheme,
    suggestion: 'Run: npm install @shader-theme/core',
  });

  // 6. transpilePackages configured?
  let hasTranspile = false;
  const ext = project.isTypeScript ? 'ts' : 'js';
  const nextConfigPath = join(dir, `next.config.${ext}`);
  const nextConfigMjsPath = join(dir, 'next.config.mjs');
  const configPath = existsSync(nextConfigPath)
    ? nextConfigPath
    : existsSync(nextConfigMjsPath)
      ? nextConfigMjsPath
      : null;

  if (configPath) {
    const content = readFileSync(configPath, 'utf-8');
    hasTranspile = content.includes('@shader-theme/core');
  }

  results.push({
    label: 'transpilePackages configured',
    passed: hasTranspile,
    suggestion: `Add to ${configPath ?? `next.config.${ext}`}: transpilePackages: ['@shader-theme/core']`,
  });

  // 7. Shader components exist?
  const appBase = project.hasSrcDir
    ? join(dir, 'src', 'app')
    : join(dir, 'app');
  const pagePath = join(appBase, 'page.tsx');
  let hasShaderImport = false;
  if (existsSync(pagePath)) {
    const pageContent = readFileSync(pagePath, 'utf-8');
    hasShaderImport = pageContent.includes('@shader-theme/core');
  }

  results.push({
    label: 'Shader components in page',
    passed: hasShaderImport,
    suggestion: 'Run `shader-theme init` to add shader components to your page',
  });

  // 8. Theme config exists?
  const configExists = existsSync(join(dir, 'shader-theme.config.json'));
  results.push({
    label: 'Theme config file exists',
    passed: configExists,
    suggestion: 'Run `shader-theme init` to generate shader-theme.config.json',
  });

  // Print results
  const allPassed = results.every((r) => r.passed);
  const failCount = results.filter((r) => !r.passed).length;

  for (const r of results) {
    if (r.passed) {
      console.log(`  ${pc.green('✓')} ${r.label}`);
    } else {
      console.log(`  ${pc.red('✗')} ${r.label}`);
      if (r.suggestion) {
        console.log(pc.dim(`    → ${r.suggestion}`));
      }
    }
  }

  console.log('');
  if (allPassed) {
    console.log(
      pc.green(pc.bold('  All checks passed!')) +
        pc.dim(' Your project is ready.'),
    );
  } else {
    console.log(
      pc.yellow(`  ${failCount} issue${failCount > 1 ? 's' : ''} found.`) +
        pc.dim(' Follow the suggestions above.'),
    );
  }
  console.log('');
}
