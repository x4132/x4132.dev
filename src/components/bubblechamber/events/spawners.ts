import type { EventType, ParticleSpawnData } from "../useEventStore";
import { PARTICLE_DATA, type ParticleType } from "../particles/registry";
import { CHAMBER_CONFIG, COSMIC_RAY_CONFIGS, type CosmicRayType } from "../config";
import { GuaranteedVarietySpawner } from "../utils/particleRNG";

const { bounds, bField } = CHAMBER_CONFIG;

export interface SpawnResult {
  eventId: string;
  position: [number, number, number];
  particles: ParticleSpawnData[];
}

/** Helper to create particle spawn data with registry defaults */
function createParticle(
  type: ParticleType,
  overrides: Omit<ParticleSpawnData, "type" | "mass" | "charge" | "color" | "decay">
): ParticleSpawnData {
  const data = PARTICLE_DATA[type];
  return { ...data, ...overrides, type };
}

/**
 * Spawn a pair production event (gamma -> e+ e-)
 */
export function createPairProductionEvent(
  position?: [number, number, number]
): Omit<SpawnResult, "eventId"> {

  const eventPosition: [number, number, number] = position ?? [
    (Math.random() - 0.5) * 2 * bounds.x,
    (Math.random() - 0.5) * 2 * bounds.y,
    0,
  ];

  const electronFraction = 0.4 + Math.random() * 0.2;
  const energyVariation = 0.5 + Math.random() * 5;
  const totalMomentum = 3 * energyVariation;
  const baseAngle = Math.random() * Math.PI * 2;
  const angleSpread = (Math.random() * Math.PI) / 8;

  const particles: ParticleSpawnData[] = [
    createParticle("electron", {
      startPosition: eventPosition,
      initialMomentum: totalMomentum * electronFraction,
      initialAngle: baseAngle - angleSpread,
      bField,
      energyLossRate: 0.005,
      bounds,
    }),
    createParticle("positron", {
      startPosition: eventPosition,
      initialMomentum: totalMomentum * (1 - electronFraction),
      initialAngle: baseAngle + angleSpread,
      bField,
      energyLossRate: 0.005,
      bounds,
    }),
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
  subtype?: CosmicRayType
): Omit<SpawnResult, "eventId"> {
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
  const momentum = baseMomentum * (1 + PARTICLE_DATA[selectedType].mass * 0.5);

  const particles: ParticleSpawnData[] = [
    createParticle(selectedType, {
      startPosition: position,
      initialMomentum: momentum,
      initialAngle: angle,
      bField,
      energyLossRate: 0.002,
      bounds,
    }),
  ];

  return { position, particles };
}

/**
 * Spawn a kaon decay event - K⁰ entering from viewport edge
 * Creates characteristic V-pattern when K⁰ decays to π⁺ + π⁻
 */
export function createKaonDecayEvent(): Omit<SpawnResult, "eventId"> {
  // Calculate edge spawn position and direction
  const { position, angle } = calculateEdgeSpawn(bounds);

  const momentum = 25 + Math.random() * 50;

  const particles: ParticleSpawnData[] = [
    createParticle("kaon_neutral", {
      startPosition: position,
      initialMomentum: momentum,
      initialAngle: angle,
      bField,
      energyLossRate: 0.001,
      bounds,
    }),
  ];

  return { position, particles };
}

/**
 * Event spawner registry
 */
export type EventSpawner = () => Omit<SpawnResult, "eventId">;

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
 * Type guard to check if an event type has a valid spawner
 */
export function hasValidSpawner(
  eventType: EventType
): eventType is EventType & { spawner: EventSpawner } {
  return EVENT_SPAWNERS[eventType] !== null;
}

/**
 * Get spawner for event type, returns null if not implemented
 */
export function getSpawner(eventType: EventType): EventSpawner | null {
  return EVENT_SPAWNERS[eventType];
}

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
