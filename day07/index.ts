import input from './input';

const CARDS = '23456789TJQKA';
const JOKER_CARDS = 'J23456789TQKA';

const VALUES = {
  fiveOfAKind: 6,
  fourOfAKind: 5,
  fullHouse: 4,
  threeOfAKind: 3,
  twoPair: 2,
  pair: 1,
  highCard: 0,
} as const;

function getHandsWithBids(input: string): [string, number][] {
  const lines = input.split('\n');
  const handsWithBids: [string, number][] = [];
  for (const line of lines) {
    const [hand, bid] = line.split(' ');
    handsWithBids.push([hand, parseInt(bid)]);
  }
  return handsWithBids;
}

export function getHandValue(
  hand: string,
  withJokers: boolean = false
): number {
  let numOfJokers = 0;
  const occurences = new Map<string, number>();
  for (const card of hand) {
    if (withJokers && card === 'J') {
      numOfJokers++;
    } else {
      const occurence = occurences.get(card) ?? 0;
      occurences.set(card, occurence + 1);
    }
  }

  if (numOfJokers >= 4) {
    return VALUES.fiveOfAKind;
  }

  let hasPair = false;
  let hasTriplet = false;

  const sortedOccurences = [...occurences.values()].sort((a, b) => b - a);

  for (const num of sortedOccurences) {
    if (num + numOfJokers === 5) {
      return VALUES.fiveOfAKind;
    }

    if (num + numOfJokers === 4) {
      return VALUES.fourOfAKind;
    }

    if (num + numOfJokers === 3) {
      hasTriplet = true;
      if (numOfJokers > 0) {
        numOfJokers = numOfJokers - 3 + num;
      }
    } else if (num + numOfJokers === 2) {
      if (hasTriplet) {
        return VALUES.fullHouse;
      }

      if (hasPair) {
        return VALUES.twoPair;
      }

      hasPair = true;
      if (numOfJokers > 0) {
        numOfJokers = numOfJokers - 2 + num;
      }
    }
  }

  if (hasTriplet) {
    return VALUES.threeOfAKind;
  }

  if (hasPair) {
    return VALUES.pair;
  }

  return VALUES.highCard;
}

function rankHands(
  hand1: [string, number, number],
  hand2: [string, number, number],
  withJokers: boolean = false
): number {
  const [cards1, , value1] = hand1;
  const [cards2, , value2] = hand2;

  if (value1 !== value2) {
    return value1 - value2;
  }

  const cardDeck = withJokers ? JOKER_CARDS : CARDS;
  for (let c = 0; c < cards1.length; c++) {
    const card1 = cards1[c];
    const card2 = cards2[c];
    const comparison = cardDeck.indexOf(card1) - cardDeck.indexOf(card2);
    if (comparison !== 0) {
      return comparison;
    }
  }

  return 0;
}

function calculateWinnings(
  handsWithBids: [string, number][],
  withJokers: boolean = false
): number {
  let winnings = 0;

  const handsWithValues: [string, number, number][] = handsWithBids.map(
    ([hand, bid]) => [hand, bid, getHandValue(hand, withJokers)]
  );

  const rankedHands = handsWithValues.sort((hand1, hand2) =>
    rankHands(hand1, hand2, withJokers)
  );

  for (let i = 0; i < rankedHands.length; i++) {
    const [, bid] = rankedHands[i];
    winnings += bid * (i + 1);
  }

  return winnings;
}

// part 1
const handsWithBids = getHandsWithBids(input);
const winnings = calculateWinnings(handsWithBids);
console.log(winnings);

// part 2

const winningsWithJokers = calculateWinnings(handsWithBids, true);
console.log(winningsWithJokers);
