import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export interface DecayProduct {
  type: string;
  momentumFraction: number;
  angleOffset: number;
}

export interface DecayConfig {
  meanLifetime: number; // in simulation time units
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
}

const dt = 0.01;

// Sample from exponential distribution for radioactive decay
function sampleDecayTime(meanLifetime: number): number {
  return -meanLifetime * Math.log(Math.random());
}

// Select decay channel based on probabilities
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
  });

  const lineRef = useRef<THREE.Line>(null);

  useFrame(() => {
    const s = state.current;
    if (!s.alive) return;

    const stepsPerFrame = 5;

    for (let i = 0; i < stepsPerFrame; i++) {
      // Check for decay
      if (
        decay &&
        s.decayTime !== null &&
        s.age >= s.decayTime &&
        !s.hasDecayed
      ) {
        s.hasDecayed = true;
        s.alive = false;
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

      // Check for momentum loss death
      if (s.momentum <= 0.2) {
        s.alive = false;
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

      // Relativistic velocity: v = p / sqrt(p² + m²)
      const energy = Math.sqrt(s.momentum * s.momentum + mass * mass);
      const speed = s.momentum / energy;

      // Cyclotron frequency: ω = qB / E (relativistic)
      const omega = (charge * bField) / energy;

      s.x += Math.cos(s.angle) * speed * dt;
      s.y += Math.sin(s.angle) * speed * dt;
      s.angle += omega * dt;
      s.momentum *= 1 - energyLossRate;
      s.age += dt;

      s.points.push([s.x, s.y, s.z]);
    }

    // Update line geometry
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
    onDeath
  );

  return (
    <primitive object={new THREE.Line()} ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color={color} />
    </primitive>
  );
}
