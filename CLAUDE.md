# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Astro-based personal portfolio site (x4132.dev) with two main features:
1. **Blog system** - MDX-based with subposts, authors, tags, and TOC generation
2. **Bubble chamber simulation** - Interactive particle physics visualization using React Three Fiber

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server at localhost:4321
pnpm build            # Type-check (astro check) then build to ./dist/
pnpm preview          # Preview production build locally
```

## Architecture

### Content System

Uses Astro Content Collections with three collections defined in `src/content.config.ts`:
- **blog**: Posts with optional subposts (nested via `/` in ID, e.g., `parent-post/subpost-1`)
- **authors**: Author profiles linked to posts via `authors` frontmatter array
- **projects**: Portfolio project entries

**Blog utilities** (`src/lib/data-utils.ts`):
- `getAllPosts()` / `getPostsByTag()` / `getPostsByAuthor()` - Post queries
- `getSubpostsForParent()` / `hasSubposts()` - Subpost hierarchy
- `getTOCSections()` - Table of contents generation for posts with subposts
- `parseAuthors()` - Resolve author IDs to full author data

**Path alias**: Use `@/*` for imports from `src/*`

### Physics Simulation System

Located in `src/components/bubblechamber/`:

**Particle Registry** (`particles/registry.ts`):
- PDG 2024-validated particle data (masses, lifetimes, decay channels)
- Decay configs with branching ratios (e.g., π⁺ → μ⁺ at 99.99%)
- All masses in GeV, lifetimes in seconds

**Event Store** (`useEventStore.ts`):
- Zustand store for physics event and particle lifecycle
- Tracks particle status: active → decayed/stopped/exited → faded
- Garbage collects events when all particles fade

**Physics Engine** (`particles/Particle.tsx`):
- `useParticlePhysics` hook: relativistic motion, Lorentz force, energy loss, decay sampling
- Renders trajectories as Three.js line geometries
- Per-frame updates via R3F `useFrame`

**Event Spawners** (`events/spawners.ts`):
- Physics event types: pair_production, cosmic_ray, kaon_decay, v_event, muon_pair, pion_pair

### Important Patterns

- **Client-only rendering**: Bubble chamber uses `client:only="react"` (Three.js needs browser APIs)
- **Subpost convention**: Blog posts with subposts use directory structure (`post-name/01-intro.mdx`)
- **PDG validation**: Particle properties are validated against Particle Data Group 2024 standards
