import input from './input';

const isDigit = /^\d$/;

// index, value of the digit
type CalibrationValue = [number, number];

// first, last digit
type CalibrationValues = [CalibrationValue, CalibrationValue];

function findCalibrationValues(line: string): CalibrationValues {
  let first: number | null = null;
  let last: number | null = null;
  let i = 0;
  let j = line.length - 1;

  while (i <= j) {
    if (!first && isDigit.test(line[i])) {
      first = Number(line[i]);
    }

    if (!last && isDigit.test(line[j])) {
      last = Number(line[j]);
    }

    if (first && last) {
      return [
        [i, first],
        [j, last],
      ];
    }

    if (!first) {
      i++;
    }

    if (!last) {
      j--;
    }
  }

  if (first) {
    return [
      [i, first],
      [i, first],
    ];
  }

  if (last) {
    return [
      [j, last],
      [j, last],
    ];
  }

  throw new Error(`No calibration values found: ${line}`);
}

function sumCalibrationValues(values: CalibrationValues[]): number {
  return values.reduce(
    (acc, [[, first], [, last]]) => acc + (first * 10 + last),
    0
  );
}

// part 1

const parsedInput = input.split('\n');
const calibrationValues = parsedInput.map(findCalibrationValues);
const sum = sumCalibrationValues(calibrationValues);
console.log(sum);

// part 2

const wordToDigit: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function findWordsCalibrationValues(line: string): CalibrationValues {
  let first = Infinity;
  let firstWord = '';

  let last = -1;
  let lastWord = '';

  for (const wordDigit of Object.keys(wordToDigit)) {
    const index = line.indexOf(wordDigit);

    if (index > -1 && index < first) {
      first = index;
      firstWord = wordDigit;
    }

    const lastIndex = line.lastIndexOf(wordDigit);

    if (lastIndex > -1 && lastIndex > last) {
      last = lastIndex;
      lastWord = wordDigit;
    }
  }

  return [
    [first, wordToDigit[firstWord]],
    [last, wordToDigit[lastWord]],
  ];
}

function findCalibrationValuesWithWords(line: string): CalibrationValues {
  const wordsCalibrationValues = findWordsCalibrationValues(line);
  const digitsCalibrationValues = findCalibrationValues(line);

  if (!digitsCalibrationValues) {
    return wordsCalibrationValues;
  }

  const [firstWord, lastWord] = wordsCalibrationValues;
  const [firstDigit, lastDigit] = digitsCalibrationValues;

  let first = firstDigit;
  let last = lastDigit;

  if (firstWord[0] < firstDigit[0]) {
    first = firstWord;
  }

  if (lastWord[0] > lastDigit[0]) {
    last = lastWord;
  }

  return [first, last];
}

const calibrationValues2 = parsedInput.map(findCalibrationValuesWithWords);
const sum2 = sumCalibrationValues(calibrationValues2);
console.log(sum2);
