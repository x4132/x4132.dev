export const CHAMBER_CONFIG = {
    bounds: { x: 7, y: 4 },
    bField: 3, // Tesla
    spawner: {
        spawnInterval: 3000,
        maxActiveEvents: 10,
        initialEvents: 5,
    },
} as const;

export const EVENT_WEIGHTS = [
    { type: "pair_production" as const, weight: 0.1 },
    { type: "cosmic_ray" as const, weight: 0.9 },
    { type: "kaon_decay" as const, weight: 0 },
    { type: "v_event" as const, weight: 0 },
    { type: "muon_pair" as const, weight: 0 },
    { type: "pion_pair" as const, weight: 0 },
] as const;

export type Bounds = typeof CHAMBER_CONFIG.bounds;

export const COSMIC_RAY_CONFIGS = [
    { type: "muon" as const, weight: 3, minFrequency: 25 },
    { type: "pion" as const, weight: 3, minFrequency: 25 },
    { type: "pion_minus" as const, weight: 2, minFrequency: 25 },
    { type: "electron" as const, weight: 2, minFrequency: 25 },
    { type: "pion_neutral" as const, weight: 1.5, minFrequency: 25 },
    { type: "kaon_neutral" as const, weight: 1, minFrequency: 25 },
    { type: "proton" as const, weight: 1, minFrequency: 25 },
    { type: "photon" as const, weight: 1, minFrequency: 25 },
] as const;

export type CosmicRayType = typeof COSMIC_RAY_CONFIGS[number]["type"];
