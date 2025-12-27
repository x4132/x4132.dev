import { Canvas } from "@react-three/fiber";
import { useEffect, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { useEventStore, type EventType } from "./useEventStore";
import Particle from "./particles/Particle";
import { EVENT_SPAWNERS, hasValidSpawner } from "./events/spawners";
import { BubblechamberErrorBoundary } from "./ErrorBoundary";
import { CHAMBER_CONFIG, EVENT_WEIGHTS } from "./config";

const { spawner: SPAWNER_CONFIG } = CHAMBER_CONFIG;

function selectEventType(): EventType {
  const activeEvents = EVENT_WEIGHTS.filter(
    (e) => e.weight > 0 && hasValidSpawner(e.type)
  );

  if (activeEvents.length === 0) return "pair_production";

  const totalWeight = activeEvents.reduce((sum, e) => sum + e.weight, 0);
  const rand = Math.random() * totalWeight;
  let cumulative = 0;

  for (const event of activeEvents) {
    cumulative += event.weight;
    if (rand < cumulative) {
      return event.type;
    }
  }

  return activeEvents[0].type;
}

function ParticleRenderer() {
  const particles = useEventStore(
    useShallow((state) =>
      Array.from(state.particles.values()).filter((p) => p.status !== "faded")
    )
  );

  return (
    <>
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          id={particle.id}
          eventId={particle.eventId}
          startPosition={particle.startPosition}
          initialMomentum={particle.initialMomentum}
          initialAngle={particle.initialAngle}
          bField={particle.bField}
          energyLossRate={particle.energyLossRate}
          bounds={particle.bounds}
          mass={particle.mass}
          charge={particle.charge}
          color={particle.color}
          decay={particle.decay}
        />
      ))}
    </>
  );
}

function useEventSpawner() {
  const { spawnInterval, maxActiveEvents, initialEvents } = SPAWNER_CONFIG;

  const spawnEvent = useEventStore((s) => s.spawnEvent);
  const spawnParticles = useEventStore((s) => s.spawnParticles);

  const spawnNewEvent = useCallback(() => {
    const { events } = useEventStore.getState();
    if (events.size >= maxActiveEvents) return;

    const eventType = selectEventType();
    const spawner = EVENT_SPAWNERS[eventType];
    if (!spawner) {
      throw new Error(`No spawner for event type: ${eventType}`);
    }

    const eventData = spawner();
    const eventId = spawnEvent(eventType, eventData.position);
    spawnParticles(eventId, eventData.particles);
  }, [spawnEvent, spawnParticles, maxActiveEvents]);

  useEffect(() => {
    for (let i = 0; i < initialEvents; i++) {
      spawnNewEvent();
    }
    const interval = setInterval(spawnNewEvent, spawnInterval);
    return () => clearInterval(interval);
  }, [spawnNewEvent, spawnInterval, initialEvents]);
}

export default function Bubblechamber() {
  useEventSpawner();

  return (
    <BubblechamberErrorBoundary>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: "#0F131C" }}
      >
        <ParticleRenderer />
      </Canvas>
    </BubblechamberErrorBoundary>
  );
}

