import Particle, { type ParticleProps } from "./Particle";

type ElectronProps = Omit<ParticleProps, "mass" | "charge" | "color" | "decay">;

export default function Electron(props: ElectronProps) {
  return (
    <Particle
      {...props}
      mass={0.000511}
      charge={-1}
      color="#88ccff"
      decay={undefined}
    />
  );
}
