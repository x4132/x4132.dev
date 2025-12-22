# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based personal portfolio site (x4132.dev) featuring an interactive particle physics bubble chamber simulation built with React Three Fiber. The bubble chamber visualizes relativistic particle interactions including pair production events and particle decay chains in a magnetic field.

## Commands

**Package Manager**: This project uses `pnpm`

```bash
# Development
pnpm install          # Install dependencies
pnpm dev             # Start dev server at localhost:4321
pnpm build           # Build production site to ./dist/
pnpm preview         # Preview production build locally

# Astro CLI
pnpm astro ...       # Run Astro CLI commands
```

## Architecture

### Physics Simulation System

The bubble chamber simulation is built around a physics event/particle lifecycle system:

**Event Management** (`src/lib/useEventStore.ts`):
- Central Zustand store manages physics events and particle records
- Each event spawns particles and tracks their lifecycle
- Particles register themselves with events and notify on death/decay
- Events are cleaned up after a configurable delay

**Physics Event Flow**:
1. `EventManager` spawns physics events at intervals (e.g., pair production)
2. Event components (e.g., `PairProduction`) create initial particles
3. Particles simulate relativistic motion in a magnetic field using `useParticlePhysics` hook
4. When particles decay, they call `onDeath` callback which spawns decay products
5. Decay products are dynamically rendered using the `PARTICLE_COMPONENTS` registry
6. Events are automatically cleaned up after `cleanupDelay`

**Particle Physics** (`src/components/bc/Particle.tsx`):
- Core `useParticlePhysics` hook handles:
  - Relativistic momentum and velocity calculations
  - Lorentz force in magnetic field (curved trajectories)
  - Energy loss and momentum decay
  - Radioactive decay using exponential distribution sampling
  - Multi-channel decay with branching ratios
  - Fade-out animation after death
- Each particle type (Electron, Positron, Muon, etc.) configures mass, charge, color, and decay channels
- Particles render their trajectories as Three.js line geometries

**Key Physics Parameters**:
- `bField`: Magnetic field strength (affects curvature radius)
- `mass`: Rest mass in GeV (affects relativistic calculations)
- `charge`: Electric charge (±1 for leptons, affects trajectory direction)
- `energyLossRate`: Rate of momentum loss (simulates ionization)
- `decay.meanLifetime`: Mean lifetime in simulation time units
- `decay.channels`: Array of decay modes with probabilities and products

### Tech Stack Integration

- **Astro**: Static site generation, routing via `src/pages/`
- **React**: Used for interactive components (bubble chamber)
- **React Three Fiber**: 3D rendering with Three.js
- **Zustand**: State management for physics events
- **Tailwind CSS**: Styling (v4 with Vite plugin)
- **TypeScript**: Strict mode enabled

### Important Patterns

**Client-Only Rendering**: The bubble chamber uses `client:only="react"` directive since Three.js requires browser APIs.

**Dynamic Particle Creation**: Decay products are spawned dynamically by looking up particle types in `PARTICLE_COMPONENTS` registry. When adding new particle types:
1. Create particle component in `src/components/bc/` (extend `Particle.tsx`)
2. Define decay config if unstable
3. Register in `PARTICLE_COMPONENTS` map in `PairProduction.tsx`

**State Management**:
- Physics state lives in Zustand store (`useEventStore`)
- Local particle physics uses `useFrame` hook for per-frame updates
- Particle trajectories accumulate points in a ref-based state object

## File Structure

- `src/components/bc/` - Particle physics components
  - `Particle.tsx` - Core particle physics engine and rendering
  - `PairProduction.tsx` - Pair production event handler with decay chain management
  - Individual particle types (Electron, Muon, etc.)
- `src/lib/useEventStore.ts` - Zustand store for event/particle lifecycle
- `src/components/EventManager.tsx` - Top-level event spawner and cleanup
- `src/components/Bubblechamber.tsx` - Three.js canvas wrapper
