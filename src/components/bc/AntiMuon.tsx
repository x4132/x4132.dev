import Particle, { type ParticleProps } from "./Particle";

type AntiMuonProps = Omit<ParticleProps, "mass" | "charge" | "color">;

export default function AntiMuon(props: AntiMuonProps) {
  return <Particle {...props} mass={0.1057} charge={1} color="#ffcc88" />;
}
