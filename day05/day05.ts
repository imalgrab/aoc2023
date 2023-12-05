import { CompletionTriggerKind } from 'typescript';
import input from './input';

const mapKeys = [
  'seed-to-soil',
  'soil-to-fertilizer',
  'fertilizer-to-water',
  'water-to-light',
  'light-to-temperature',
  'temperature-to-humidity',
  'humidity-to-location',
];

function parseInput(input: string): {
  seeds: number[];
  maps: Map<string, Map<string, string>>;
} {
  let seeds: number[] = [];
  let currentMapKey = '';

  // seed-to-soil: ["50-51": "98-99"]
  const maps = new Map<string, Map<string, string>>();
  for (const mapKey of mapKeys) {
    maps.set(mapKey, new Map<string, string>());
  }

  for (const line of input.split('\n')) {
    if (line.startsWith('seeds')) {
      seeds = line.split(': ')[1].split(' ').map(Number);
    }

    if (line.includes('map') && !line.startsWith('seeds')) {
      const mapKey = line.split(' ')[0];
      if (mapKeys.includes(mapKey)) {
        currentMapKey = mapKey;
      }
    }

    if (line !== '' && !line.includes('map') && !line.startsWith('seeds')) {
      const [destination, source, length] = line.split(' ').map(Number);
      const currentMap = maps.get(currentMapKey)!;

      const sourceRange = `${source}-${source + length - 1}`;
      const destinationRange = `${destination}-${destination + length - 1}`;
      currentMap.set(sourceRange, destinationRange);
    }
  }

  return { seeds, maps };
}

function parseInput2(input: string): {
  seeds: [number, number][];
  maps: Map<string, Map<string, string>>;
} {
  let seeds: [number, number][] = [];
  let currentMapKey = '';

  // seed-to-soil: ["50-51": "98-99"]

  // seed-to-location
  const maps = new Map<string, Map<string, string>>();
  const lookup: Map<string, Set<number>> = new Map();
  for (const mapKey of mapKeys) {
    maps.set(mapKey, new Map<string, string>());
    lookup.set(mapKey, new Set<number>());
  }

  for (const line of input.split('\n')) {
    if (line.startsWith('seeds')) {
      const seedRanges = line.split(': ')[1].split(' ').map(Number);
      let currentIndex = 0;
      for (let i = 0; i < seedRanges.length; i++) {
        if (i % 2 === 0) {
          seeds.push([seedRanges[i], 1]);
          currentIndex = seeds.length - 1;
        } else {
          seeds[currentIndex][1] = seeds[currentIndex][0] + seedRanges[i];
        }
      }
    }

    if (line.includes('map') && !line.startsWith('seeds')) {
      const mapKey = line.split(' ')[0];
      if (mapKeys.includes(mapKey)) {
        currentMapKey = mapKey;
      }
    }

    if (line !== '' && !line.includes('map') && !line.startsWith('seeds')) {
      const [destination, source, length] = line.split(' ').map(Number);
      const currentMap = maps.get(currentMapKey)!;

      const sourceRange = `${source}-${source + length - 1}`;
      const destinationRange = `${destination}-${destination + length - 1}`;
      currentMap.set(sourceRange, destinationRange);
    }
  }

  return { seeds, maps };
}

function findSeedLocation(
  seeds: number[],
  maps: Map<string, Map<string, string>>
) {
  let minSeedLocation = Infinity;

  for (const seed of seeds) {
    let currentValue = seed;
    for (const mapKey of mapKeys) {
      const mapResults = maps.get(mapKey)!.entries();

      for (const [source, destination] of mapResults) {
        const [sourceStart, sourceEnd] = source.split('-').map(Number);
        if (currentValue >= sourceStart && currentValue <= sourceEnd) {
          const offset = currentValue - sourceStart;
          const [destinationStart] = destination.split('-').map(Number);

          const result = destinationStart + offset;
          currentValue = result;

          break;
        }
      }
    }

    minSeedLocation = Math.min(minSeedLocation, currentValue);
  }

  return minSeedLocation;
}

function findSeedLocation2(
  seedRanges: [number, number][],
  maps: Map<string, Map<string, string>>
) {
  let minSeedLocation = Infinity;

  for (const [rangeStart, rangeEnd] of seedRanges) {
    let currentSeed = rangeStart;

    while (currentSeed <= rangeEnd) {
      let currentValue = currentSeed;

      for (const mapKey of mapKeys) {
        const mapResults = maps.get(mapKey)!.entries();

        // faster lookup ???

        for (const [source, destination] of mapResults) {
          const [sourceStart, sourceEnd] = source.split('-').map(Number);

          if (currentValue >= sourceStart && currentValue <= sourceEnd) {
            const offset = currentValue - sourceStart;
            const [destinationStart] = destination.split('-').map(Number);

            const result = destinationStart + offset;
            currentValue = result;

            break;
          }
        }
      }

      minSeedLocation = Math.min(minSeedLocation, currentValue);
      currentSeed++;
    }
  }

  return minSeedLocation;
}

// part 1

const { seeds, maps } = parseInput(input);
const result = findSeedLocation(seeds, maps);
console.log(result);

// part 2

const { seeds: seeds2 } = parseInput2(input);
const result2 = findSeedLocation2(seeds2, maps);
console.log(result2);
