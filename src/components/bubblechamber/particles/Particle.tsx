import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import {
  useEventStore,
  type ParticleSpawnData,
} from "../useEventStore";
import { PARTICLE_DATA, type DecayConfig, type DecayProduct } from "./registry";

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
const STEPS_PER_FRAME = 5;
const MIN_MOMENTUM = 0.2;
const MAX_POINTS = 10000;

const FADE_CONFIG = {
  delay: 1.5,
  duration: 3.0,
  easeOutStrength: 1.0,
} as const;

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

/**
 * Calculate two-body decay kinematics with momentum conservation.
 * Uses relativistic kinematics in the center-of-mass frame, then boosts to lab frame.
 *
 * For a parent particle with mass M decaying to daughters with masses m1 and m2:
 * In CM frame: |p*| = sqrt[(M^2 - (m1+m2)^2)(M^2 - (m1-m2)^2)] / (2M)
 * Daughters go back-to-back in CM frame, then we boost to lab frame.
 */
interface DecayKinematics {
  momentum1: number;
  angle1: number;
  momentum2: number;
  angle2: number;
}

function calculateTwoBodyDecay(
  parentMomentum: number,
  parentAngle: number,
  parentMass: number,
  mass1: number,
  mass2: number
): DecayKinematics {
  // Parent energy in lab frame
  const parentEnergy = Math.sqrt(
    parentMomentum * parentMomentum + parentMass * parentMass
  );

  // Parent velocity (beta) and Lorentz factor (gamma)
  const beta = parentMomentum / parentEnergy;
  const gamma = parentEnergy / parentMass;

  // Momentum magnitude in CM frame (both daughters have same |p*|)
  // |p*| = sqrt[(M^2 - (m1+m2)^2)(M^2 - (m1-m2)^2)] / (2M)
  const M = parentMass;
  const sumMass = mass1 + mass2;
  const diffMass = mass1 - mass2;
  const pStarSq =
    ((M * M - sumMass * sumMass) * (M * M - diffMass * diffMass)) / (4 * M * M);

  // Kinematically forbidden
  if (pStarSq <= 0) {
    return {
      momentum1: parentMomentum * 0.5,
      angle1: parentAngle + Math.PI / 6,
      momentum2: parentMomentum * 0.5,
      angle2: parentAngle - Math.PI / 6,
    };
  }

  const pStar = Math.sqrt(pStarSq);
  const thetaCM = Math.random() * 2 * Math.PI;

  // CM frame (back-to-back)
  const pxCM1 = pStar * Math.cos(thetaCM);
  const pyCM1 = pStar * Math.sin(thetaCM);
  const E1CM = Math.sqrt(pStar * pStar + mass1 * mass1);
  const pxCM2 = -pxCM1;
  const pyCM2 = -pyCM1;
  const E2CM = Math.sqrt(pStar * pStar + mass2 * mass2);

  // Lorentz boost to lab frame: p_parallel' = gamma * (p_parallel + beta * E)
  const px1Lab = gamma * (pxCM1 + beta * E1CM);
  const py1Lab = pyCM1;
  const p1Lab = Math.sqrt(px1Lab * px1Lab + py1Lab * py1Lab);
  const angle1Local = Math.atan2(py1Lab, px1Lab);

  const px2Lab = gamma * (pxCM2 + beta * E2CM);
  const py2Lab = pyCM2;
  const p2Lab = Math.sqrt(px2Lab * px2Lab + py2Lab * py2Lab);
  const angle2Local = Math.atan2(py2Lab, px2Lab);

  return {
    momentum1: p1Lab,
    angle1: parentAngle + angle1Local,
    momentum2: p2Lab,
    angle2: parentAngle + angle2Local,
  };
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
  const {
    spawnParticles,
    markParticleDecayed,
    markParticleStopped,
    markParticleExited,
    markParticleFaded,
  } = useEventStore();

  const positionsBuffer = useRef(new Float32Array(MAX_POINTS * 3));
  const bufferAttribute = useRef<THREE.BufferAttribute | null>(null);

  const geometry = useMemo(() => new THREE.BufferGeometry(), []);
  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 1 }),
    [color]
  );
  const line = useMemo(
    () => new THREE.Line(geometry, material),
    [geometry, material]
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

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
    fadeDelayRemaining: FADE_CONFIG.delay,
  });

  const handleDecay = (
    position: [number, number, number],
    parentMomentum: number,
    parentAngle: number,
    products: DecayProduct[]
  ) => {
    const particlesToSpawn: ParticleSpawnData[] = [];

    // Two-body decay with relativistic kinematics
    if (products.length === 2) {
      const data1 = PARTICLE_DATA[products[0].type];
      const data2 = PARTICLE_DATA[products[1].type];

      if (!data1 || !data2) {
        console.warn("Unknown particle type in two-body decay");
        return;
      }

      const kinematics = calculateTwoBodyDecay(
        parentMomentum,
        parentAngle,
        mass, // parent mass from component props
        data1.mass,
        data2.mass
      );

      particlesToSpawn.push({
        type: products[0].type,
        parentId: id,
        startPosition: position,
        initialMomentum: kinematics.momentum1,
        initialAngle: kinematics.angle1,
        mass: data1.mass,
        charge: data1.charge,
        color: data1.color,
        decay: data1.decay,
        bField,
        energyLossRate,
        bounds,
      });

      particlesToSpawn.push({
        type: products[1].type,
        parentId: id,
        startPosition: position,
        initialMomentum: kinematics.momentum2,
        initialAngle: kinematics.angle2,
        mass: data2.mass,
        charge: data2.charge,
        color: data2.color,
        decay: data2.decay,
        bField,
        energyLossRate,
        bounds,
      });
    } else {
      // Multi-body decay (e.g., muon -> electron + neutrinos)
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
          initialMomentum: parentMomentum * product.momentumFraction,
          initialAngle:
            parentAngle + (Math.random() - 0.5) * 2 * product.angleOffset,
          mass: particleData.mass,
          charge: particleData.charge,
          color: particleData.color,
          decay: particleData.decay,
          bField,
          energyLossRate,
          bounds,
        });
      }
    }

    if (particlesToSpawn.length > 0) {
      spawnParticles(eventId, particlesToSpawn);
    }
  };

  useFrame(() => {
    const s = state.current;
    if (!s.alive) return;

    if (s.isFading) {
      if (s.fadeDelayRemaining > 0) {
        s.fadeDelayRemaining -= dt;
        return;
      }

      const fadeIncrement = dt / FADE_CONFIG.duration;
      s.fadeProgress +=
        fadeIncrement *
        (1 + FADE_CONFIG.easeOutStrength * (1 - s.fadeProgress));

      if (s.fadeProgress >= 1.0) {
        s.alive = false;
        markParticleFaded(id);
        return;
      }

      material.opacity = 1 - s.fadeProgress;
      return;
    }

    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      // Radioactive decay
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

      if (s.momentum <= MIN_MOMENTUM && !s.isFading) {
        s.isFading = true;
        if (!s.hasDecayed) {
          markParticleStopped(id);
        }
        return;
      }

      // Relativistic: E = sqrt(p² + m²), v = p/E
      const energy = Math.sqrt(s.momentum * s.momentum + mass * mass);
      const speed = s.momentum / energy;

      // Cyclotron frequency: ω = qB/E
      const omega = (charge * bField) / energy;

      s.x += Math.cos(s.angle) * speed * dt;
      s.y += Math.sin(s.angle) * speed * dt;
      s.angle += omega * dt;

      // Ionization energy loss (charged particles only)
      if (charge !== 0) {
        s.momentum *= 1 - energyLossRate;
      }

      s.age += dt;

      s.points.push([s.x, s.y, s.z]);

      if (bounds && !s.isFading) {
        if (Math.abs(s.x) > bounds.x || Math.abs(s.y) > bounds.y) {
          s.isFading = true;
          if (!s.hasDecayed) {
            markParticleExited(id);
          }
          return;
        }
      }
    }

    const buffer = positionsBuffer.current;
    const pointCount = Math.min(s.points.length, MAX_POINTS);
    for (let i = 0; i < pointCount; i++) {
      buffer[i * 3] = s.points[i][0];
      buffer[i * 3 + 1] = s.points[i][1];
      buffer[i * 3 + 2] = s.points[i][2];
    }

    if (!bufferAttribute.current) {
      bufferAttribute.current = new THREE.BufferAttribute(buffer, 3);
      bufferAttribute.current.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("position", bufferAttribute.current);
    }

    bufferAttribute.current.needsUpdate = true;
    geometry.setDrawRange(0, pointCount);
  });

  return <primitive object={line} />;
}
