import Particle, { type ParticleProps } from "./Particle";

type PionProps = Omit<ParticleProps, "mass" | "charge" | "color">;

export default function Pion(props: PionProps) {
  return <Particle {...props} mass={0.1396} charge={1} color="#ccff88" />;
}
