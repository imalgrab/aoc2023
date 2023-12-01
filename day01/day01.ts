import input from './input';

const isDigit = /^\d$/;

function findCalibrationValues(line: string): [number, number] {
  let first: number | null = null;
  let last: number | null = null;
  let i = 0;
  let j = line.length - 1;

  while (i <= j) {
    if (first === null && isDigit.test(line[i])) {
      first = Number(line[i]);
    }

    if (last === null && isDigit.test(line[j])) {
      last = Number(line[j]);
    }

    if (first !== null && last !== null) {
      return [first, last];
    }

    if (first === null) {
      i++;
    }

    if (last === null) {
      j--;
    }
  }

  if (first !== null) {
    return [first, first];
  }

  if (last !== null) {
    return [last, last];
  }

  throw new Error(`No calibration values found: ${line}`);
}

function sumCalibrationValues(values: [number, number][]): number {
  return values.reduce((acc, [first, last]) => acc + (first * 10 + last), 0);
}

// part 1

const parsedInput = input.split('\n');
const calibrationValues = parsedInput.map(findCalibrationValues);
const sum = sumCalibrationValues(calibrationValues);
console.log(sum);

// part 2

const WORD_DIGITS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
] as const;

const wordToDigit = WORD_DIGITS.reduce((acc, word, index) => {
  acc[word] = index + 1;
  return acc;
}, {} as Record<string, number>);

function findCalibrationValuesWithWords(
  line: string
): [[number, number], [number, number]] {
  let first = Infinity;
  let firstWord = '';

  let last = -1;
  let lastWord = '';

  for (const wordDigit of WORD_DIGITS) {
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

function findCalibrationValuesWithIndex(
  line: string
): [[number, number], [number, number]] | null {
  let first: number | null = null;
  let last: number | null = null;
  let i = 0;
  let j = line.length - 1;

  while (i <= j) {
    if (first === null && isDigit.test(line[i])) {
      first = Number(line[i]);
    }

    if (last === null && isDigit.test(line[j])) {
      last = Number(line[j]);
    }

    if (first !== null && last !== null) {
      return [
        [i, first],
        [j, last],
      ];
    }

    if (first === null) {
      i++;
    }

    if (last === null) {
      j--;
    }
  }

  if (first !== null) {
    return [
      [i, first],
      [i, first],
    ];
  }

  if (last !== null) {
    return [
      [j, last],
      [j, last],
    ];
  }

  return null;
}

function findCalibrationValues2(line: string): [number, number] {
  const words = findCalibrationValuesWithWords(line);
  const [firstWord, lastWord] = words;

  const digits = findCalibrationValuesWithIndex(line);

  if (digits === null) {
    return [firstWord[1], lastWord[1]];
  }

  const [firstDigit, lastDigit] = digits;

  let first = firstDigit[1];
  let last = lastDigit[1];

  if (firstWord[0] < firstDigit[0]) {
    first = firstWord[1];
  }

  if (lastWord[0] > lastDigit[0]) {
    last = lastWord[1];
  }

  return [first, last];
}

const calibrationValues2 = parsedInput.map(findCalibrationValues2);
const sum2 = sumCalibrationValues(calibrationValues2);
console.log(sum2);
