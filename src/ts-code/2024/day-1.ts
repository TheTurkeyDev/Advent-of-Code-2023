import { input } from './inputs/day-1';

const parsed = input
    .split('\n')
    .map(l => l.split('   ').map(i => parseInt(i)))
    .reduce((prev, curr) => {
        return [
            [...prev[0], curr[0]],
            [...prev[1], curr[1]]
        ];
    }, [[], []] as readonly (readonly number[])[])
    .map(l => [...l].sort((a, b) => a - b));

const part1 = parsed[0].reduce((prev, curr, i) => prev + Math.abs(curr - parsed[1][i]), 0);
console.log(`Part 1: ${part1}`);
const part2 = parsed[0].reduce((prev, curr) => prev + (curr * parsed[1].filter(v => v === curr).length), 0);
console.log(`Part 2: ${part2}`);