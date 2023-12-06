import input from './input';

function parseInput(
  input: string,
  ignoreWhitespace?: boolean
): [number, number][] {
  const [timesData, distancesData] = input.split('\n');

  const times = timesData
    .split(':')[1]
    .split(' ')
    .filter(x => x !== '')
    .map(x => parseInt(x));

  const distances = distancesData
    .split(':')[1]
    .split(' ')
    .filter(x => x !== '')
    .map(x => parseInt(x));

  if (ignoreWhitespace) {
    const time = Number(times.join(''));
    const distance = Number(distances.join(''));
    return [[time, distance]];
  }

  return times.map((time, i) => [time, distances[i]]);
}

function findWonRaces(time: number, distance: number): number {
  let wins = 0;
  for (let i = 0; i < time; i++) {
    if (i * (time - i) > distance) {
      wins++;
    }
  }
  return wins;
}

function determineNumberOfWays(raceData: [number, number][]): number {
  let ways = 1;
  for (const [time, distance] of raceData) {
    const wins = findWonRaces(time, distance);
    ways *= wins;
  }

  return ways;
}

// part1

const parsedInput = parseInput(input);
const numberOfWays = determineNumberOfWays(parsedInput);

console.log(numberOfWays);

// part2

const parsedInput2 = parseInput(input, true);
const numberOfWays2 = determineNumberOfWays(parsedInput2);

console.log(numberOfWays2);
