import { useState, useCallback, useMemo } from "react";
import Electron from "./Electron";
import Positron from "./Positron";
import Muon from "./Muon";
import AntiMuon from "./AntiMuon";
import { type DecayProduct } from "./Particle";

interface PairProductionProps {
  eventId: string;
  position: [number, number, number];
  bField?: number;
  initialMomentum?: number;
}

interface SpawnedParticle {
  id: string;
  type: string;
  position: [number, number, number];
  momentum: number;
  angle: number;
}

// Map particle type strings to components
const PARTICLE_COMPONENTS: Record<
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
};

export default function PairProduction({
  eventId,
  position,
  bField = 3,
  initialMomentum = 3,
}: PairProductionProps) {
  const [decayParticles, setDecayParticles] = useState<SpawnedParticle[]>([]);

  // Randomize initial conditions once at mount
  const initialConditions = useMemo(() => {
    // Random energy split: electron gets 40-60% of total energy
    const electronFraction = 0.4 + Math.random() * 0.2;
    const positronFraction = 1 - electronFraction;

    // Add some overall energy variation (±30%)
    const energyVariation = 1 + Math.random() * 25;
    const totalMomentum = initialMomentum * energyVariation;

    // Random base angle
    const baseAngle = Math.random() * Math.PI * 2;

    // Small angular asymmetry (not perfectly opposite)
    const angleSpread = 1.5;

    return {
      electronMomentum: totalMomentum * electronFraction,
      positronMomentum: totalMomentum * positronFraction,
      electronAngle: baseAngle + angleSpread,
      positronAngle: baseAngle + Math.PI - angleSpread,
    };
  }, [initialMomentum]);

  // Handle particle death and spawn decay products
  const handleDeath = useCallback(
    (info: {
      id: string;
      position: [number, number, number];
      momentum: number;
      angle: number;
      decayProducts: DecayProduct[] | null;
    }) => {
      if (!info.decayProducts) return;

      const newParticles: SpawnedParticle[] = info.decayProducts.map(
        (product, index) => ({
          id: `${info.id}_decay_${index}`,
          type: product.type,
          position: info.position,
          momentum: info.momentum * product.momentumFraction,
          angle: info.angle + (Math.random() - 0.5) * 2 * product.angleOffset,
        })
      );

      setDecayParticles((prev) => [...prev, ...newParticles]);
    },
    []
  );

  return (
    <>
      {/* Initial electron-positron pair with asymmetric energies */}
      <Electron
        id={`${eventId}_electron`}
        startPosition={position}
        initialMomentum={initialConditions.electronMomentum}
        initialAngle={initialConditions.electronAngle}
        bField={bField}
        onDeath={handleDeath}
      />
      <Positron
        id={`${eventId}_positron`}
        startPosition={position}
        initialMomentum={initialConditions.positronMomentum}
        initialAngle={initialConditions.positronAngle}
        bField={bField}
        onDeath={handleDeath}
      />

      {/* Render decay products */}
      {decayParticles.map((particle) => {
        const Component = PARTICLE_COMPONENTS[particle.type];
        if (!Component) return null;

        return (
          <Component
            key={particle.id}
            id={particle.id}
            startPosition={particle.position}
            initialMomentum={particle.momentum}
            initialAngle={particle.angle}
            bField={bField}
            onDeath={handleDeath}
          />
        );
      })}
    </>
  );
}
