import { create } from "zustand";

// Re-export particle types from registry (single source of truth)
export type {
  ParticleType,
  DecayProduct,
  DecayConfig,
} from "./particles/registry";

import type { ParticleType, DecayConfig } from "./particles/registry";

export type EventType =
  | "pair_production"
  | "cosmic_ray"
  | "kaon_decay"
  | "v_event"
  | "muon_pair"
  | "pion_pair";

export type ParticleStatus =
  | "active"
  | "decayed"
  | "stopped"
  | "exited"
  | "faded";

export interface ParticleRecord {
  id: string;
  eventId: string;
  parentId: string | null;
  type: ParticleType;
  status: ParticleStatus;
  createdAt: number;
  startPosition: [number, number, number];
  initialMomentum: number;
  initialAngle: number;
  mass: number;
  charge: number;
  color: string;
  decay: DecayConfig | undefined;
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

  spawnEvent: (type: EventType, position: [number, number, number]) => string;

  spawnParticles: (eventId: string, particles: ParticleSpawnData[]) => string[];
  markParticleDecayed: (particleId: string) => void;
  markParticleStopped: (particleId: string) => void;
  markParticleExited: (particleId: string) => void;
  markParticleFaded: (particleId: string) => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: new Map(),
  particles: new Map(),

  spawnEvent: (type, position) => {
    const id = `event_${crypto.randomUUID().slice(0, 8)}`;
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
        const id = `particle_${crypto.randomUUID().slice(0, 8)}`;
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

  markParticleStopped: (particleId) => {
    set((state) => {
      const particles = new Map(state.particles);
      const particle = particles.get(particleId);
      if (particle && particle.status === "active") {
        particles.set(particleId, { ...particle, status: "stopped" });
      }
      return { particles };
    });
  },

  markParticleExited: (particleId) => {
    set((state) => {
      const particles = new Map(state.particles);
      const particle = particles.get(particleId);
      if (particle && particle.status === "active") {
        particles.set(particleId, { ...particle, status: "exited" });
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

      particles.set(particleId, { ...particle, status: "faded" });

      // Garbage collect event when all particles faded
      const event = events.get(particle.eventId);
      if (event) {
        const allFaded = event.particleIds.every((id) => {
          const p = particles.get(id);
          return p && p.status === "faded";
        });

        if (allFaded) {
          for (const id of event.particleIds) {
            particles.delete(id);
          }
          events.delete(particle.eventId);
        }
      }

      return { particles, events };
    });
  },
}));
