import input from './input';

function parseInput(input: string, readAsOne?: boolean): [number, number][] {
  const [timesData, distancesData] = input.split('\n');
  const times = timesData.split(':')[1].split(' ').filter(Boolean).map(Number);
  const distances = distancesData
    .split(':')[1]
    .split(' ')
    .filter(Boolean)
    .map(Number);

  if (readAsOne) {
    return [[Number(times.join('')), Number(distances.join(''))]];
  }

  return times.map((time, i) => [time, distances[i]]);
}

function findWaysToWin(time: number, distance: number): number {
  // (time - i) * i > distance
  // -i^2 + t*i -d > 0
  const delta = time ** 2 - 4 * distance;
  const x0 = (-time - Math.sqrt(delta)) / -2;
  const x1 = (-time + Math.sqrt(delta)) / -2;

  const start = Math.floor(Math.min(x0, x1));
  const end = Math.ceil(Math.max(x0, x1));

  return end - start - 1;
}

function findNumberOfWaysToWin(racesData: [number, number][]): number {
  let ways = 1;
  for (const [time, distance] of racesData) {
    const waysToWin = findWaysToWin(time, distance);
    ways *= waysToWin;
  }
  return ways;
}

// part1

const racesData = parseInput(input);
const result = findNumberOfWaysToWin(racesData);
console.log(result);

// part2

const raceData = parseInput(input, true);
const result2 = findNumberOfWaysToWin(racesData);
console.log(result2);
