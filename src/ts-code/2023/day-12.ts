/* eslint-disable functional/no-let */
import { input } from './day-12-input';

const testStringValidity = (template: string, test: string) => (
    test.split('').filter((c, i) => !(template.charAt(i) === c || template.charAt(i) === '?')).length === 0
);


// eslint-disable-next-line functional/prefer-readonly-type
let cache: { [key: string]: number } = {};

const recurse = (seq: string, sums: readonly number[]): number => {
    const sum = sums[0];
    const remainingLength = sums.slice(1).reduce((sum, n) => sum + n, 0) + (sums.length - 2);
    const isLast = sums.length === 1;
    let valid = 0;
    for (let i = 0; i < seq.length - (remainingLength + sum); i++) {
        const ss = isLast ? seq : seq.substring(0, i + sum + 1);
        const testStr = '.'.repeat(i) + '#'.repeat(sum) + '.'.repeat(isLast ? seq.length - sum - i : 1);
        if (testStringValidity(ss, testStr)) {
            if (isLast) {
                valid++;
            }
            else {
                const key = `${seq.substring(i + sum + 1)}-${sums.slice(1).join(',')}`;
                if (cache[key]) {
                    valid += cache[key];
                }
                else {
                    const rec = recurse(seq.substring(i + sum + 1), sums.slice(1));
                    cache[key] = rec;
                    valid += rec;
                }
            }
        }
    }
    return valid;
};


const part1 = input.split('\n').map(l => l.split(' ')).reduce((sum, lineParts) => {
    const seq = lineParts[0];
    const sums = lineParts[1].split(',').map(n => parseInt(n, 10));
    return sum + recurse(seq, sums);
}, 0);

console.log(`Part 1 ${part1}`);

const part2 = input.split('\n').map(l => l.split(' ')).reduce((sum, lineParts) => {
    const firstHalf = (lineParts[0] + '?').repeat(5);
    const secondHalf = (lineParts[1] + ',').repeat(5);
    const seq = firstHalf.substring(0, firstHalf.length - 1);
    const sums = secondHalf.substring(0, secondHalf.length - 1).split(',').map(n => parseInt(n, 10));
    cache = {};
    return sum + recurse(seq, sums);
}, 0);

console.log(`Part 2 ${part2}`);