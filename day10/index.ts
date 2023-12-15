import input from './input';

const PIPES = {
  '|': 'NS',
  '-': 'EW',
  L: 'NE',
  J: 'NW',
  '7': 'SW',
  F: 'SE',
} as const;

const GROUND = '.' as const;
const START = 'S' as const;

type Position = [number, number];

type Data = {
  startingPosition: Position;
  map: string[][];
};

function parseInput(input: string): Data {
  const lines = input.split('\n');
  const map = lines.map(line => line.split(''));

  let startingPosition: Position = [-1, -1];

  for (let i = 0; i < map.length; i++) {
    const position = map[i].findIndex(x => x === START);
    if (position !== -1) {
      startingPosition = [i, position];
      break;
    }
  }

  return {
    startingPosition,
    map,
  };
}

function getAdjacentPositions(
  position: Position,
  n: number,
  m: number
): Position[] {
  const [x, y] = position;
  const dx = [-1, 0, 1, 0];
  const dy = [0, 1, 0, -1];
  const adjacentPositions: Position[] = [];
  for (let i = 0; i < 4; i++) {
    if (x + dx[i] >= 0 && x + dx[i] < n && y + dy[i] >= 0 && y + dy[i] < m) {
      const adjacentPosition: Position = [x + dx[i], y + dy[i]];
      adjacentPositions.push(adjacentPosition);
    }
  }
  return adjacentPositions;
}

function checkAdjacentPipeCorrect(
  startPosition: Position,
  adjacentPipePosition: Position,
  map: string[][]
): boolean {
  const [startX, startY] = startPosition;
  const currentPipe = map[startX][startY];

  const [x, y] = adjacentPipePosition;
  const pipe = PIPES[map[x][y] as keyof typeof PIPES];

  switch (pipe) {
    case 'NS':
      return (
        (startX === x - 1 &&
          startY === y &&
          ['S', '|', 'F', '7'].includes(currentPipe)) ||
        (startX === x + 1 &&
          startY === y &&
          ['S', '|', 'J', 'L'].includes(currentPipe))
      );
    case 'EW':
      return (
        (startY === y - 1 &&
          startX === x &&
          ['S', '-', 'F', 'L'].includes(currentPipe)) ||
        (startY === y + 1 &&
          startX === x &&
          ['S', '-', 'J', '7'].includes(currentPipe))
      );
    case 'NE':
      return (
        (startX === x - 1 &&
          startY === y &&
          ['S', '7', '|', 'F'].includes(currentPipe)) ||
        (startY === y + 1 &&
          startX === x &&
          ['S', '7', '-', 'J'].includes(currentPipe))
      );
    case 'NW':
      return (
        (startX === x - 1 &&
          startY === y &&
          ['S', 'F', '|', '7'].includes(currentPipe)) ||
        (startY === y - 1 &&
          startX === x &&
          ['S', 'F', '-', 'L'].includes(currentPipe))
      );
    case 'SW':
      return (
        (startX === x &&
          startY === y - 1 &&
          ['S', 'L', '-', 'F'].includes(currentPipe)) ||
        (startX === x + 1 &&
          startY === y &&
          ['S', 'L', '|', 'J'].includes(currentPipe))
      );
    case 'SE':
      return (
        (startX === x + 1 &&
          startY === y &&
          ['S', 'J', '|', 'L'].includes(currentPipe)) ||
        (startX === x &&
          startY === y + 1 &&
          ['S', 'J', '-', '7'].includes(currentPipe))
      );
  }
}

function getNextPosition(
  currentPosition: Position,
  map: string[][]
): Position[] {
  const n = map.length;
  const m = map[0].length;
  const adjacentPositions = getAdjacentPositions(currentPosition, n, m);
  const adjacentPipesPositions = adjacentPositions.filter(
    ([x, y]) => map[x][y] !== GROUND
  );
  const correctPipesPositions = adjacentPipesPositions.filter(position =>
    checkAdjacentPipeCorrect(currentPosition, position, map)
  );

  return correctPipesPositions;
}

function calculate(
  startPosition: Position,
  startAdjacent: Position[],
  map: string[][]
) {
  const [a, b] = startPosition;
  const adjacentPipesPositions = startAdjacent.filter(
    ([x, y]) => map[x][y] !== GROUND && map[x][y] !== START
  );

  const correctPipesPositions = adjacentPipesPositions.filter(position =>
    checkAdjacentPipeCorrect(startPosition, position, map)
  );

  if (correctPipesPositions.length !== 2) {
    throw new Error('There should be only 2 pipes from S');
  }

  let distance = 1;
  let [first, second] = correctPipesPositions;

  let [x1, y1] = first;
  let [x2, y2] = second;

  const visited = new Set<string>([`${a},${b}`, `${x1},${y1}`, `${x2},${y2}`]);

  while (x1 !== x2 || y1 !== y2) {
    const next1 = getNextPosition([x1, y1], map).filter(
      ([a, b]) => !visited.has(`${a},${b}`)
    );

    const next2 = getNextPosition([x2, y2], map).filter(
      ([a, b]) => !visited.has(`${a},${b}`)
    );

    distance++;

    if (next1.length === 0 && next2.length === 0) {
      return distance;
    }

    if (next1.length !== 0) {
      [x1, y1] = next1[0];
      visited.add(`${x1},${y1}`);
    }

    if (next2.length !== 0) {
      [x2, y2] = next2[0];
      visited.add(`${x2},${y2}`);
    }
  }

  return distance;
}

function move(startingPosition: Position, map: string[][]) {
  const n = map.length;
  const m = map[0].length;
  const startAdjacent = getAdjacentPositions(startingPosition, n, m);
  const distance = calculate(startingPosition, startAdjacent, map);
  return distance;
}

// part 1
const { startingPosition, map } = parseInput(input);
const result = move(startingPosition, map);
console.log(result);
