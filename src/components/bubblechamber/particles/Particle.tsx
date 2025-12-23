import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import {
  useEventStore,
  type DecayConfig,
  type DecayProduct,
  type ParticleSpawnData,
  type ParticleType,
} from "../../../lib/useEventStore";
import { PARTICLE_DATA } from "./registry";

export type { DecayProduct, DecayConfig };

export interface ParticleProps {
  id: string;
  eventId: string;
  startPosition: [number, number, number];
  initialMomentum: number;
  initialAngle: number;
  bField: number;
  energyLossRate: number;
  bounds?: { x: number; y: number };
  mass: number;
  charge: number;
  color: string;
  decay?: DecayConfig;
}

interface ParticleState {
  x: number;
  y: number;
  z: number;
  momentum: number;
  angle: number;
  alive: boolean;
  points: [number, number, number][];
  age: number;
  decayTime: number | null;
  hasDecayed: boolean;
  isFading: boolean;
  fadeProgress: number;
  fadeDelayRemaining: number;
}

const dt = 0.01;
const FADE_DELAY = 1.5;
const FADE_DURATION = 3.0;
const FADE_SPEED = 1;
const STEPS_PER_FRAME = 5;
const MIN_MOMENTUM = 0.2;

function sampleDecayTime(meanLifetime: number): number {
  return -meanLifetime * Math.log(Math.random());
}

function selectDecayChannel(
  channels: DecayConfig["channels"]
): DecayProduct[] | null {
  const rand = Math.random();
  let cumulative = 0;
  for (const channel of channels) {
    cumulative += channel.probability;
    if (rand < cumulative) {
      return channel.products;
    }
  }
  return null;
}

export default function Particle({
  id,
  eventId,
  startPosition,
  initialMomentum,
  initialAngle,
  bField,
  energyLossRate,
  bounds,
  mass,
  charge,
  color,
  decay,
}: ParticleProps) {
  const { spawnParticles, markParticleDecayed, markParticleFaded } =
    useEventStore();

  // Stable Three.js objects - memoized to prevent recreation on re-render
  const geometry = useMemo(() => new THREE.BufferGeometry(), []);
  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 1 }),
    [color]
  );
  const line = useMemo(
    () => new THREE.Line(geometry, material),
    [geometry, material]
  );

  // Cleanup Three.js resources on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Physics state - kept in ref for performance (not triggering re-renders)
  const state = useRef<ParticleState>({
    x: startPosition[0],
    y: startPosition[1],
    z: startPosition[2],
    momentum: initialMomentum,
    angle: initialAngle,
    alive: true,
    points: [[startPosition[0], startPosition[1], startPosition[2]]],
    age: 0,
    decayTime: decay ? sampleDecayTime(decay.meanLifetime) : null,
    hasDecayed: false,
    isFading: false,
    fadeProgress: 0,
    fadeDelayRemaining: FADE_DELAY,
  });

  // Handle decay - spawn new particles through the store
  const handleDecay = (
    position: [number, number, number],
    momentum: number,
    angle: number,
    products: DecayProduct[]
  ) => {
    const particlesToSpawn: ParticleSpawnData[] = [];

    for (const product of products) {
      const particleData = PARTICLE_DATA[product.type];
      if (!particleData) {
        console.warn(`Unknown particle type in decay: ${product.type}`);
        continue;
      }

      particlesToSpawn.push({
        type: product.type,
        parentId: id,
        startPosition: position,
        initialMomentum: momentum * product.momentumFraction,
        initialAngle: angle + (Math.random() - 0.5) * 2 * product.angleOffset,
        mass: particleData.mass,
        charge: particleData.charge,
        color: particleData.color,
        decay: particleData.decay,
        bField,
        energyLossRate,
        bounds,
      });
    }

    if (particlesToSpawn.length > 0) {
      spawnParticles(eventId, particlesToSpawn);
    }
  };

  useFrame(() => {
    const s = state.current;
    if (!s.alive) return;

    // Handle fading phase
    if (s.isFading) {
      if (s.fadeDelayRemaining > 0) {
        s.fadeDelayRemaining -= dt;
        return;
      }

      const fadeIncrement = dt / FADE_DURATION;
      s.fadeProgress += fadeIncrement * (1 + FADE_SPEED * (1 - s.fadeProgress));

      if (s.fadeProgress >= 1.0) {
        s.alive = false;
        markParticleFaded(id);
        return;
      }

      material.opacity = 1 - s.fadeProgress;
      return;
    }

    // Physics simulation
    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      // Check for radioactive decay
      if (
        decay &&
        s.decayTime !== null &&
        s.age >= s.decayTime &&
        !s.hasDecayed
      ) {
        s.hasDecayed = true;
        s.isFading = true;
        const products = selectDecayChannel(decay.channels);
        markParticleDecayed(id);
        if (products) {
          handleDecay([s.x, s.y, s.z], s.momentum, s.angle, products);
        }
        return;
      }

      // Check for momentum exhaustion
      if (s.momentum <= MIN_MOMENTUM && !s.isFading) {
        s.isFading = true;
        if (!s.hasDecayed) {
          markParticleDecayed(id);
        }
        return;
      }

      // Relativistic velocity calculation
      const energy = Math.sqrt(s.momentum * s.momentum + mass * mass);
      const speed = s.momentum / energy;

      // Cyclotron frequency (Lorentz force in magnetic field)
      const omega = (charge * bField) / energy;

      // Update position and angle
      s.x += Math.cos(s.angle) * speed * dt;
      s.y += Math.sin(s.angle) * speed * dt;
      s.angle += omega * dt;
      s.momentum *= 1 - energyLossRate;
      s.age += dt;

      s.points.push([s.x, s.y, s.z]);

      // Check viewport bounds
      if (bounds && !s.isFading) {
        if (Math.abs(s.x) > bounds.x || Math.abs(s.y) > bounds.y) {
          s.isFading = true;
          if (!s.hasDecayed) {
            markParticleDecayed(id);
          }
          return;
        }
      }
    }

    // Update geometry with new points
    const positions = new Float32Array(s.points.flat());
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0, s.points.length);
    geometry.attributes.position.needsUpdate = true;
  });

  return <primitive object={line} />;
}
