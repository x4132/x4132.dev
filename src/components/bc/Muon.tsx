import Particle, { type ParticleProps, type DecayConfig } from "./Particle";

type MuonProps = Omit<ParticleProps, "mass" | "charge" | "color" | "decay">;

// μ- → e- + νe_bar + νμ
// We ignore the neutrinos since they're invisible
const MUON_DECAY: DecayConfig = {
  meanLifetime: 1.5, // simulation time units (accelerated for visual effect)
  channels: [
    {
      probability: 1.0,
      products: [
        {
          type: "electron",
          momentumFraction: 0.5, // electron takes fraction of momentum
          angleOffset: 0.3, // some deflection angle
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
