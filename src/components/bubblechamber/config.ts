/**
 * Centralized configuration for the bubble chamber simulation
 */

export const CHAMBER_CONFIG = {
    /** Viewport bounds in world units */
    bounds: { x: 7, y: 4 },
    /** Magnetic field strength in Tesla */
    bField: 3,
    /** Event spawner settings */
    spawner: {
        /** Milliseconds between event spawns */
        spawnInterval: 3000,
        /** Maximum concurrent physics events */
        maxActiveEvents: 10,
        /** Number of events to spawn on initialization */
        initialEvents: 5,
    },
} as const;

/**
 * Physics event type weights
 * Controls which types of physics events spawn
 * Weight: Relative spawn probability (higher = more common)
 * Events with weight 0 or no valid spawner are disabled
 */
export const EVENT_WEIGHTS = [
    { type: "pair_production" as const, weight: 0.1 },
    { type: "cosmic_ray" as const, weight: 0.9 },
    // Future events with 0 weight (disabled)
    { type: "kaon_decay" as const, weight: 0 },
    { type: "v_event" as const, weight: 0 },
    { type: "muon_pair" as const, weight: 0 },
    { type: "pion_pair" as const, weight: 0 },
] as const;

export type Bounds = typeof CHAMBER_CONFIG.bounds;

/**
 * Cosmic ray particle type configurations with weights and minimum frequency guarantees
 * Weight: Relative spawn probability (higher = more common)
 * minFrequency: Guaranteed to spawn at least once per N particles
 */
export const COSMIC_RAY_CONFIGS = [
    { type: "muon" as const, weight: 3, minFrequency: 25 }, // Most common
    { type: "pion" as const, weight: 3, minFrequency: 25 }, // Most common
    { type: "pion_minus" as const, weight: 2, minFrequency: 25 }, // Common
    { type: "electron" as const, weight: 2, minFrequency: 25 }, // Common
    { type: "pion_neutral" as const, weight: 1.5, minFrequency: 25 }, // Moderate
    { type: "kaon_neutral" as const, weight: 1, minFrequency: 25 }, // Rare
    { type: "proton" as const, weight: 1, minFrequency: 25 }, // Rare
    { type: "photon" as const, weight: 1, minFrequency: 25 }, // Rare
] as const;

export type CosmicRayType = typeof COSMIC_RAY_CONFIGS[number]["type"];
