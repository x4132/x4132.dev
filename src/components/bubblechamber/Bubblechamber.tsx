import { Canvas } from "@react-three/fiber";
import { useEffect, useState, useCallback } from "react";
import { useEventStore, type EventType } from "../../lib/useEventStore";
import PairProduction from "./events/PairProduction";
import CosmicRay from "./events/CosmicRay";

interface BubblechamberProps {
  spawnInterval?: number;
  cleanupDelay?: number;
  maxActiveEvents?: number;
  bounds?: { x: number; y: number };
  bField?: number;
}

interface ActiveEvent {
  id: string;
  type: EventType;
  position?: [number, number, number];
  subtype?: string;
}

interface EventConfig {
  weight: number;
  component: React.ComponentType<any>;
  positionStrategy: "center" | "edge";
}

const EVENT_CONFIGS: Record<EventType, EventConfig> = {
  pair_production: {
    weight: 0.1,
    component: PairProduction,
    positionStrategy: "center",
  },
  cosmic_ray: {
    weight: 0.9,
    component: CosmicRay,
    positionStrategy: "edge",
  },
  // Future events (Phase 2+)
  kaon_decay: {
    weight: 0,
    component: PairProduction, // placeholder
    positionStrategy: "center",
  },
  v_event: {
    weight: 0,
    component: PairProduction, // placeholder
    positionStrategy: "center",
  },
  muon_pair: {
    weight: 0,
    component: PairProduction, // placeholder
    positionStrategy: "center",
  },
  pion_pair: {
    weight: 0,
    component: PairProduction, // placeholder
    positionStrategy: "center",
  },
};

/**
 * Select event type based on weighted random distribution
 */
function selectEventType(): EventType {
  // Filter to only active events (weight > 0)
  const activeEvents = Object.entries(EVENT_CONFIGS).filter(
    ([_, config]) => config.weight > 0
  );

  // Calculate total weight
  const totalWeight = activeEvents.reduce(
    (sum, [_, config]) => sum + config.weight,
    0
  );

  // Select using cumulative probability
  const rand = Math.random() * totalWeight;
  let cumulative = 0;

  for (const [type, config] of activeEvents) {
    cumulative += config.weight;
    if (rand < cumulative) {
      return type as EventType;
    }
  }

  // Fallback (shouldn't reach here)
  return "pair_production";
}

function EventManager({
  spawnInterval = 3000,
  cleanupDelay = 6000,
  maxActiveEvents = 5,
  bounds = { x: 3, y: 2 },
  bField = 3,
}: BubblechamberProps) {
  const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
  const { spawnEvent, cleanup } = useEventStore();

  const spawnNewEvent = useCallback(() => {
    setActiveEvents((prev) => {
      if (prev.length >= maxActiveEvents) return prev;

      // Select event type based on weights
      const eventType = selectEventType();
      const config = EVENT_CONFIGS[eventType];

      // Calculate position based on strategy
      let position: [number, number, number] | undefined;
      if (config.positionStrategy === "center") {
        // Center spawn with random position within bounds
        const x = (Math.random() - 0.5) * 2 * bounds.x;
        const y = (Math.random() - 0.5) * 2 * bounds.y;
        position = [x, y, 0];
      }
      // For "edge" strategy, leave position as undefined

      const eventId = spawnEvent(eventType, position ?? [0, 0, 0]);

      const newEvent: ActiveEvent = {
        id: eventId,
        type: eventType,
        position,
      };

      setTimeout(() => {
        cleanup(eventId);
        setActiveEvents((current) => current.filter((e) => e.id !== eventId));
      }, cleanupDelay);

      return [...prev, newEvent];
    });
  }, [spawnEvent, cleanup, maxActiveEvents, bounds, cleanupDelay]);

  useEffect(() => {
    spawnNewEvent();

    const interval = setInterval(spawnNewEvent, spawnInterval);
    return () => clearInterval(interval);
  }, [spawnNewEvent, spawnInterval]);

  return (
    <>
      {activeEvents.map((event) => {
        const config = EVENT_CONFIGS[event.type];
        const Component = config.component;

        return (
          <Component
            key={event.id}
            eventId={event.id}
            position={event.position}
            bField={bField}
            bounds={bounds}
            subtype={event.subtype}
          />
        );
      })}
    </>
  );
}

export default function Bubblechamber(props: BubblechamberProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ background: "#0F131C" }}
    >
      <EventManager
        spawnInterval={1000}
        cleanupDelay={6000}
        maxActiveEvents={10}
        bounds={{ x: 7, y: 4 }}
        bField={3}
        {...props}
      />
    </Canvas>
  );
}
