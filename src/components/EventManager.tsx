import { useEffect, useState, useCallback } from "react";
import { useEventStore } from "../lib/useEventStore";
import PairProduction from "./bc/PairProduction";

interface EventManagerProps {
  spawnInterval?: number; // ms between event spawns
  cleanupDelay?: number; // ms before cleaning up dead events
  maxActiveEvents?: number;
  bounds?: { x: number; y: number }; // spawn area bounds
  bField?: number;
}

interface ActiveEvent {
  id: string;
  type: "pair_production";
  position: [number, number, number];
}

export default function EventManager({
  spawnInterval = 3000,
  cleanupDelay = 10000,
  maxActiveEvents = 5,
  bounds = { x: 3, y: 2 },
  bField = 3,
}: EventManagerProps) {
  const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
  const { spawnEvent, cleanup } = useEventStore();

  const spawnNewEvent = useCallback(() => {
    setActiveEvents((prev) => {
      if (prev.length >= maxActiveEvents) return prev;

      // Random position within bounds
      const x = (Math.random() - 0.5) * 2 * bounds.x;
      const y = (Math.random() - 0.5) * 2 * bounds.y;
      const position: [number, number, number] = [x, y, 0];

      const eventId = spawnEvent("pair_production", position);

      const newEvent: ActiveEvent = {
        id: eventId,
        type: "pair_production",
        position,
      };

      // Schedule cleanup
      setTimeout(() => {
        cleanup(eventId);
        setActiveEvents((current) => current.filter((e) => e.id !== eventId));
      }, cleanupDelay);

      return [...prev, newEvent];
    });
  }, [spawnEvent, cleanup, maxActiveEvents, bounds, cleanupDelay]);

  // Spawn events on interval
  useEffect(() => {
    // Spawn initial event
    spawnNewEvent();

    const interval = setInterval(spawnNewEvent, spawnInterval);
    return () => clearInterval(interval);
  }, [spawnNewEvent, spawnInterval]);

  return (
    <>
      {activeEvents.map((event) => (
        <PairProduction
          key={event.id}
          eventId={event.id}
          position={event.position}
          bField={bField}
        />
      ))}
    </>
  );
}
