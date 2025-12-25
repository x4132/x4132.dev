import type { EventType, ParticleSpawnData } from "../../../lib/useEventStore";
import { PARTICLE_DATA } from "../particles/registry";
import {
  GuaranteedVarietySpawner,
  type ParticleTypeConfig,
} from "../../../lib/particleRNG";

export interface EventConfig {
  bounds: { x: number; y: number };
  bField: number;
}

export interface SpawnResult {
  eventId: string;
  position: [number, number, number];
  particles: ParticleSpawnData[];
}

/**
 * Spawn a pair production event (gamma -> e+ e-)
 */
export function createPairProductionEvent(
  config: EventConfig,
  position?: [number, number, number]
): Omit<SpawnResult, "eventId"> {
  const { bounds, bField } = config;

  // Random position if not provided
  const eventPosition: [number, number, number] = position ?? [
    (Math.random() - 0.5) * 2 * bounds.x,
    (Math.random() - 0.5) * 2 * bounds.y,
    0,
  ];

  // Calculate initial conditions with energy asymmetry
  const electronFraction = 0.4 + Math.random() * 0.2;
  const positronFraction = 1 - electronFraction;

  const energyVariation = 0.5 + Math.random() * 5;
  const totalMomentum = 3 * energyVariation;
  const baseAngle = Math.random() * Math.PI * 2;
  const angleSpread = (Math.random() * Math.PI) / 8;

  const electronData = PARTICLE_DATA.electron;
  const positronData = PARTICLE_DATA.positron;

  const particles: ParticleSpawnData[] = [
    {
      type: "electron",
      startPosition: eventPosition,
      initialMomentum: totalMomentum * electronFraction,
      initialAngle: baseAngle - angleSpread,
      mass: electronData.mass,
      charge: electronData.charge,
      color: electronData.color,
      decay: electronData.decay,
      bField,
      energyLossRate: 0.005,
      bounds,
    },
    {
      type: "positron",
      startPosition: eventPosition,
      initialMomentum: totalMomentum * positronFraction,
      initialAngle: baseAngle + angleSpread,
      mass: positronData.mass,
      charge: positronData.charge,
      color: positronData.color,
      decay: positronData.decay,
      bField,
      energyLossRate: 0.005,
      bounds,
    },
  ];

  return { position: eventPosition, particles };
}

/**
 * Calculate spawn position and angle for cosmic ray entering from viewport edge
 */
function calculateEdgeSpawn(bounds: { x: number; y: number }): {
  position: [number, number, number];
  angle: number;
} {
  const edge = Math.floor(Math.random() * 4);

  let position: [number, number, number];
  let baseAngle: number;

  switch (edge) {
    case 0: // left edge
      position = [-bounds.x, (Math.random() - 0.5) * 2 * bounds.y, 0];
      baseAngle = 0; // aim right
      break;
    case 1: // right edge
      position = [bounds.x, (Math.random() - 0.5) * 2 * bounds.y, 0];
      baseAngle = Math.PI; // aim left
      break;
    case 2: // bottom edge
      position = [(Math.random() - 0.5) * 2 * bounds.x, -bounds.y, 0];
      baseAngle = Math.PI / 2; // aim up
      break;
    case 3: // top edge
      position = [(Math.random() - 0.5) * 2 * bounds.x, bounds.y, 0];
      baseAngle = -Math.PI / 2; // aim down
      break;
    default:
      position = [-bounds.x, 0, 0];
      baseAngle = 0;
  }

  // Add ±15° randomization
  const angle = baseAngle + (Math.random() - 0.5) * 0.52;

  return { position, angle };
}

type CosmicRayType =
  | "muon"
  | "pion"
  | "pion_minus"
  | "pion_neutral"
  | "electron"
  | "kaon_neutral"
  | "proton"
  | "photon";

/**
/**
 * Cosmic ray particle type configurations with weights and minimum frequency guarantees
 * Weight: Relative spawn probability (higher = more common)
 * minFrequency: Guaranteed to spawn at least once per N particles
 */
const COSMIC_RAY_CONFIGS: ParticleTypeConfig<CosmicRayType>[] = [
  { type: "muon", weight: 3, minFrequency: 25 }, // Most common
  { type: "pion", weight: 3, minFrequency: 25 }, // Most common
  { type: "pion_minus", weight: 2, minFrequency: 25 }, // Common
  { type: "electron", weight: 2, minFrequency: 25 }, // Common
  { type: "pion_neutral", weight: 1.5, minFrequency: 25 }, // Moderate
  { type: "kaon_neutral", weight: 1, minFrequency: 25 }, // Rare
  { type: "proton", weight: 1, minFrequency: 25 }, // Rare
  { type: "photon", weight: 1, minFrequency: 25 }, // Rare
];

