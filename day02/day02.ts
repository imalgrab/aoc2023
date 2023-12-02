import input from './input';

function processGame(line: string): Map<string, number> {
  const game = new Map([
    ['red', 0],
    ['green', 0],
    ['blue', 0],
  ]);
  const sets = line.split('; ');
  for (const set of sets) {
    const parts = set.split(', ');
    for (const part of parts) {
      const [count, color] = part.split(' ');
      if (game.has(color)) {
        const updatedValue = Math.max(game.get(color) ?? 0, Number(count));
        game.set(color, updatedValue);
      }
    }
  }

  return game;
}

function processAllGames(input: string): Map<number, Map<string, number>> {
  const map = new Map<number, Map<string, number>>();

  const lines = input.split('\n');
  for (const line of lines) {
    const [gameId, parts] = line.split(': ');
    const [, id] = gameId.split(' ');
    const game = processGame(parts);
    map.set(Number(id), game);
  }

  return map;
}

function sumPossibleGameIds(red: number, green: number, blue: number): number {
  const games = processAllGames(input);
  let result = 0;

  for (const game of games) {
    const [id, values] = game;
    const reds = values.get('red') ?? 0;
    const greens = values.get('green') ?? 0;
    const blues = values.get('blue') ?? 0;

    if (reds <= red && greens <= green && blues <= blue) {
      result += id;
    }
  }

  return result;
}

// part 1

const sum = sumPossibleGameIds(12, 13, 14);
console.log(sum);

// part 2

function sumPowerOfSets() {
  const games = processAllGames(input);
  let sum = 0;
  for (const game of games) {
    const [, values] = game;
    const reds = values.get('red') ?? 0;
    const greens = values.get('green') ?? 0;
    const blues = values.get('blue') ?? 0;

    const power = reds * greens * blues;

    sum += power;
  }

  return sum;
}

const sumOfPowers = sumPowerOfSets();
console.log(sumOfPowers);
