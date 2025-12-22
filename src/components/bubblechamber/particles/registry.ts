import Electron from "./Electron";
import Positron from "./Positron";
import Muon from "./Muon";
import AntiMuon from "./AntiMuon";
import Pion from "./Pion";
import Proton from "./Proton";
import { type DecayProduct } from "./Particle";

export const PARTICLE_COMPONENTS: Record<
  string,
  React.ComponentType<{
    id?: string;
    startPosition?: [number, number, number];
    initialMomentum?: number;
    initialAngle?: number;
    bField?: number;
    onDeath?: (info: {
      id: string;
      position: [number, number, number];
      momentum: number;
      angle: number;
      decayProducts: DecayProduct[] | null;
    }) => void;
  }>
> = {
  electron: Electron,
  positron: Positron,
  muon: Muon,
  antimuon: AntiMuon,
  pion: Pion,
  proton: Proton,
};