/**
 * Global cosmic ray spawner with guaranteed variety
 * Persists across events to ensure long-term particle type diversity
 */
const cosmicRaySpawner = new GuaranteedVarietySpawner(
  COSMIC_RAY_CONFIGS,
  42 // Fixed seed for consistent but varied spawns
);

/**
 * Spawn a cosmic ray event with varied momentum
 * Momentum categories:
 * - Low: 1-4 GeV (tight spirals for charged particles)
 * - Medium: 4-12 GeV (moderate curves)
 * - High: 12-25 GeV (nearly straight tracks)
 */
export function createCosmicRayEvent(
  config: EventConfig,
  subtype?: CosmicRayType
): Omit<SpawnResult, "eventId"> {
  const { bounds, bField } = config;

  // Calculate edge spawn position and direction
  const { position, angle } = calculateEdgeSpawn(bounds);

  // Select particle type using guaranteed variety spawner
  // Ensures all particle types spawn at minimum frequency (1 per 25 particles)
  // Uses weighted random selection with fake RNG for deterministic variety
  const selectedType = subtype ?? cosmicRaySpawner.selectNext();

  // Momentum distribution: mix of low, medium, and high
  // 15% low (8-15), 50% medium (15-40), 35% high (40-100)
  const momentumRoll = Math.random();
  let baseMomentum: number;
  if (momentumRoll < 0.15) {
    // Low momentum - visible spirals
    baseMomentum = 8 + Math.random() * 7;
  } else if (momentumRoll < 0.65) {
    // Medium momentum - gentle curves
    baseMomentum = 15 + Math.random() * 25;
  } else {
    // High momentum - nearly straight, crosses viewport
    baseMomentum = 40 + Math.random() * 60;
  }

  // Scale momentum based on particle mass (heavier particles need more momentum)
  const particleData = PARTICLE_DATA[selectedType];
  const momentum = baseMomentum * (1 + particleData.mass * 0.5);

  const particles: ParticleSpawnData[] = [
    {
      type: selectedType,
      startPosition: position,
      initialMomentum: momentum,
      initialAngle: angle,
      mass: particleData.mass,
      charge: particleData.charge,
      color: particleData.color,
      decay: particleData.decay,
      bField,
      energyLossRate: 0.002,
      bounds,
    },
  ];

  return { position, particles };
}

/**
 * Spawn a kaon decay event - K⁰ entering from viewport edge
 * Creates characteristic V-pattern when K⁰ decays to π⁺ + π⁻
 */
export function createKaonDecayEvent(
  config: EventConfig
): Omit<SpawnResult, "eventId"> {
  const { bounds, bField } = config;

  // Calculate edge spawn position and direction
  const { position, angle } = calculateEdgeSpawn(bounds);

  // Kaons typically have medium-high momentum
  const momentum = 25 + Math.random() * 50;

  const particleData = PARTICLE_DATA.kaon_neutral;

  const particles: ParticleSpawnData[] = [
    {
      type: "kaon_neutral",
      startPosition: position,
      initialMomentum: momentum,
      initialAngle: angle,
      mass: particleData.mass,
      charge: particleData.charge,
      color: particleData.color,
      decay: particleData.decay,
      bField,
      energyLossRate: 0.001, // Lower energy loss for neutral particle
      bounds,
    },
  ];

  return { position, particles };
}

/**
 * Event spawner registry
 */
export type EventSpawner = (
  config: EventConfig
) => Omit<SpawnResult, "eventId">;

export const EVENT_SPAWNERS: Record<EventType, EventSpawner | null> = {
  pair_production: createPairProductionEvent,
  cosmic_ray: createCosmicRayEvent,
  kaon_decay: createKaonDecayEvent,
  // Placeholder for future events
  v_event: null,
  muon_pair: null,
  pion_pair: null,
};

/**
 * Get cosmic ray spawn statistics for debugging/analysis
 * Returns object with counts of each particle type spawned
 */
export function getCosmicRayStats() {
  return {
    stats: cosmicRaySpawner.getStats(),
    totalSpawned: cosmicRaySpawner.getTotalSpawned(),
    history: cosmicRaySpawner.getHistory(),
  };
}
