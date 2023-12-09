/* eslint-disable functional/prefer-readonly-type */
import { input } from './day-9-input';

const parts = input.split('\n')
    .map(l => {
        const sequences = [l.split(' ').map(n => parseInt(n, 10))];
        while (sequences[sequences.length - 1].filter(n => n !== 0).length > 0) {
            sequences.push(
                sequences[sequences.length - 1]
                    .reduce((next, val, index, arr) => index === 0 ? [] : [...next, val - arr[index - 1]], [] as number[])
            );
        }

        const seqNextValues = sequences.reverse().reduce((nextValues, _, index, arr) => {
            if (index === 0)
                return [[0, 0]];
            const part1 = arr[index][arr[index].length - 1] + nextValues[nextValues.length - 1][0];
            const part2 = arr[index][0] - nextValues[nextValues.length - 1][1];
            return [...nextValues, [part1, part2]];
        }, [] as number[][]);
        return seqNextValues[seqNextValues.length - 1];
    })
    .reduce((sums, vs) => [sums[0] + vs[0], sums[1] + vs[1]], [0, 0]);


console.log(`Part 1: ${parts[0]}`);
console.log(`Part 2: ${parts[1]}`);