// Seeded LCG for deterministic spawning
class SeededRNG {
  private seed: number;

  constructor(seed: number = 12345) {
    this.seed = seed;
  }

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
  weight: number;
  minFrequency: number;
}

// Guarantees minimum spawn frequency for each particle type
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

    particleTypes.forEach((ptype) => {
      this.lastSpawnIndex.set(ptype.type, -ptype.minFrequency);
    });
  }

  selectNext(): T {
    const currentIndex = this.spawnHistory.length;

    // Force spawn if any type hasn't appeared within minFrequency
    for (const ptype of this.particleTypes) {
      const lastSpawn = this.lastSpawnIndex.get(ptype.type) ?? -ptype.minFrequency;
      if (currentIndex - lastSpawn >= ptype.minFrequency) {
        this.recordSpawn(ptype.type, currentIndex);
        return ptype.type;
      }
    }

    const selectedType = this.weightedRandomSelection();
    this.recordSpawn(selectedType, currentIndex);
    return selectedType;
  }

  private weightedRandomSelection(): T {
    let random = this.rng.next() * this.totalWeight;
    for (const ptype of this.particleTypes) {
      random -= ptype.weight;
      if (random <= 0) return ptype.type;
    }
    return this.particleTypes[0].type;
  }

  private recordSpawn(type: T, index: number): void {
    this.spawnHistory.push(type);
    this.lastSpawnIndex.set(type, index);
  }

  getStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.spawnHistory.forEach((type) => {
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  }

  getTotalSpawned(): number {
    return this.spawnHistory.length;
  }

  getHistory(): T[] {
    return [...this.spawnHistory];
  }
}
