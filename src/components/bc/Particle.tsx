import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export interface ParticleProps {
  startPosition?: [number, number, number];
  initialMomentum?: number;
  initialAngle?: number;
  bField?: number;
  energyLossRate?: number;
  mass: number;
  charge: number;
  color: string;
}

interface ParticleState {
  x: number;
  y: number;
  z: number;
  momentum: number;
  angle: number;
  alive: boolean;
  points: [number, number, number][];
}

const dt = 0.01;

export function useParticlePhysics(
  startPosition: [number, number, number],
  initialMomentum: number,
  initialAngle: number | undefined,
  mass: number,
  charge: number,
  bField: number,
  energyLossRate: number
) {
  const state = useRef<ParticleState>({
    x: startPosition[0],
    y: startPosition[1],
    z: startPosition[2],
    momentum: initialMomentum,
    angle: initialAngle ?? Math.random() * Math.PI * 2,
    alive: true,
    points: [[startPosition[0], startPosition[1], startPosition[2]]],
  });

  const lineRef = useRef<THREE.Line>(null);

  useFrame(() => {
    const s = state.current;
    if (!s.alive) return;

    const stepsPerFrame = 5;

    for (let i = 0; i < stepsPerFrame; i++) {
      if (s.momentum <= 0.1) {
        s.alive = false;
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

export default function Particle({
  startPosition = [0, 0, 0],
  initialMomentum = 0.5,
  initialAngle,
  bField = 2,
  energyLossRate = 0.005,
  mass,
  charge,
  color,
}: ParticleProps) {
  const { lineRef } = useParticlePhysics(
    startPosition,
    initialMomentum,
    initialAngle,
    mass,
    charge,
    bField,
    energyLossRate
  );

  return (
    <primitive object={new THREE.Line()} ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color={color} />
    </primitive>
  );
}
