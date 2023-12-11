import input from './input';

type Direction = 'L' | 'R';

function getReport(input: string): number[][] {
  const lines = input.split('\n');
  return lines.map(line => line.split(' ').map(Number));
}

function predictNextValue(history: number[], direction: Direction = 'R') {
  const diff: number[][] = [[...history]];

  while (true) {
    const prevDiff = diff[diff.length - 1];
    const nextDiff: number[] = [];

    for (let i = 1; i < prevDiff.length; i++) {
      nextDiff.push(prevDiff[i] - prevDiff[i - 1]);
    }

    diff.push(nextDiff);

    const allZero = diff[diff.length - 1].every(x => x === 0);

    if (allZero) {
      break;
    }
  }

  if (diff.length < 2) {
    const currDiff = diff[0];
    const index = direction === 'R' ? currDiff.length - 1 : 0;
    return currDiff[index];
  }

  for (let i = diff.length - 1; i >= 1; i--) {
    const currDiff = diff[i];
    const nextDiff = diff[i - 1];

    const currIndex = direction === 'R' ? currDiff.length - 1 : 0;
    const nextIndex = direction === 'R' ? nextDiff.length - 1 : 0;

    const currLastElem = currDiff[currIndex];
    currDiff.splice(currIndex, 0, currLastElem);

    const nextLastElem = nextDiff[nextIndex];
    const nextNewElem =
      direction === 'R'
        ? nextLastElem + currLastElem
        : nextLastElem - currLastElem;
    nextDiff.splice(currIndex, 0, nextNewElem);
  }

  const index = direction === 'R' ? diff[0].length - 1 : 0;
  return diff[0][index];
}

function sumExtrapolatedValues(
  report: number[][],
  direction: Direction = 'R'
): number {
  let sum = 0;
  for (const history of report) {
    const nextValue = predictNextValue(history, direction);
    sum += nextValue;
  }
  return sum;
}

// part 1

const report = getReport(input);
const sum = sumExtrapolatedValues(report);
console.log(sum);

// part 2
const sum2 = sumExtrapolatedValues(report, 'L');
console.log(sum2);
