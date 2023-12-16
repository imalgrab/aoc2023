import input from './input';

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

  let startFound = false;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === START) {
        startingPosition = [i, j];
        startFound = true;
        break;
      }
    }

    if (startFound) {
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

function checkAdjacentPipe(
  current: Position,
  adjacent: Position,
  map: string[][]
): boolean {
  const [x, y] = current;
  const pipe = map[x][y];

  const [adjX, adjY] = adjacent;
  const adjPipe = map[adjX][adjY];

  if (adjX === x - 1) {
    return (
      ['|', '7', 'F'].includes(adjPipe) && ['S', '|', 'J', 'L'].includes(pipe)
    );
  }

  if (adjX === x + 1) {
    return (
      ['|', 'J', 'L'].includes(adjPipe) && ['S', '|', '7', 'F'].includes(pipe)
    );
  }

  if (adjY === y - 1) {
    return (
      ['-', 'L', 'F'].includes(adjPipe) && ['S', '-', 'J', '7'].includes(pipe)
    );
  }

  if (adjY === y + 1) {
    return (
      ['-', '7', 'J'].includes(adjPipe) && ['S', '-', 'L', 'F'].includes(pipe)
    );
  }

  return false;
}

function getNextPositions(
  currentPosition: Position,
  map: string[][]
): Position[] {
  const n = map.length;
  const m = map[0].length;
  const adjacentPositions = getAdjacentPositions(currentPosition, n, m);
  const pipesPositions = adjacentPositions.filter(position =>
    checkAdjacentPipe(currentPosition, position, map)
  );

  return pipesPositions;
}

function calculateLongestDistance(startPosition: Position, map: string[][]) {
  const [a, b] = startPosition;
  let distance = 1;

  const startAdjacent = getNextPositions(startPosition, map);

  let [x, y] = startAdjacent[0];
  let [endX, endY] = startAdjacent[1];

  const visited = new Set<string>([`${a},${b}`, `${x},${y}`]);

  while (x !== endX || y !== endY) {
    const nextPositions = getNextPositions([x, y], map);

    for (const [nextX, nextY] of nextPositions) {
      if (!visited.has(`${nextX},${nextY}`)) {
        visited.add(`${nextX},${nextY}`);
        x = nextX;
        y = nextY;
        break;
      }
    }

    distance++;
  }

  return (distance + 1) / 2;
}

// part 1
const { startingPosition, map } = parseInput(input);
const result = calculateLongestDistance(startingPosition, map);
console.log(result);
