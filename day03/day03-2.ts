import input from './input';

function parseInput(input: string): string[][] {
  const lines = input.split('\n');
  return lines.map(line => line.split(''));
}

function calculateGearRatio(x: number, y: number, matrix: string[][]): number {
  const isDigit = /^[0-9]$/;
  const n = matrix.length;
  const m = matrix[0].length;
  const dx = [-1, 0, 1];
  const dy = [-1, 0, 1];
  let adjacentNumbers = 0;

  const numbersInRows = new Map([
    [-1, 0],
    [0, 0],
    [1, 0],
  ]);

  for (const i of dx) {
    let numbersInRow = 0;
    for (const j of dy) {
      if (i === 0 && j === 0) {
        continue;
      }

      if (x + i < 0 || x + i >= n || y + j < 0 || y + j >= m) {
        continue;
      }

      if (isDigit.test(matrix[x + i][y + j])) {
        numbersInRow++;
      }
    }

    if (i !== 0 && numbersInRow > 1 && isDigit.test(matrix[x + i][y])) {
      numbersInRow = 1;
    }

    adjacentNumbers += numbersInRow;
    numbersInRows.set(i, numbersInRow);
  }

  if (adjacentNumbers !== 2) {
    return 0;
  }

  let left = -1;

  for (const [dx, numInRow] of numbersInRows.entries()) {
    let first = '';
    let second = '';

    if (numInRow === 2) {
      first = matrix[x + dx][y - 1];

      if (isDigit.test(matrix[x + dx][y - 2])) {
        first = matrix[x + dx][y - 2] + first;

        if (isDigit.test(matrix[x + dx][y - 3])) {
          first = matrix[x + dx][y - 3] + first;
        }
      }

      second = matrix[x + dx][y + 1];

      if (isDigit.test(matrix[x + dx][y + 2])) {
        second += matrix[x + dx][y + 2];

        if (isDigit.test(matrix[x + dx][y + 3])) {
          second += matrix[x + dx][y + 3];
        }
      }

      return Number(first) * Number(second);
    }

    if (numInRow === 1) {
      let current = '';
      let currentNumber = -1;

      if (isDigit.test(matrix[x + dx][y - 1])) {
        // left
        if (isDigit.test(matrix[x + dx][y - 2])) {
          if (isDigit.test(matrix[x + dx][y - 3])) {
            current += matrix[x + dx][y - 3];
          }
          current += matrix[x + dx][y - 2];
        }

        current += matrix[x + dx][y - 1];
      }

      if (isDigit.test(matrix[x + dx][y])) {
        // middle
        current += matrix[x + dx][y];
      }

      if (isDigit.test(matrix[x + dx][y + 1])) {
        // right
        current += matrix[x + dx][y + 1];

        if (isDigit.test(matrix[x + dx][y + 2])) {
          current += matrix[x + dx][y + 2];

          if (isDigit.test(matrix[x + dx][y + 3])) {
            current += matrix[x + dx][y + 3];
          }
        }
      }

      currentNumber = Number(current);

      if (left !== -1) {
        return left * currentNumber;
      }

      left = currentNumber;
    }
  }

  return 0;
}

function processGears(matrix: string[][]) {
  let sumOfGearRatios = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === '*') {
        const gearRatio = calculateGearRatio(i, j, matrix);
        sumOfGearRatios += gearRatio;
      }
    }
  }
  return sumOfGearRatios;
}

const parsedInput = parseInput(input);
const sum = processGears(parsedInput);
console.log(sum);
