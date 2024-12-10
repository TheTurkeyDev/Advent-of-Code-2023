import { input } from './inputs/day-8';

const orig = input.split('\n');
const x = orig.map(l => l.substring(1, l.length - 1).replaceAll(/\\x[0-9a-f]{2}/g, '1').replaceAll(/\\"/g, '"').replaceAll(/\\\\/g, '\\'));
const answer = x.reduce((prev, l, i) => prev + (orig[i].length - l.length), 0);

console.log(`Part 1: ${answer}`);

const encoded = orig.map(l => `"${l.replaceAll(/\\/g, '\\\\').replaceAll(/"/g, '\\"')}"`);
const answer2 = encoded.reduce((prev, l, i) => prev + (l.length - orig[i].length), 0);
console.log(`Part 2: ${answer2}`);