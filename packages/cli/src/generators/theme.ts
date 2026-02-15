import { readFileSync, copyFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { ProjectInfo } from '../resolvers/project-detect.js';
import { writeFileSafe, getTemplatesDir } from '../utils/fs.js';
import { checkConflict, getRenamePath } from '../resolvers/conflict.js';

export interface ThemeGeneratorOptions {
  themeName: string;
  projectInfo: ProjectInfo;
  overwrite?: boolean;
}

export interface GeneratedFile {
  path: string;
  action: 'created' | 'skipped' | 'renamed';
  originalPath?: string;
}

/**
 * Copy theme template files into the target project.
 * Returns list of files that were created/skipped/renamed.
 */
export function generateThemeFiles(
  options: ThemeGeneratorOptions,
): GeneratedFile[] {
  const { themeName, projectInfo, overwrite = false } = options;
  const templatesDir = getTemplatesDir();
  const themeDir = join(templatesDir, 'themes', themeName);
  const results: GeneratedFile[] = [];

  // Determine target app directory
  const appBase = projectInfo.hasSrcDir
    ? join(projectInfo.rootDir, 'src', 'app')
    : join(projectInfo.rootDir, 'app');

  // Copy theme page.tsx
  const sourcePagePath = join(themeDir, 'page.tsx');
  const targetPagePath = join(appBase, 'page.tsx');

  const conflict = checkConflict(targetPagePath);
  if (conflict && !overwrite) {
    const renamedPath = getRenamePath(targetPagePath);
    const pageContent = readFileSync(sourcePagePath, 'utf-8');
    writeFileSafe(renamedPath, pageContent);
    results.push({
      path: renamedPath,
      action: 'renamed',
      originalPath: targetPagePath,
    });
  } else {
    const pageContent = readFileSync(sourcePagePath, 'utf-8');
    writeFileSafe(targetPagePath, pageContent);
    results.push({ path: targetPagePath, action: 'created' });
  }

  // Copy theme config JSON to project root
  const themeConfigSource = join(
    templatesDir,
    '..', // up from templates/
    '..', // up from cli/
    'core',
    'src',
    'themes',
    `${themeName}.json`,
  );
  const themeConfigTarget = join(
    projectInfo.rootDir,
    'shader-theme.config.json',
  );

  // Try to read from core package themes, fall back to base template
  try {
    const configContent = readFileSync(themeConfigSource, 'utf-8');
    writeFileSafe(themeConfigTarget, configContent);
    results.push({ path: themeConfigTarget, action: 'created' });
  } catch {
    // If core themes aren't accessible, copy the base template
    const baseConfig = readFileSync(
      join(templatesDir, 'base', 'shader-theme.config.json'),
      'utf-8',
    );
    writeFileSafe(themeConfigTarget, baseConfig);
    results.push({ path: themeConfigTarget, action: 'created' });
  }

  return results;
}

/**
 * Generate SHADER_SETUP.md with setup instructions for existing projects.
 */
export function generateSetupGuide(
  projectInfo: ProjectInfo,
  themeName: string,
): string {
  const ext = projectInfo.isTypeScript ? 'ts' : 'js';
  const layoutPath = projectInfo.hasSrcDir
    ? `src/app/layout.${ext}x`
    : `app/layout.${ext}x`;
  const nextConfigPath = `next.config.${ext}`;

  return `# ShaderTheme Setup Guide

## Theme: ${themeName}

### Step 1: Install dependencies

\`\`\`bash
npm install @shader-theme/core
\`\`\`

### Step 2: Update next.config.${ext}

Add \`@shader-theme/core\` to \`transpilePackages\` in your \`${nextConfigPath}\`:

\`\`\`${ext}
const nextConfig = {
  transpilePackages: ['@shader-theme/core'],
};
\`\`\`

### Step 3: Import shader components in \`${layoutPath}\`

Make sure your layout file wraps children properly. Shader components are already in your page.

### Step 4: Verify setup

\`\`\`bash
npx shader-theme check
\`\`\`

This will verify that your project is correctly configured.

### That's it!

Run \`npm run dev\` and you should see shader effects on your page.
`;
}
