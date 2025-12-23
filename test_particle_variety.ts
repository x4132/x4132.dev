/**
 * Test script for particle variety spawner
 * Demonstrates guaranteed minimum frequency across particle types
 */

import { GuaranteedVarietySpawner, type ParticleTypeConfig } from "./src/lib/particleRNG";

type CosmicRayType =
  | "muon"
  | "pion"
  | "pion_minus"
  | "pion_neutral"
  | "electron"
  | "kaon_neutral"
  | "proton"
  | "photon";

const COSMIC_RAY_CONFIGS: ParticleTypeConfig<CosmicRayType>[] = [
  { type: "muon", weight: 3, minFrequency: 25 },
  { type: "pion", weight: 3, minFrequency: 25 },
  { type: "pion_minus", weight: 2, minFrequency: 25 },
  { type: "electron", weight: 2, minFrequency: 25 },
  { type: "pion_neutral", weight: 1.5, minFrequency: 25 },
  { type: "kaon_neutral", weight: 1, minFrequency: 25 },
  { type: "proton", weight: 1, minFrequency: 25 },
  { type: "photon", weight: 1, minFrequency: 25 },
];

console.log("Testing Particle Variety Spawner with Guaranteed Minimum Frequency\n");
console.log("Configuration:");
console.log("- Minimum Frequency: 1 spawn per 25 particles for each type");
console.log("- Weights: muon=3, pion=3, pion_minus=2, electron=2, pion_neutral=1.5, kaon_neutral=1, proton=1, photon=1\n");

const spawner = new GuaranteedVarietySpawner(COSMIC_RAY_CONFIGS, 42);

// Spawn 200 particles
console.log("Spawning 200 particles...\n");
for (let i = 0; i < 200; i++) {
  spawner.selectNext();
}

const stats = spawner.getStats();
const total = spawner.getTotalSpawned();
const history = spawner.getHistory();

console.log("=== Results ===\n");
console.log(`Total particles spawned: ${total}\n`);

console.log("Spawn counts by type:");
COSMIC_RAY_CONFIGS.forEach(config => {
  const count = stats[config.type] || 0;
  const percentage = ((count / total) * 100).toFixed(1);
  const minExpected = Math.floor(total / config.minFrequency);
  const passed = count >= minExpected ? "✓" : "✗";
  console.log(`  ${config.type.padEnd(15)} ${count.toString().padStart(3)} (${percentage}%) - Min Expected: ${minExpected} ${passed}`);
});

console.log("\n=== Variety Verification ===");
console.log("Checking if all particle types appear at least once per 25 spawns...\n");

// Check every 25-particle window
let violations = 0;
const windowSize = 25;
for (let i = 0; i + windowSize <= total; i += windowSize) {
  const window = history.slice(i, i + windowSize);
  const windowTypes = new Set(window);
  const missingTypes = COSMIC_RAY_CONFIGS.map(c => c.type).filter(t => !windowTypes.has(t));

  if (missingTypes.length > 0) {
    violations++;
    console.log(`Window ${Math.floor(i/windowSize) + 1} (particles ${i}-${i+windowSize-1}): Missing ${missingTypes.join(", ")}`);
  }
}

if (violations === 0) {
  console.log("✓ All particle types appear in every 25-particle window!");
} else {
  console.log(`✗ Found ${violations} windows with missing particle types`);
}

console.log("\n=== First 50 Spawns ===");
console.log(history.slice(0, 50).join(", "));
