import input from './input';
const isDigit = /^[0-9]$/;
const isSymbol = /^[^0-9.]$/;

function createMatrix(input: string): string[][] {
  return input.split('\n').map(line => line.split(''));
}

export function checkIfSymbolAdjacent(
  schematic: string[][],
  i: number,
  j: number
): boolean {
  const n = schematic.length;
  const m = schematic[i].length;
  let hasSymbolAdjacent = false;

  if (!isDigit.test(schematic[i][j])) {
    return false;
  }

  if (i !== 0) {
    hasSymbolAdjacent ||= isSymbol.test(schematic[i - 1][j]);
  }

  if (i !== n - 1) {
    hasSymbolAdjacent ||= isSymbol.test(schematic[i + 1][j]);
  }

  if (j !== 0) {
    hasSymbolAdjacent ||= isSymbol.test(schematic[i][j - 1]);
  }

  if (j !== m - 1) {
    hasSymbolAdjacent ||= isSymbol.test(schematic[i][j + 1]);
  }

  if (i !== 0 && j !== 0) {
    hasSymbolAdjacent ||= isSymbol.test(schematic[i - 1][j - 1]);
  }

  if (i !== 0 && j !== m - 1) {
    hasSymbolAdjacent ||= isSymbol.test(schematic[i - 1][j + 1]);
  }

  if (i !== n - 1 && j !== 0) {
    hasSymbolAdjacent ||= isSymbol.test(schematic[i + 1][j - 1]);
  }

  if (i !== n - 1 && j !== m - 1) {
    hasSymbolAdjacent ||= isSymbol.test(schematic[i + 1][j + 1]);
  }

  return hasSymbolAdjacent;
}

export function checkIfPartNumber(
  schematic: string[][],
  row: number,
  startColumn: number,
  endColumn: number
) {
  let isPartNumber = false;

  let i = startColumn;
  while (i < endColumn) {
    isPartNumber = isPartNumber || checkIfSymbolAdjacent(schematic, row, i);
    i++;
  }

  return isPartNumber;
}

function sumPartNumbers(schematic: string[][]) {
  const n = schematic.length;
  const m = schematic[0].length;

  let sum = 0;

  for (let i = 0; i < n; i++) {
    let number = '';
    for (let j = 0; j < m; j++) {
      const current = schematic[i][j];
      const isCurrentDigit = isDigit.test(current);

      if (isCurrentDigit) {
        number += current;
      }

      if (number !== '' && (j === m - 1 || !isCurrentDigit)) {
        const start = j - number.length;
        const end = j;
        const isPartNumber = checkIfPartNumber(schematic, i, start, end);

        if (isPartNumber) {
          sum += parseInt(number);
        }

        number = '';
      }
    }
  }

  return sum;
}

// part1
const matrix = createMatrix(input);
const sum = sumPartNumbers(matrix);
console.log(sum);
