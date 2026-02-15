# shader-theme

One-click WebGL shader themes for Next.js. Choose a theme, run one command, get a production-ready landing page with GPU-accelerated visual effects.

## Quick Start

```bash
# New project
npx shader-theme init

# Existing Next.js project
cd my-next-app
npx shader-theme init --theme nebula-tech
```

That's it. 30 seconds to a shader-powered website.

## Commands

### `shader-theme init`

Interactive setup wizard. Auto-detects whether you're in an existing Next.js project or need a new one.

```bash
npx shader-theme init [options]

Options:
  --theme <name>   Skip theme selection (nebula-tech | soft-glow | minimal-pulse)
  --cwd <path>     Working directory (default: current directory)
```

**What it does:**
1. Detects your project structure (App Router, src/, TypeScript, Tailwind)
2. Lets you choose from 3 built-in themes
3. Copies shader components and theme config
4. For existing projects: generates `SHADER_SETUP.md` with remaining steps
5. For new projects: scaffolds a complete Next.js project with shaders pre-configured

### `shader-theme check`

Verifies your project configuration is correct.

```bash
npx shader-theme check [--cwd <path>]
```

Checks 8 configuration points:
- Next.js project detected
- App Router configured
- TypeScript enabled
- Tailwind CSS installed
- `@shader-theme/core` installed
- `transpilePackages` configured
- Shader components in page
- Theme config file exists

### `shader-theme list`

Shows all available themes with descriptions.

```bash
npx shader-theme list
```

## Available Themes

| Theme | Style | Effects |
|-------|-------|---------|
| **Nebula Tech** | Dark sci-fi | Flowing purple-blue fluid gradients, glow orbs, noise grain |
| **Soft Glow** | Light warm brand | Desaturated mesh gradients, subtle noise overlay |
| **Minimal Pulse** | Ultra-minimal | Single subtle glow orb |

## How It Works

The CLI copies pre-built React components powered by `@shader-theme/core` into your project. Each theme includes:

- **Page template** (`page.tsx`) — Complete landing page with shader sections
- **Theme config** (`shader-theme.config.json`) — Colors, shader params, performance settings
- **Setup guide** (`SHADER_SETUP.md`) — For existing projects, step-by-step integration

All shader rendering happens on the GPU via WebGL2, with automatic CSS fallback for unsupported browsers or low-performance devices.

## Requirements

- Node.js 18+
- Next.js 14+ with App Router
- TypeScript (recommended)
- Tailwind CSS 3+ or 4+

## Conflict Handling

If your project already has a `page.tsx`, the CLI will:
- Save the shader page as `page.shader.tsx`
- Preserve your existing file untouched
- You can manually merge or replace as needed

Use `--overwrite` to replace existing files directly (not recommended for existing projects).

## License

MIT
