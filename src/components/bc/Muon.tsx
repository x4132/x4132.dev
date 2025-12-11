import Particle, { type ParticleProps } from "./Particle";

type MuonProps = Omit<ParticleProps, "mass" | "charge" | "color">;

export default function Muon(props: MuonProps) {
  return <Particle {...props} mass={0.1057} charge={-1} color="#88ffcc" />;
}
