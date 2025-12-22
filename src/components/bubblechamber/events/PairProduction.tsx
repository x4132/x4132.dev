import { useState, useCallback, useMemo } from "react";
import Electron from "../particles/Electron";
import Positron from "../particles/Positron";
import { PARTICLE_COMPONENTS } from "../particles/registry";
import { type DecayProduct } from "../particles/Particle";

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

export default function PairProduction({
  eventId,
  position,
  bField = 3,
  initialMomentum = 3,
}: PairProductionProps) {
  const [decayParticles, setDecayParticles] = useState<SpawnedParticle[]>([]);

  const initialConditions = useMemo(() => {
    const electronFraction = 0.4 + Math.random() * 0.2;
    const positronFraction = 1 - electronFraction;

    const energyVariation = 0.5 + Math.random() * 5;
    const totalMomentum = initialMomentum * energyVariation;
    const baseAngle = Math.random() * Math.PI * 2;
    const angleSpread = Math.random() * Math.PI / 8;

    return {
      electronMomentum: totalMomentum * electronFraction,
      positronMomentum: totalMomentum * positronFraction,
      electronAngle: baseAngle - angleSpread,
      positronAngle: baseAngle + angleSpread,
    };
  }, [initialMomentum]);

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
