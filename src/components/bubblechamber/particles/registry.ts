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

export type ParticleData = {
  type: ParticleType;
  mass: number;
  charge: number;
  color: string;
  decay?: DecayConfig;
};

export type DecayConfig = {
  meanLifetime: number;
  channels: Array<{
    probability: number;
    products: DecayProduct[];
  }>;
};

export type DecayProduct = {
  type: ParticleType;
  momentumFraction: number;
  angleOffset: number;
};

const MUON_DECAY: DecayConfig = {
  meanLifetime: 1.5,
  channels: [
    {
      probability: 1.0,
      products: [{ type: "electron", momentumFraction: 0.5, angleOffset: 0.3 }],
    },
  ],
};

const ANTIMUON_DECAY: DecayConfig = {
  meanLifetime: 1.5,
  channels: [
    {
      probability: 1.0,
      products: [{ type: "positron", momentumFraction: 0.5, angleOffset: 0.3 }],
    },
  ],
};

// π+ → μ+ + νμ
const PION_PLUS_DECAY: DecayConfig = {
  meanLifetime: 0.5,
  channels: [
    {
      probability: 0.9999,
      products: [{ type: "antimuon", momentumFraction: 0.8, angleOffset: 0.1 }],
    },
  ],
};

// π- → μ- + anti-νμ
const PION_MINUS_DECAY: DecayConfig = {
  meanLifetime: 0.5,
  channels: [
    {
      probability: 0.9999,
      products: [{ type: "muon", momentumFraction: 0.8, angleOffset: 0.1 }],
    },
  ],
};

// π⁰ → γ + γ
const PION_NEUTRAL_DECAY: DecayConfig = {
  meanLifetime: 0.1,
  channels: [
    {
      probability: 1.0,
      products: [
        { type: "photon", momentumFraction: 0.5, angleOffset: 0.3 },
        { type: "photon", momentumFraction: 0.5, angleOffset: 0.3 },
      ],
    },
  ],
};

// K⁰_S → π+ + π- (69%) or π⁰ + π⁰ (31%)
const KAON_NEUTRAL_DECAY: DecayConfig = {
  meanLifetime: 0.8,
  channels: [
    {
      probability: 0.69,
      products: [
        { type: "pion", momentumFraction: 0.5, angleOffset: 0.2 },
        { type: "pion_minus", momentumFraction: 0.5, angleOffset: 0.2 },
      ],
    },
    {
      probability: 0.31,
      products: [
        { type: "pion_neutral", momentumFraction: 0.5, angleOffset: 0.2 },
        { type: "pion_neutral", momentumFraction: 0.5, angleOffset: 0.2 },
      ],
    },
  ],
};

export const PARTICLE_DATA: Record<ParticleType, ParticleData> = {
  electron: {
    type: "electron",
    mass: 0.000511,
    charge: -1,
    color: "#88ccff",
    decay: undefined,
  },
  positron: {
    type: "positron",
    mass: 0.000511,
    charge: 1,
    color: "#ff88cc",
    decay: undefined,
  },
  muon: {
    type: "muon",
    mass: 0.1057,
    charge: -1,
    color: "#88ffcc",
    decay: MUON_DECAY,
  },
  antimuon: {
    type: "antimuon",
    mass: 0.1057,
    charge: 1,
    color: "#ffcc88",
    decay: ANTIMUON_DECAY,
  },
  pion: {
    type: "pion",
    mass: 0.1396,
    charge: 1,
    color: "#ccff88",
    decay: PION_PLUS_DECAY,
  },
  pion_minus: {
    type: "pion_minus",
    mass: 0.1396,
    charge: -1,
    color: "#88ff88",
    decay: PION_MINUS_DECAY,
  },
  pion_neutral: {
    type: "pion_neutral",
    mass: 0.135,
    charge: 0,
    color: "#ffff88",
    decay: PION_NEUTRAL_DECAY,
  },
  kaon_neutral: {
    type: "kaon_neutral",
    mass: 0.498,
    charge: 0,
    color: "#aa88ff",
    decay: KAON_NEUTRAL_DECAY,
  },
  photon: {
    type: "photon",
    mass: 0,
    charge: 0,
    color: "#ffffaa",
    decay: undefined,
  },
  proton: {
    type: "proton",
    mass: 0.9383,
    charge: 1,
    color: "#ff8888",
    decay: undefined,
  },
};
