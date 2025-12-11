import { create } from "zustand";

export type EventType = "pair_production" | "decay_chain";

export interface PhysicsEvent {
  id: string;
  type: EventType;
  position: [number, number, number];
  createdAt: number;
  particleIds: string[];
}

export interface ParticleRecord {
  id: string;
  eventId: string;
  parentId: string | null;
  type: string;
  alive: boolean;
  createdAt: number;
}

interface EventStore {
  events: Map<string, PhysicsEvent>;
  particles: Map<string, ParticleRecord>;

  // Actions
  spawnEvent: (type: EventType, position: [number, number, number]) => string;
  registerParticle: (
    eventId: string,
    parentId: string | null,
    type: string
  ) => string;
  onParticleDeath: (
    particleId: string,
    decayProducts?: Array<{
      type: string;
      position: [number, number, number];
      momentum: number;
      angle: number;
    }>
  ) => void;
  cleanup: (eventId: string) => void;
  getActiveEvents: () => PhysicsEvent[];
  getEventParticles: (eventId: string) => ParticleRecord[];
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

  registerParticle: (eventId, parentId, type) => {
    const id = generateParticleId();
    const record: ParticleRecord = {
      id,
      eventId,
      parentId,
      type,
      alive: true,
      createdAt: Date.now(),
    };

    set((state) => {
      const particles = new Map(state.particles);
      particles.set(id, record);

      const events = new Map(state.events);
      const event = events.get(eventId);
      if (event) {
        events.set(eventId, {
          ...event,
          particleIds: [...event.particleIds, id],
        });
      }

      return { particles, events };
    });

    return id;
  },

  onParticleDeath: (particleId, _decayProducts) => {
    set((state) => {
      const particles = new Map(state.particles);
      const particle = particles.get(particleId);
      if (particle) {
        particles.set(particleId, { ...particle, alive: false });
      }
      return { particles };
    });

    // Note: Decay products are spawned by the particle component itself
    // This callback just marks the parent as dead
    // The decayProducts param is reserved for future use (e.g., analytics)
  },

  cleanup: (eventId) => {
    set((state) => {
      const events = new Map(state.events);
      const particles = new Map(state.particles);

      const event = events.get(eventId);
      if (event) {
        // Remove all particles belonging to this event
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
}));
