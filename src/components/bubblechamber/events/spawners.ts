import type { EventType, ParticleSpawnData } from "../useEventStore";
import { PARTICLE_DATA, type ParticleType } from "../particles/registry";
import {
  CHAMBER_CONFIG,
  COSMIC_RAY_CONFIGS,
  EVENT_WEIGHTS,
  type CosmicRayType,
} from "../config";
import { GuaranteedVarietySpawner } from "../utils/particleRNG";

const { bounds, bField } = CHAMBER_CONFIG;

export interface SpawnResult {
  eventId: string;
  position: [number, number, number];
  particles: ParticleSpawnData[];
}

function createParticle(
  type: ParticleType,
  overrides: Omit<
    ParticleSpawnData,
    "type" | "mass" | "charge" | "color" | "decay"
  >
): ParticleSpawnData {
  const data = PARTICLE_DATA[type];
  return { ...data, ...overrides, type };
}

// γ → e⁺ + e⁻
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

function calculateEdgeSpawn(bounds: { x: number; y: number }): {
  position: [number, number, number];
  angle: number;
} {
  const edge = Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3;

  let position: [number, number, number];
  let baseAngle: number;

  switch (edge) {
    case 0: // left
      position = [-bounds.x, (Math.random() - 0.5) * 2 * bounds.y, 0];
      baseAngle = 0;
      break;
    case 1: // right
      position = [bounds.x, (Math.random() - 0.5) * 2 * bounds.y, 0];
      baseAngle = Math.PI;
      break;
    case 2: // bottom
      position = [(Math.random() - 0.5) * 2 * bounds.x, -bounds.y, 0];
      baseAngle = Math.PI / 2;
      break;
    case 3: // top
      position = [(Math.random() - 0.5) * 2 * bounds.x, bounds.y, 0];
      baseAngle = -Math.PI / 2;
      break;
  }

  return { position, angle: baseAngle + (Math.random() - 0.5) * 0.52 };
}

const cosmicRaySpawner = new GuaranteedVarietySpawner(COSMIC_RAY_CONFIGS, 42);

export function createCosmicRayEvent(
  subtype?: CosmicRayType
): Omit<SpawnResult, "eventId"> {
  const { position, angle } = calculateEdgeSpawn(bounds);
  const selectedType = subtype ?? cosmicRaySpawner.selectNext();

  // Momentum distribution: 15% low, 50% medium, 35% high
  const momentumRoll = Math.random();
  let baseMomentum: number;
  if (momentumRoll < 0.15) {
    baseMomentum = 8 + Math.random() * 7;
  } else if (momentumRoll < 0.65) {
    baseMomentum = 15 + Math.random() * 25;
  } else {
    baseMomentum = 40 + Math.random() * 60;
  }

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

// K⁰ → π⁺ + π⁻ (V-pattern decay)
export function createKaonDecayEvent(): Omit<SpawnResult, "eventId"> {
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

export type EventSpawner = () => Omit<SpawnResult, "eventId">;

export const EVENT_SPAWNERS: Record<EventType, EventSpawner | null> = {
  pair_production: createPairProductionEvent,
  cosmic_ray: createCosmicRayEvent,
  kaon_decay: createKaonDecayEvent,
  v_event: null,
  muon_pair: null,
  pion_pair: null,
};

export function hasValidSpawner(
  eventType: EventType
): eventType is EventType & { spawner: EventSpawner } {
  return EVENT_SPAWNERS[eventType] !== null;
}

export function selectEventType(): EventType {
  const activeEvents = EVENT_WEIGHTS.filter(
    (e) => e.weight > 0 && hasValidSpawner(e.type)
  );

  if (activeEvents.length === 0) return "pair_production";

  const totalWeight = activeEvents.reduce((sum, e) => sum + e.weight, 0);
  const rand = Math.random() * totalWeight;
  let cumulative = 0;

  for (const event of activeEvents) {
    cumulative += event.weight;
    if (rand < cumulative) {
      return event.type;
    }
  }

  return activeEvents[0].type;
}

export function getSpawner(eventType: EventType): EventSpawner | null {
  return EVENT_SPAWNERS[eventType];
}

export function getCosmicRayStats() {
  return {
    stats: cosmicRaySpawner.getStats(),
    totalSpawned: cosmicRaySpawner.getTotalSpawned(),
    history: cosmicRaySpawner.getHistory(),
  };
}
