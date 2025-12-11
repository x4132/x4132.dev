import Particle, { type ParticleProps, type DecayConfig } from "./Particle";

type PionProps = Omit<ParticleProps, "mass" | "charge" | "color" | "decay">;

// π+ → μ+ + νμ (99.99% branching ratio)
// We ignore the neutrino since it's invisible
const PION_DECAY: DecayConfig = {
  meanLifetime: 0.5, // simulation time units (accelerated for visual effect)
  channels: [
    {
      probability: 0.9999,
      products: [
        {
          type: "antimuon",
          momentumFraction: 0.8,
          angleOffset: 0.1, // small deflection
        },
      ],
    },
  ],
};

export default function Pion(props: PionProps) {
  return (
    <Particle
      {...props}
      mass={0.1396}
      charge={1}
      color="#ccff88"
      decay={PION_DECAY}
    />
  );
}
