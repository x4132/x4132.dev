import Particle, { type ParticleProps } from "./Particle";

type PositronProps = Omit<ParticleProps, "mass" | "charge" | "color" | "decay">;

export default function Positron(props: PositronProps) {
  return (
    <Particle
      {...props}
      mass={0.000511}
      charge={1}
      color="#ff88cc"
      decay={undefined}
    />
  );
}
