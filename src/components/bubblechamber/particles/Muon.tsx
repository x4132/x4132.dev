import Particle, { type ParticleProps, type DecayConfig } from "./Particle";

type MuonProps = Omit<ParticleProps, "mass" | "charge" | "color" | "decay">;

const MUON_DECAY: DecayConfig = {
  meanLifetime: 1.5,
  channels: [
    {
      probability: 1.0,
      products: [
        {
          type: "electron",
          momentumFraction: 0.5,
          angleOffset: 0.3,
        },
      ],
    },
  ],
};

export default function Muon(props: MuonProps) {
  return (
    <Particle
      {...props}
      mass={0.1057}
      charge={-1}
      color="#88ffcc"
      decay={MUON_DECAY}
    />
  );
}
