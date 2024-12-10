import { input } from './inputs/day-6';

const lines = input.split('\n');
const times = lines[0].substring(5).trim().split(' ').map(t => parseInt(t, 10));
const distances = lines[1].substring(9).trim().split(' ').map(t => parseInt(t, 10));

const part1 = times.map(t => Array.from({ length: t }).map((_, i) => i * (t - i)))
    .reduce((prod, opts, index) => prod * Math.max(opts.filter(o => o > distances[index]).length, 1), 1);

console.log(`Part 1: ${part1}`);

const time = parseInt(lines[0].substring(5).replaceAll(' ', ''), 10);
const distance = parseInt(lines[1].substring(9).replaceAll(' ', ''), 10);
const options = Array.from({ length: time }).map((_, i) => i * (time - i)).filter(o => o > distance).length;

console.log(`Part 2: ${options}`);