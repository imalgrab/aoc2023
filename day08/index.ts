import input from './input';

type Step = 'L' | 'R';
type Network = Map<string, [string, string]>;

const DIRECTIONS = {
  L: 0,
  R: 1,
} as const;

function getData(input: string): [string, Network] {
  const network = new Map<string, [string, string]>();
  const [steps, , ...instructions] = input.split('\n');

  for (const instruction of instructions) {
    const [node, neighbours] = instruction.split(' = ');
    const [left, right] = neighbours.split(', ');
    network.set(node, [left.slice(1), right.slice(0, right.length - 1)]);
  }

  return [steps, network];
}

function findExit(steps: string, network: Network): number {
  let i = 0;
  let currentNode = 'AAA';
  while (currentNode !== 'ZZZ') {
    const step = steps[i % steps.length] as Step;
    const direction = DIRECTIONS[step];
    const nextNode = network.get(currentNode)![direction];
    currentNode = nextNode;
    i++;
  }

  return i;
}

// part1
const [steps, network] = getData(input);
// const stepsToExit = findExit(steps, network);
// console.log(stepsToExit);

// part2

function findExit2(steps: string, network: Network): number {
  let i = 0;
  let currentNodes = Array.from(network.keys()).filter(node =>
    node.endsWith('A')
  );

  let exitFound = currentNodes.every(node => node.endsWith('Z'));

  while (!exitFound) {
    const step = steps[i % steps.length] as Step;
    const direction = DIRECTIONS[step];

    let updatedNodes = currentNodes.slice();
    for (let j = 0; j < currentNodes.length; j++) {
      const node = currentNodes[j];

      const nextNode = network.get(node)![direction];
      updatedNodes[j] = nextNode;
    }

    i++;
    currentNodes = updatedNodes.slice();
    exitFound = currentNodes.every(node => node.endsWith('Z'));
  }

  return i;
}

const stepsToExit2 = findExit2(steps, network);
console.log(stepsToExit2);
