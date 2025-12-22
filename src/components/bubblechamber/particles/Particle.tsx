import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export interface DecayProduct {
  type: string;
  momentumFraction: number;
  angleOffset: number;
}

export interface DecayConfig {
  meanLifetime: number;
  channels: Array<{
    probability: number;
    products: DecayProduct[];
  }>;
}

export interface ParticleProps {
  id?: string;
  startPosition?: [number, number, number];
  initialMomentum?: number;
  initialAngle?: number;
  bField?: number;
  energyLossRate?: number;
  bounds?: { x: number; y: number };
  mass: number;
  charge: number;
  color: string;
  decay?: DecayConfig;
  onDeath?: (info: {
    id: string;
    position: [number, number, number];
    momentum: number;
    angle: number;
    decayProducts: DecayProduct[] | null;
  }) => void;
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

export function useParticlePhysics(
  id: string,
  startPosition: [number, number, number],
  initialMomentum: number,
  initialAngle: number | undefined,
  mass: number,
  charge: number,
  bField: number,
  energyLossRate: number,
  decay: DecayConfig | undefined,
  bounds: { x: number; y: number } | undefined,
  onDeath: ParticleProps["onDeath"]
) {
  const state = useRef<ParticleState>({
    x: startPosition[0],
    y: startPosition[1],
    z: startPosition[2],
    momentum: initialMomentum,
    angle: initialAngle ?? Math.random() * Math.PI * 2,
    alive: true,
    points: [[startPosition[0], startPosition[1], startPosition[2]]],
    age: 0,
    decayTime: decay ? sampleDecayTime(decay.meanLifetime) : null,
    hasDecayed: false,
    isFading: false,
    fadeProgress: 0,
    fadeDelayRemaining: FADE_DELAY,
  });

  const lineRef = useRef<THREE.Line>(null);

  useFrame(() => {
    const s = state.current;
    if (!s.alive) return;

    if (s.isFading) {
      if (s.fadeDelayRemaining > 0) {
        s.fadeDelayRemaining -= dt;
        return;
      }

      const fadeIncrement = dt / FADE_DURATION;
      s.fadeProgress += fadeIncrement * (1 + FADE_SPEED * (1 - s.fadeProgress));

      if (s.fadeProgress >= 1.0) {
        s.alive = false;
        return;
      }

      if (lineRef.current?.material) {
        const mat = lineRef.current.material as THREE.LineBasicMaterial;
        mat.transparent = true;
        mat.opacity = 1 - s.fadeProgress;
      }

      return;
    }

    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      if (
        decay &&
        s.decayTime !== null &&
        s.age >= s.decayTime &&
        !s.hasDecayed
      ) {
        s.hasDecayed = true;
        s.isFading = true;
        const products = selectDecayChannel(decay.channels);
        onDeath?.({
          id,
          position: [s.x, s.y, s.z],
          momentum: s.momentum,
          angle: s.angle,
          decayProducts: products,
        });
        return;
      }

      if (s.momentum <= MIN_MOMENTUM && !s.isFading) {
        s.isFading = true;
        if (!s.hasDecayed) {
          onDeath?.({
            id,
            position: [s.x, s.y, s.z],
            momentum: s.momentum,
            angle: s.angle,
            decayProducts: null,
          });
        }
        return;
      }

      // Relativistic velocity
      const energy = Math.sqrt(s.momentum * s.momentum + mass * mass);
      const speed = s.momentum / energy;

      // Cyclotron frequency
      const omega = (charge * bField) / energy;

      s.x += Math.cos(s.angle) * speed * dt;
      s.y += Math.sin(s.angle) * speed * dt;
      s.angle += omega * dt;
      s.momentum *= 1 - energyLossRate;
      s.age += dt;

      s.points.push([s.x, s.y, s.z]);

      // Check viewport bounds if provided
      if (bounds && !s.isFading) {
        if (Math.abs(s.x) > bounds.x || Math.abs(s.y) > bounds.y) {
          s.isFading = true;
          if (!s.hasDecayed) {
            onDeath?.({
              id,
              position: [s.x, s.y, s.z],
              momentum: s.momentum,
              angle: s.angle,
              decayProducts: null,
            });
          }
          return;
        }
      }
    }

    if (lineRef.current) {
      const positions = new Float32Array(s.points.flat());
      lineRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      lineRef.current.geometry.setDrawRange(0, s.points.length);
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return { state, lineRef };
}

let particleIdCounter = 0;
const generateParticleId = () => `p_${++particleIdCounter}`;

export default function Particle({
  id,
  startPosition = [0, 0, 0],
  initialMomentum = 0.5,
  initialAngle,
  bField = 2,
  energyLossRate = 0.005,
  bounds,
  mass,
  charge,
  color,
  decay,
  onDeath,
}: ParticleProps) {
  const particleId = useRef(id ?? generateParticleId());

  const { lineRef } = useParticlePhysics(
    particleId.current,
    startPosition,
    initialMomentum,
    initialAngle,
    mass,
    charge,
    bField,
    energyLossRate,
    decay,
    bounds,
    onDeath
  );

  return (
    <primitive object={new THREE.Line()} ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color={color} transparent={true} opacity={1} />
    </primitive>
  );
}
