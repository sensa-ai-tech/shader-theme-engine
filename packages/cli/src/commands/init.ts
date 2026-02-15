import prompts from 'prompts';
import pc from 'picocolors';
import { resolve } from 'node:path';
import { detectProject } from '../resolvers/project-detect.js';
import { generateThemeFiles, generateSetupGuide } from '../generators/theme.js';
import { scaffoldNewProject, installShaderTheme } from '../generators/project.js';
import { writeFileSafe } from '../utils/fs.js';

const AVAILABLE_THEMES = [
  {
    value: 'nebula-tech',
    title: 'Nebula Tech',
    description: 'Dark sci-fi with flowing purple-blue fluid gradients',
  },
  {
    value: 'soft-glow',
    title: 'Soft Glow',
    description: 'Light warm brand with desaturated mesh gradients',
  },
  {
    value: 'minimal-pulse',
    title: 'Minimal Pulse',
    description: 'Ultra-minimal with a single subtle glow orb',
  },
];

export interface InitOptions {
  theme?: string;
  cwd?: string;
}

export async function runInit(options: InitOptions = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();

  console.log('');
  console.log(
    pc.bold('  shader-theme') + pc.dim(' — One-click WebGL shader themes'),
  );
  console.log('');

  // Step 1: Detect project
  const projectInfo = detectProject(cwd);

  let projectDir = cwd;

  if (!projectInfo.isNextProject) {
    // Not in a Next.js project — ask to create one
    console.log(
      pc.yellow('  No Next.js project detected in the current directory.'),
    );
    console.log('');

    const { createNew } = await prompts({
      type: 'confirm',
      name: 'createNew',
      message: 'Create a new Next.js project?',
      initial: true,
    });

    if (!createNew) {
      console.log(pc.dim('  Cancelled.'));
      return;
    }

    const { projectName } = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-shader-site',
      validate: (v: string) =>
        /^[a-z0-9-]+$/.test(v)
          ? true
          : 'Use lowercase letters, numbers, and hyphens only',
    });

    if (!projectName) return;

    console.log('');
    console.log(pc.dim('  Creating Next.js project...'));
    projectDir = scaffoldNewProject({ projectName, targetDir: cwd });
  } else {
    console.log(
      pc.green('  ✓') +
        pc.dim(
          ` Next.js project detected (${projectInfo.router} router, ${projectInfo.isTypeScript ? 'TypeScript' : 'JavaScript'})`,
        ),
    );
  }

  // Step 2: Choose theme
  let themeName = options.theme;
  if (!themeName) {
    const { theme } = await prompts({
      type: 'select',
      name: 'theme',
      message: 'Choose a theme:',
      choices: AVAILABLE_THEMES,
    });

    if (!theme) return;
    themeName = theme;
  }

  console.log('');
  console.log(pc.dim(`  Applying theme: ${pc.bold(themeName!)}...`));

  // Step 3: Re-detect after possible project creation
  const finalProject = detectProject(projectDir);

  // Step 4: Install @shader-theme/core if not present
  if (!finalProject.hasShaderTheme) {
    console.log(pc.dim('  Installing @shader-theme/core...'));
    try {
      installShaderTheme(projectDir);
    } catch {
      console.log(
        pc.yellow(
          '  ⚠ Could not auto-install. Please run: npm install @shader-theme/core',
        ),
      );
    }
  }

  // Step 5: Generate theme files
  const results = generateThemeFiles({
    themeName: themeName!,
    projectInfo: finalProject,
  });

  // Step 6: Generate setup guide for existing projects
  if (projectInfo.isNextProject) {
    const guide = generateSetupGuide(finalProject, themeName!);
    const guidePath = resolve(projectDir, 'SHADER_SETUP.md');
    writeFileSafe(guidePath, guide);
    results.push({ path: guidePath, action: 'created' });
  }

  // Step 7: Print results
  console.log('');
  console.log(pc.green(pc.bold('  ✓ Theme applied successfully!')));
  console.log('');

  for (const file of results) {
    const icon =
      file.action === 'created'
        ? pc.green('+')
        : file.action === 'renamed'
          ? pc.yellow('~')
          : pc.dim('-');
    const relPath = file.path.replace(projectDir, '.');
    console.log(`  ${icon} ${relPath}`);
    if (file.action === 'renamed' && file.originalPath) {
      console.log(
        pc.dim(
          `    (existing file preserved, shader page saved as ${relPath})`,
        ),
      );
    }
  }

  console.log('');
  console.log(pc.dim('  Next steps:'));
  if (!projectInfo.isNextProject) {
    console.log(pc.dim(`    cd ${projectDir}`));
  }
  console.log(pc.dim('    npx shader-theme check'));
  console.log(pc.dim('    npm run dev'));
  console.log('');
}
