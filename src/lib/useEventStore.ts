import { create } from "zustand";

export type EventType =
  | "pair_production"
  | "cosmic_ray"
  | "kaon_decay"
  | "v_event"
  | "muon_pair"
  | "pion_pair";

export type ParticleType =
  | "electron"
  | "positron"
  | "muon"
  | "antimuon"
  | "pion"
  | "pion_minus"
  | "pion_neutral"
  | "kaon_neutral"
  | "photon"
  | "proton";

export type ParticleStatus = "active" | "decayed" | "faded";

export interface DecayProduct {
  type: ParticleType;
  momentumFraction: number;
  angleOffset: number;
}

export interface DecayConfig {
  meanLifetime: number;
  channels: Array<{
    probability: number;
    products: DecayProduct[];
  }>;
}

/**
 * Static particle properties (don't change after creation)
 */
export interface ParticleRecord {
  id: string;
  eventId: string;
  parentId: string | null;
  type: ParticleType;
  status: ParticleStatus;
  createdAt: number;
  // Initial conditions for rendering
  startPosition: [number, number, number];
  initialMomentum: number;
  initialAngle: number;
  // Physics properties
  mass: number;
  charge: number;
  color: string;
  decay: DecayConfig | undefined;
  // Simulation parameters
  bField: number;
  energyLossRate: number;
  bounds: { x: number; y: number } | undefined;
}

export interface PhysicsEvent {
  id: string;
  type: EventType;
  position: [number, number, number];
  createdAt: number;
  particleIds: string[];
}

/**
 * Data needed to spawn a new particle
 */
export interface ParticleSpawnData {
  type: ParticleType;
  parentId?: string | null;
  startPosition: [number, number, number];
  initialMomentum: number;
  initialAngle: number;
  mass: number;
  charge: number;
  color: string;
  decay?: DecayConfig;
  bField: number;
  energyLossRate?: number;
  bounds?: { x: number; y: number };
}

interface EventStore {
  events: Map<string, PhysicsEvent>;
  particles: Map<string, ParticleRecord>;

  // Event lifecycle
  spawnEvent: (type: EventType, position: [number, number, number]) => string;
  cleanup: (eventId: string) => void;

  // Particle lifecycle
  spawnParticles: (eventId: string, particles: ParticleSpawnData[]) => string[];
  markParticleDecayed: (particleId: string) => void;
  markParticleFaded: (particleId: string) => void;

  // Queries
  getActiveEvents: () => PhysicsEvent[];
  getEventParticles: (eventId: string) => ParticleRecord[];
  getAllActiveParticles: () => ParticleRecord[];
}

let eventCounter = 0;
let particleCounter = 0;

const generateEventId = () => `event_${++eventCounter}`;
const generateParticleId = () => `particle_${++particleCounter}`;

export const useEventStore = create<EventStore>((set, get) => ({
  events: new Map(),
  particles: new Map(),

  spawnEvent: (type, position) => {
    const id = generateEventId();
    const event: PhysicsEvent = {
      id,
      type,
      position,
      createdAt: Date.now(),
      particleIds: [],
    };

    set((state) => {
      const events = new Map(state.events);
      events.set(id, event);
      return { events };
    });

    return id;
  },

  spawnParticles: (eventId, particlesData) => {
    const ids: string[] = [];

    set((state) => {
      const particles = new Map(state.particles);
      const events = new Map(state.events);
      const event = events.get(eventId);

      if (!event) {
        console.warn(`Cannot spawn particles: event ${eventId} not found`);
        return state;
      }

      const newParticleIds: string[] = [];

      for (const data of particlesData) {
        const id = generateParticleId();
        ids.push(id);
        newParticleIds.push(id);

        const record: ParticleRecord = {
          id,
          eventId,
          parentId: data.parentId ?? null,
          type: data.type,
          status: "active",
          createdAt: Date.now(),
          startPosition: data.startPosition,
          initialMomentum: data.initialMomentum,
          initialAngle: data.initialAngle,
          mass: data.mass,
          charge: data.charge,
          color: data.color,
          decay: data.decay,
          bField: data.bField,
          energyLossRate: data.energyLossRate ?? 0.005,
          bounds: data.bounds,
        };

        particles.set(id, record);
      }

      events.set(eventId, {
        ...event,
        particleIds: [...event.particleIds, ...newParticleIds],
      });

      return { particles, events };
    });

    return ids;
  },

  markParticleDecayed: (particleId) => {
    set((state) => {
      const particles = new Map(state.particles);
      const particle = particles.get(particleId);
      if (particle && particle.status === "active") {
        particles.set(particleId, { ...particle, status: "decayed" });
      }
      return { particles };
    });
  },

  markParticleFaded: (particleId) => {
    set((state) => {
      const particles = new Map(state.particles);
      const events = new Map(state.events);

      const particle = particles.get(particleId);
      if (!particle) return state;

      // Mark particle as faded
      particles.set(particleId, { ...particle, status: "faded" });

      // Check if all particles in the event are faded (garbage collection)
      const event = events.get(particle.eventId);
      if (event) {
        const allFaded = event.particleIds.every((id) => {
          const p = particles.get(id);
          return p && p.status === "faded";
        });

        if (allFaded) {
          // Clean up the entire event
          for (const id of event.particleIds) {
            particles.delete(id);
          }
          events.delete(particle.eventId);
        }
      }

      return { particles, events };
    });
  },

  cleanup: (eventId) => {
    set((state) => {
      const events = new Map(state.events);
      const particles = new Map(state.particles);

      const event = events.get(eventId);
      if (event) {
        for (const particleId of event.particleIds) {
          particles.delete(particleId);
        }
        events.delete(eventId);
      }

      return { events, particles };
    });
  },

  getActiveEvents: () => {
    return Array.from(get().events.values());
  },

  getEventParticles: (eventId) => {
    const event = get().events.get(eventId);
    if (!event) return [];

    return event.particleIds
      .map((id) => get().particles.get(id))
      .filter((p): p is ParticleRecord => p !== undefined);
  },

  getAllActiveParticles: () => {
    return Array.from(get().particles.values()).filter(
      (p) => p.status !== "faded"
    );
  },
}));
