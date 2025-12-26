import type {
  ParticleType,
  DecayConfig,
} from "@/components/bubblechamber/particles/registry";
import type { Vector3 } from "three";
import { create } from "zustand";

export type EventType =
  | "pair_production"
  | "cosmic_ray"
  | "kaon_decay"
  | "v_event"
  | "muon_pair"
  | "pion_pair";

/**
 * Particle lifecycle status:
 * - active: Currently simulating physics
 * - decayed: Underwent radioactive decay (spawned daughter particles)
 * - stopped: Lost momentum below threshold
 * - exited: Left viewport bounds
 * - faded: Visual fade complete, ready for garbage collection
 */
export type ParticleStatus =
  | "active"
  | "decayed"
  | "stopped"
  | "exited"
  | "faded";

export type ParticleEvent = {
  id: string;
  type: EventType;
};

export type Particle = {
  id: string;
  status: ParticleStatus;

  // Initial Parameters
  startPosition: Vector3;
  initialMomentum: number;
  initialAngle: number; // Radians
};

type Events = {
  events: Map<string, ParticleEvent>;
  particles: Map<string, Particle>;
};

export const useEvents = create((set, get) => ({
  events: new Map(),
  particles: new Map(),
}));
