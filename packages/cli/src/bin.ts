#!/usr/bin/env node

import { runInit } from './commands/init.js';
import { runCheck } from './commands/check.js';
import { runList } from './commands/list.js';

const args = process.argv.slice(2);
const command = args[0];

function getFlag(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function showHelp(): void {
  console.log(`
  shader-theme — One-click WebGL shader themes for Next.js

  Usage:
    npx shader-theme init [--theme <name>]   Set up shader theme in project
    npx shader-theme check                   Verify project configuration
    npx shader-theme list                    Show available themes
    npx shader-theme --help                  Show this help

  Options:
    --theme <name>   Theme name (nebula-tech | soft-glow | minimal-pulse)
    --cwd <path>     Working directory (default: current directory)
    --help           Show help
    --version        Show version
  `);
}

async function main(): Promise<void> {
  if (args.includes('--version') || args.includes('-v')) {
    console.log('shader-theme 0.0.1');
    return;
  }

  if (args.includes('--help') || args.includes('-h') || !command) {
    showHelp();
    return;
  }

  switch (command) {
    case 'init':
      await runInit({ theme: getFlag('theme'), cwd: getFlag('cwd') });
      break;
    case 'check':
      runCheck(getFlag('cwd'));
      break;
    case 'list':
      runList();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
