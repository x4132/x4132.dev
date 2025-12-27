import { Canvas } from "@react-three/fiber";
import { useEffect, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { useEventStore, type EventType } from "./useEventStore";
import Particle from "./particles/Particle";
import { EVENT_SPAWNERS, hasValidSpawner } from "./events/spawners";
import { BubblechamberErrorBoundary } from "./ErrorBoundary";
import { CHAMBER_CONFIG, EVENT_WEIGHTS } from "./config";

const { spawner: SPAWNER_CONFIG } = CHAMBER_CONFIG;

/**
 * Select event type based on weighted random distribution
 * Only considers events that have weight > 0 AND a valid spawner implementation
 */
function selectEventType(): EventType {
  const activeEvents = EVENT_WEIGHTS.filter(
    (e) => e.weight > 0 && hasValidSpawner(e.type)
  );

  if (activeEvents.length === 0) {
    // Fallback to pair_production if no events are available
    return "pair_production";
  }

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

/**
 * Inner component that renders particles from the store
 * Must be inside Canvas to use R3F hooks
 */
function ParticleRenderer() {
  // Use useShallow for shallow comparison to prevent unnecessary re-renders
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

/**
 * Event spawner manager - handles spawning new physics events
 * Uses refs and getState() to avoid dependency loops
 * Reads all configuration from SPAWNER_CONFIG
 */
function useEventSpawner() {
  const { spawnInterval, maxActiveEvents, initialEvents } = SPAWNER_CONFIG;

  // Get stable function references from store
  const spawnEvent = useEventStore((s) => s.spawnEvent);
  const spawnParticles = useEventStore((s) => s.spawnParticles);

  // Stable callback that reads current values from refs and store
  const spawnNewEvent = useCallback(() => {
    // Read current state directly to avoid subscription loops
    const { events } = useEventStore.getState();

    if (events.size >= maxActiveEvents) return;

    const eventType = selectEventType();
    const spawner = EVENT_SPAWNERS[eventType];

    if (!spawner) {
      console.warn(`No spawner for event type: ${eventType}`);
      return;
    }

    // Create the event data (spawner reads from CHAMBER_CONFIG)
    const eventData = spawner();

    // Register the event in the store
    const eventId = spawnEvent(eventType, eventData.position);

    // Spawn the initial particles
    spawnParticles(eventId, eventData.particles);
  }, [spawnEvent, spawnParticles, maxActiveEvents]);

  useEffect(() => {
    // Spawn initial batch of events
    for (let i = 0; i < initialEvents; i++) {
      spawnNewEvent();
    }

    // Set up interval for spawning
    const interval = setInterval(spawnNewEvent, spawnInterval);
    return () => clearInterval(interval);
  }, [spawnNewEvent, spawnInterval, initialEvents]);
}

export default function Bubblechamber() {
  // Spawn physics events at intervals (reads from SPAWNER_CONFIG)
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

