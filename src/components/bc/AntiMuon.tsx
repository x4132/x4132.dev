import Particle, { type ParticleProps, type DecayConfig } from "./Particle";

type AntiMuonProps = Omit<ParticleProps, "mass" | "charge" | "color" | "decay">;

// μ+ → e+ + νe + νμ_bar
// We ignore the neutrinos since they're invisible
const ANTIMUON_DECAY: DecayConfig = {
  meanLifetime: 1.5, // simulation time units (accelerated for visual effect)
  channels: [
    {
      probability: 1.0,
      products: [
        {
          type: "positron",
          momentumFraction: 0.5,
          angleOffset: 0.3,
        },
      ],
    },
  ],
};

export default function AntiMuon(props: AntiMuonProps) {
  return (
    <Particle
      {...props}
      mass={0.1057}
      charge={1}
      color="#ffcc88"
      decay={ANTIMUON_DECAY}
    />
  );
}
