/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-let */
import { input } from './inputs/day-8';

type Node = {
    readonly [key: string]: {
        readonly left: string,
        readonly right: string
    }
}

const lines = input.split('\n');
const instructions = lines[0].split('');
const nodes = lines.slice(2).reduce((nodes, line) => {
    const node = line.substring(0, 3);
    const left = line.substring(7, 10);
    const right = line.substring(12, 15);
    return {
        ...nodes,
        [node]: {
            left,
            right
        }
    };
}, {} as Node);

let instructionsRun = 0;
let currentNode = 'AAA';
while (currentNode !== 'ZZZ') {
    const instruction = instructions[instructionsRun % instructions.length];
    const nodeChoices = nodes[currentNode];
    currentNode = instruction === 'R' ? nodeChoices.right : nodeChoices.left;
    instructionsRun++;
}
console.log(`Part 1: ${instructionsRun}`);

instructionsRun = 0;
let currentNodes = Object.keys(nodes).filter(n => n.endsWith('A'));
let gcf = Array.from({ length: currentNodes.length }).fill(0) as number[];
while (gcf.filter(n => n === 0).length > 0) {
    currentNodes = currentNodes.map((n, i) => {
        const instruction = instructions[instructionsRun % instructions.length];
        const nodeChoices = nodes[n];
        const nextNode = instruction === 'R' ? nodeChoices.right : nodeChoices.left;
        if (nextNode.endsWith('Z') && gcf[i] === 0)
            gcf[i] = instructionsRun + 1;
        return nextNode;
    });

    instructionsRun++;
}

const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
const lcm = (arr: number[]) => arr.reduce((x, y) => (x * y) / gcd(x, y));

console.log(`Part 2: ${lcm(gcf)}`);