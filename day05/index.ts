import input from './input';

export type Mapping = {
  source: number;
  destination: number;
  length: number;
};

export type Range = {
  source: number;
  length: number;
};

type Data = {
  seeds: number[];
  mappings: Mapping[][];
};

type RangedData = {
  seedRanges: Range[];
  mappings: Mapping[][];
};

function getData(input: string): Data {
  let seeds: number[] = [];
  const mappings: Mapping[][] = [];

  let mapIndex = -1;
  const lines = input.split('\n').filter(l => l !== '');

  for (const line of lines) {
    if (line.startsWith('seeds')) {
      const [, seedValues] = line.split(': ');
      seeds = seedValues.split(' ').map(Number);
    } else if (line.endsWith('map:')) {
      mapIndex++;
      mappings.push([]);
    } else {
      const [destination, source, length] = line.split(' ').map(Number);
      const mapping: Mapping = { source, destination, length };
      mappings[mapIndex].push(mapping);
    }
  }

  return { seeds, mappings };
}

function findLocationValue(seed: number, mappings: Mapping[][]): number {
  let currentValue = seed;
  for (let i = 0; i < mappings.length; i++) {
    const currentMappings = mappings[i];
    for (const { source, destination, length } of currentMappings) {
      if (currentValue >= source && currentValue <= source + length - 1) {
        currentValue += destination - source;
        break;
      }
    }
  }
  return currentValue;
}

function findMinimumLocation(seeds: number[], mappings: Mapping[][]): number {
  let minimum = Infinity;
  for (const seed of seeds) {
    const seedLocation = findLocationValue(seed, mappings);
    minimum = Math.min(minimum, seedLocation);
  }
  return minimum;
}

// part 1

// const { seeds, mappings } = getData(input);
// const minimumLocation = findMinimumLocation(seeds, mappings);
// console.log(minimumLocation);

function getRangedData(input: string): RangedData {
  const seedRanges: Range[] = [];
  const mappings: Mapping[][] = [];

  let mapIndex = -1;
  const lines = input.split('\n').filter(l => l !== '');

  for (const line of lines) {
    if (line.startsWith('seeds')) {
      const [, seedValues] = line.split(': ');
      const seeds = seedValues.split(' ').map(Number);
      for (let s = 0; s < seeds.length; s += 2) {
        const [source, length] = seeds.slice(s, s + 2);
        const seedRange: Range = { source, length };
        seedRanges.push(seedRange);
      }
    } else if (line.endsWith('map:')) {
      mapIndex++;
      mappings.push([]);
    } else {
      const [destination, source, length] = line.split(' ').map(Number);
      const mapping: Mapping = { source, destination, length };
      mappings[mapIndex].push(mapping);
    }
  }

  return { seedRanges, mappings };
}

export function mapRange(range: Range, mapping: Mapping): Range[] {
  const { source: x, length } = range;
  const y = x + length - 1;

  const { source: sx, destination: dx, length: len } = mapping;
  const sy = sx + len - 1;

  if (x > sy || y < sx) {
    // |---|
    //       |------|
    //      sx     sy
    return [];
  }

  if (x >= sx && y <= sy) {
    //     |----|
    // |-------------|
    // sx           sy
    return [{ source: x + (dx - sx), length }];
  }

  if (x < sx && y > sy) {
    // |-----------|
    //      |---|
    //    sx    sy
    return [
      { source: x, length: sx - x },
      { source: dx, length: len },
      { source: sy + 1, length: y - sy },
    ];
  }

  if (x >= sx && x <= sy) {
    //      |---------|
    // |----------|
    // sx         sy
    return [
      { source: x + (dx - sx), length: sy - x + 1 },
      { source: sy + 1, length: y - sy },
    ];
  }

  if (y >= sx && y <= sy) {
    // |----------|
    //        |--------|
    //        sx      sy
    return [
      { source: x, length: sx - x },
      { source: dx, length: y - sx + 1 },
    ];
  }

  return [];
}

function findRangeMinLocationValue(
  seedRange: Range,
  mappings: Mapping[][]
): number {
  let currentRanges: Range[] = [{ ...seedRange }];
  let nextRanges: Range[] = [];

  for (let i = 0; i < 7; i++) {
    const currentMappings = mappings[i];

    for (let j = 0; j < currentRanges.length; j++) {
      const currentRange = currentRanges[j];
      const mappedRanges: Range[] = [];

      for (const mapping of currentMappings) {
        const newRanges = mapRange(currentRange, mapping);
        mappedRanges.push(...newRanges);
      }

      if (!mappedRanges.length) {
        mappedRanges.push(currentRange);
      }
      nextRanges.push(...mappedRanges);
    }

    currentRanges = [...nextRanges];
    nextRanges = [];
  }

  const currentSources = currentRanges.map(range => range.source);

  return Math.min(...currentSources);
}

function findRangesMinimumLocation(
  seedRanges: Range[],
  mappings: Mapping[][]
): number {
  let minimum = Infinity;

  for (const seedRange of seedRanges) {
    const seedRangeMinLocation = findRangeMinLocationValue(seedRange, mappings);
    minimum = Math.min(minimum, seedRangeMinLocation);
  }

  return minimum;
}

// part 2

const { seedRanges, mappings: mappings2 } = getRangedData(input);
const minimumLocation2 = findRangesMinimumLocation(seedRanges, mappings2);
console.log(minimumLocation2);
