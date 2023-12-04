import input from './input';

function calculateCardMatches(input: string): Map<number, number> {
  const cardMatches = new Map<number, number>();
  const lines = input.split('\n');
  for (const line of lines) {
    const [cardData, numbers] = line.split(' | ');
    const [cardIdData, winningNumbersData] = cardData.split(': ');
    const cardId = cardIdData.split(' ').filter(c => c !== '')[1];
    const winningNumbers = winningNumbersData.split(' ').filter(c => c !== '');
    const actualNumbers = numbers.split(' ').filter(c => c !== '');

    let matches = 0;
    for (const number of actualNumbers) {
      if (winningNumbers.includes(number)) {
        matches++;
      }
    }

    cardMatches.set(Number(cardId), matches);
  }
  return cardMatches;
}

function calculateScore(matches: Map<number, number>): number {
  let score = 0;

  for (let [, match] of matches) {
    let cardScore = match > 0 ? 1 : 0;
    match--;
    while (match > 0) {
      cardScore *= 2;
      match--;
    }
    score += cardScore;
  }

  return score;
}

// part 1

const matches = calculateCardMatches(input);
const score = calculateScore(matches);
console.log(score);

// part 2

function calculateScorePart2(matches: Map<number, number>) {
  const gamesStack = [...matches.entries()];
  let score = 0;

  while (gamesStack.length !== 0) {
    const [cardId, cardMatches] = gamesStack.pop()!;
    score++;

    let i = cardId + 1;
    while (i <= cardMatches + cardId) {
      gamesStack.push([i, matches.get(i)!]);
      i++;
    }
  }

  return score;
}

const score2 = calculateScorePart2(matches);
console.log(score2);
