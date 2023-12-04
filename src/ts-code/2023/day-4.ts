/* eslint-disable functional/no-let */
import { input } from './day-4-input';

const winners = input.replaceAll('  ', ' ').split('\n').map(line => {
    const parts = line.split(':');
    const numbers = parts[1].split('|');
    const myNums = numbers[0].trim().split(' ').map(n => parseInt(n, 10));
    const winningNums = numbers[1].trim().split(' ').map(n => parseInt(n, 10));
    return myNums.filter(n => winningNums.includes(n)).length;
});

console.log(`Part 1: ${winners.reduce((sum, v) => sum + (v > 0 ? Math.pow(2, v - 1) : 0), 0)}`);

// eslint-disable-next-line functional/prefer-readonly-type
let counts = Array.from({ length: winners.length }).fill(1) as number[];
console.log(`Part 2: ${winners.reduce((sum, v, indx) => {
    counts = [
        ...counts.slice(0, indx + 1),
        ...counts.slice(indx + 1, indx + v + 1).map(old => old + counts[indx]),
        ...counts.slice(indx + v + 1)
    ];
    return sum + counts[indx];
}, 0)}`);