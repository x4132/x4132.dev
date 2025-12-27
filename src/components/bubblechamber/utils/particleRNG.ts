/**
 * Fake RNG system for particle spawning with guaranteed variety
 * Ensures each particle type spawns at minimum frequency using counter-based guarantees
 */

/**
 * Seeded Linear Congruential Generator for deterministic "random" numbers
 */
class SeededRNG {
  private seed: number;

  constructor(seed: number = 12345) {
    this.seed = seed;
  }

  // LCG parameters (glibc implementation)
  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

export interface ParticleTypeConfig<T extends string> {
  type: T;
  weight: number; // Relative spawn weight for weighted random selection
  minFrequency: number; // Minimum spawns per N particles (e.g., 1 per 25)
}

/**
 * Particle spawner with guaranteed variety using fake RNG
 * Tracks spawn history and forces spawns when minimum frequency threshold is reached
 */
export class GuaranteedVarietySpawner<T extends string> {
  private rng: SeededRNG;
  private spawnHistory: T[] = [];
  private lastSpawnIndex: Map<T, number> = new Map();
  private totalWeight: number;
  private particleTypes: readonly ParticleTypeConfig<T>[];

  constructor(
    particleTypes: readonly ParticleTypeConfig<T>[],
    seed: number = Date.now()
  ) {
    this.rng = new SeededRNG(seed);
    this.particleTypes = particleTypes;
    this.totalWeight = particleTypes.reduce((sum, p) => sum + p.weight, 0);

    // Initialize last spawn indices to allow immediate spawns
    particleTypes.forEach((ptype) => {
      this.lastSpawnIndex.set(ptype.type, -ptype.minFrequency);
    });
  }

  /**
   * Select next particle type with guaranteed minimum frequency
   * Returns particle type, ensuring variety through counter-based forcing
   */
  selectNext(): T {
    const currentIndex = this.spawnHistory.length;

    // Check if any particle type MUST be spawned due to minimum frequency constraint
    // This ensures no particle goes too long without spawning
    for (const ptype of this.particleTypes) {
      const lastSpawn = this.lastSpawnIndex.get(ptype.type) ?? -ptype.minFrequency;
      const particlesSinceLastSpawn = currentIndex - lastSpawn;

      if (particlesSinceLastSpawn >= ptype.minFrequency) {
        // Force spawn this particle type to maintain variety
        this.recordSpawn(ptype.type, currentIndex);
        return ptype.type;
      }
    }

    // No forced spawn needed, use weighted random selection
    const selectedType = this.weightedRandomSelection();
    this.recordSpawn(selectedType, currentIndex);
    return selectedType;
  }

  /**
   * Weighted random selection based on particle weights
   * Uses fake RNG for deterministic behavior
   */
  private weightedRandomSelection(): T {
    let random = this.rng.next() * this.totalWeight;

    for (const ptype of this.particleTypes) {
      random -= ptype.weight;
      if (random <= 0) {
        return ptype.type;
      }
    }

    // Fallback (should never reach here due to floating point)
    return this.particleTypes[0].type;
  }

  /**
   * Record a spawn in history and update last spawn index
   */
  private recordSpawn(type: T, index: number): void {
    this.spawnHistory.push(type);
    this.lastSpawnIndex.set(type, index);
  }

  /**
   * Get spawn statistics for debugging/visualization
   */
  getStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.spawnHistory.forEach((type) => {
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  }

  /**
   * Get total number of particles spawned
   */
  getTotalSpawned(): number {
    return this.spawnHistory.length;
  }

  /**
   * Get spawn history array (for analysis)
   */
  getHistory(): T[] {
    return [...this.spawnHistory];
  }
}
