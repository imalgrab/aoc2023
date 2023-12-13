import input from './input';

export type Range = {
  source: number;
  destination: number;
  length: number;
};

type Source = Omit<Range, 'destination'>;

type Data = {
  seeds: number[];
  ranges: Range[][];
};

type DataWithRanges = {
  seedRanges: Range[];
  mappings: Range[][];
};

function parseInput(input: string): Data {
  let seeds: number[] = [];
  let rangeIndex = -1;
  const ranges: Range[][] = [];

  const lines = input.split('\n').filter(l => l !== '');

  for (const line of lines) {
    if (line.startsWith('seeds')) {
      const [, seedValues] = line.split(': ');
      seeds = seedValues.split(' ').map(Number);
    } else if (line.endsWith('map:')) {
      rangeIndex++;
      ranges.push([]);
    } else {
      const [destination, source, length] = line.split(' ').map(Number);
      const range: Range = { source, destination, length };
      ranges[rangeIndex].push(range);
    }
  }

  return { seeds, ranges };
}

function parseInputWithRanges(input: string): DataWithRanges {
  let mapIndex = -1;

  const seedRanges: Range[] = [];
  const mappings: Range[][] = [];

  const lines = input.split('\n').filter(l => l !== '');

  for (const line of lines) {
    if (line.startsWith('seeds')) {
      const [, seedValues] = line.split(': ');
      const seeds = seedValues.split(' ').map(Number);
      for (let s = 0; s < seeds.length; s += 2) {
        const [source, length] = seeds.slice(s, s + 2);
        const range: Range = {
          source: source,
          destination: source + length - 1,
          length,
        };
        seedRanges.push(range);
      }
    } else if (line.endsWith('map:')) {
      mapIndex++;
      mappings.push([]);
    } else {
      const [destination, source, length] = line.split(' ').map(Number);
      const range: Range = { source, destination, length };
      mappings[mapIndex].push(range);
    }
  }

  return { seedRanges, mappings };
}

export function mapSource(
  x: number,
  y: number,
  length: number,
  mapping: Range
): Source[] {
  const { source: sx, destination: dx, length: len } = mapping;
  const sy = sx + len - 1;

  const nextSources: Source[] = [];

  if (x >= sx && y <= sy) {
    //     |----|
    // |-------------|
    // sx           sy
    nextSources.push({ source: x + (dx - sx), length });
    return nextSources;
  }

  if (x <= sx && y >= sy) {
    // |-----------|
    //      |---|
    //    sx    sy
    nextSources.push({ source: x, length: sx - x });
    nextSources.push({ source: dx, length: len });
    nextSources.push({ source: sy + 1, length: y - sy });
    return nextSources;
  }

  if (x >= sx && y >= sy && x <= sy) {
    //      |---------|
    // |----------|
    // sx         sy

    nextSources.push({ source: x + (dx - sx), length: sy - x + 1 });
    nextSources.push({ source: sy + 1, length: y - sy + 1 });
    return nextSources;
  }

  if (x <= sx && y <= sy && sx <= y) {
    // |----------|
    //        |--------|
    //        sx      sy
    nextSources.push({ source: x, length: sx - x });
    nextSources.push({ source: dx, length: y - sx + 1 });
    return nextSources;
  }

  return nextSources;
}

function findLocationValue(seed: number, ranges: Range[][]): number {
  let currentValue = seed;
  for (let i = 0; i < ranges.length; i++) {
    const currentRanges = ranges[i];

    for (const { source, destination, length } of currentRanges) {
      if (currentValue >= source && currentValue < source + length) {
        const offset = source - destination;
        currentValue -= offset;
        break;
      }
    }
  }

  return currentValue;
}

function findMinLocation(seeds: number[], ranges: Range[][]): number {
  let min = Infinity;

  for (const seed of seeds) {
    const locationValue = findLocationValue(seed, ranges);
    min = Math.min(locationValue, min);
  }

  return min;
}

function findRangeLocationValue(range: Range, maps: Range[][]): number {
  let ranges: Source[] = [];
  let nextRanges: Source[] = [range];

  for (let i = 0; i < maps.length; i++) {
    const map = maps[i];

    ranges = [...nextRanges];
    nextRanges = [];

    console.log(map);
    console.log('\n');
    console.log(ranges);

    for (const range of ranges) {
      const { source: x, length } = range;
      const y = x + length - 1;

      for (const mapping of map) {
        const mappedSource = mapSource(x, y, length, mapping);
        nextRanges.push(...mappedSource);
      }

      if (nextRanges.length === 0) {
        // no overlap found
        nextRanges.push({ source: x, length });
      }
    }
  }

  const sources = ranges.map(range => range.source);
  return Math.min(...sources);
}

function findMinLocationForRanges(
  seedRanges: Range[],
  maps: Range[][]
): number {
  let min = Infinity;

  for (const seedRange of seedRanges) {
    const rangeLocationValue = findRangeLocationValue(seedRange, maps);
    min = Math.min(min, rangeLocationValue);
  }

  return min;
}

// const { seeds, ranges } = parseInput(input);
// const minLocation = findMinLocation(seeds, ranges);
// console.log(minLocation);

const { seedRanges, mappings } = parseInputWithRanges(input);
const minLocationWithRanges = findMinLocationForRanges(seedRanges, mappings);
console.log(minLocationWithRanges);
