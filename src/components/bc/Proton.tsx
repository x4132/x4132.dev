import Particle, { type ParticleProps } from "./Particle";

type ProtonProps = Omit<ParticleProps, "mass" | "charge" | "color" | "decay">;

// Proton is stable - no decay
export default function Proton(props: ProtonProps) {
  return (
    <Particle
      {...props}
      mass={0.9383}
      charge={1}
      color="#ff8888"
      decay={undefined}
    />
  );
}
