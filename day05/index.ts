import { CompletionTriggerKind } from 'typescript';
import input from './input';

type Range = {
  source: number;
  length: number;
};

type Mapping = {
  source: number;
  destination: number;
  length: number;
};

type Data = {
  seeds: number[];
  maps: Mapping[][];
};

type RangedData = {
  seedRanges: Range[];
  maps: Mapping[][];
};

function getData(input: string): Data {
  const [seedsData, ...mapsData] = input.split('\n\n');
  const seeds = seedsData.split(': ')[1].split(' ').map(Number);
  const maps: Mapping[][] = [];

  for (const mapData of mapsData) {
    const lines = mapData.split('\n').slice(1);
    const currentMappings: Mapping[] = [];

    for (const line of lines) {
      const [destination, source, length] = line.split(' ').map(Number);
      currentMappings.push({ source, destination, length });
    }
    maps.push(currentMappings);
  }

  return { seeds, maps };
}

function findSeedLocation(seed: number, maps: Mapping[][]): number {
  let value = seed;
  for (const map of maps) {
    for (const { source, destination, length } of map) {
      if (value >= source && value <= source + length - 1) {
        value += destination - source;
        break;
      }
    }
  }

  return value;
}

function findMinimumLocation(seeds: number[], maps: Mapping[][]): number {
  const locations = seeds.map(seed => findSeedLocation(seed, maps));
  return Math.min(...locations);
}

// part 1

const { seeds, maps } = getData(input);
const minimumLocation = findMinimumLocation(seeds, maps);
console.log(minimumLocation);

function getRangedData(input: string): RangedData {
  const [seedsData, ...mapsData] = input.split('\n\n');
  const seeds = seedsData.split(': ')[1].split(' ').map(Number);
  const seedRanges: Range[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push({ source: seeds[i], length: seeds[i + 1] });
  }

  const maps: Mapping[][] = [];
  for (const mapData of mapsData) {
    const lines = mapData.split('\n').slice(1);
    const currentMappings: Mapping[] = [];

    for (const line of lines) {
      const [destination, source, length] = line.split(' ').map(Number);
      currentMappings.push({ source, destination, length });
    }
    maps.push(currentMappings);
  }

  return { seedRanges, maps };
}

export function mapRange(
  range: Range,
  mapping: Mapping
): { mapped: Range[]; same: Range[] } {
  const { source: x, length } = range;
  const y = x + length - 1;

  const { source: sx, destination: dx, length: len } = mapping;
  const sy = sx + len - 1;

  if (x >= sx && y <= sy) {
    //     |----|
    // |-------------|
    // sx           sy
    return {
      mapped: [{ source: x + (dx - sx), length }],
      same: [],
    };
  }

  if (x < sx && y > sy) {
    // |-----------|
    //      |---|
    //    sx    sy
    return {
      mapped: [{ source: dx, length: len }],
      same: [
        { source: x, length: sx - x },
        { source: sy + 1, length: y - sy },
      ],
    };
  }

  if (x >= sx && x <= sy && sy < y) {
    //      |---------|
    // |----------|
    // sx         sy
    return {
      mapped: [{ source: x + (dx - sx), length: sy - x + 1 }],
      same: [{ source: sy + 1, length: y - sy }],
    };
  }

  if (y >= sx && y <= sy && x < sx) {
    // |----------|
    //        |--------|
    //        sx      sy
    return {
      mapped: [{ source: dx, length: y - sx + 1 }],
      same: [{ source: x, length: sx - x }],
    };
  }

  return {
    mapped: [],
    same: [],
  };
}

function findMinimumLocationRange(seeds: Range[], maps: Mapping[][]) {
  for (const map of maps) {
    const newSeeds: Range[] = [];

    while (seeds.length > 0) {
      const range = seeds.pop()!;
      let matchFound = false;

      for (const mapping of map) {
        const { mapped, same } = mapRange(range, mapping);

        if (mapped.length) {
          newSeeds.push(...mapped);
          seeds.push(...same);
          matchFound = true;
          break;
        }
      }

      if (!matchFound) {
        newSeeds.push(range);
      }
    }
    seeds = newSeeds;
  }

  return Math.min(...seeds.map(seed => seed.source));
}

// part 2

const { seedRanges } = getRangedData(input);
const minimumLocation2 = findMinimumLocationRange(seedRanges, maps);
console.log(minimumLocation2);
