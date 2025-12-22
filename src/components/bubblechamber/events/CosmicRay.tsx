import { useState, useCallback, useMemo } from "react";
import { PARTICLE_COMPONENTS } from "../particles/registry";
import { type DecayProduct } from "../particles/Particle";

interface CosmicRayProps {
  eventId: string;
  position?: [number, number, number];
  bField?: number;
  bounds?: { x: number; y: number };
  subtype?: "muon" | "pion" | "electron";
}

interface SpawnedParticle {
  id: string;
  type: string;
  position: [number, number, number];
  momentum: number;
  angle: number;
}

/**
 * Calculate spawn position and angle for cosmic ray entering from viewport edge
 */
function calculateEdgeSpawn(bounds: { x: number; y: number }): {
  position: [number, number, number];
  angle: number;
} {
  const edge = Math.floor(Math.random() * 4); // 0=left, 1=right, 2=top, 3=bottom

  let position: [number, number, number];
  let baseAngle: number;

  switch (edge) {
    case 0: // left edge
      position = [-bounds.x, (Math.random() - 0.5) * 2 * bounds.y, 0];
      baseAngle = 0; // aim right
      break;
    case 1: // right edge
      position = [bounds.x, (Math.random() - 0.5) * 2 * bounds.y, 0];
      baseAngle = Math.PI; // aim left
      break;
    case 2: // bottom edge
      position = [(Math.random() - 0.5) * 2 * bounds.x, -bounds.y, 0];
      baseAngle = Math.PI / 2; // aim up
      break;
    case 3: // top edge
      position = [(Math.random() - 0.5) * 2 * bounds.x, bounds.y, 0];
      baseAngle = -Math.PI / 2; // aim down
      break;
    default:
      position = [-bounds.x, 0, 0];
      baseAngle = 0;
  }

  // Add ±15° randomization (±0.26 radians)
  const angle = baseAngle + (Math.random() - 0.5) * 0.52;

  return { position, angle };
}

export default function CosmicRay({
  eventId,
  position,
  bField = 3,
  bounds = { x: 3, y: 2 },
  subtype,
}: CosmicRayProps) {
  const [decayParticles, setDecayParticles] = useState<SpawnedParticle[]>([]);

  // Calculate initial conditions for cosmic ray
  const initialConditions = useMemo(() => {
    // If no position provided, calculate edge spawn (for cosmic rays)
    // If position provided, use it (for explicit positioning)
    const { position: spawnPos, angle } = !position
      ? calculateEdgeSpawn(bounds)
      : { position, angle: Math.random() * Math.PI * 2 };

    // Select particle type if not provided
    const particleTypes: Array<"muon" | "pion" | "electron"> = [
      "muon",
      "pion",
      "electron",
    ];
    const selectedType =
      subtype ?? particleTypes[Math.floor(Math.random() * particleTypes.length)];

    // Set momentum based on particle type
    let momentum: number;
    if (selectedType === "electron") {
      momentum = 4 + Math.random() * 4; // 4-8 GeV (longer spirals)
    } else {
      momentum = 8 + Math.random() * 8; // 8-16 GeV (very long tracks)
    }

    return {
      type: selectedType,
      position: spawnPos,
      momentum,
      angle,
    };
  }, [position, bounds, subtype]);

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

  // Get the particle component for the initial cosmic ray
  const ParticleComponent = PARTICLE_COMPONENTS[initialConditions.type];

  if (!ParticleComponent) {
    console.warn(`Unknown particle type: ${initialConditions.type}`);
    return null;
  }

  return (
    <>
      {/* Initial cosmic ray particle */}
      <ParticleComponent
        id={`${eventId}_${initialConditions.type}`}
        startPosition={initialConditions.position}
        initialMomentum={initialConditions.momentum}
        initialAngle={initialConditions.angle}
        bField={bField}
        bounds={bounds}
        energyLossRate={0.002}
        onDeath={handleDeath}
      />

      {/* Dynamically spawned decay products */}
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
            bounds={bounds}
            energyLossRate={0.002}
            onDeath={handleDeath}
          />
        );
      })}
    </>
  );
}
