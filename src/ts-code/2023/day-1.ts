/* eslint-disable functional/no-let */
import { input } from './day-1-input';

const part1 = input.split('\n').map(l => {
    const matches = [...l.matchAll(/\d/g)];
    return parseInt(matches[0][0] + matches[matches.length - 1][0]);
}).reduce((sum, curr) => sum + curr, 0);
console.log(`Part 1: ${part1}`);

const parseMatch = (match: RegExpMatchArray) => {
    return match[0]
        .replace('zero', '0')
        .replace('one', '1')
        .replace('two', '2')
        .replace('three', '3')
        .replace('four', '4')
        .replace('five', '5')
        .replace('six', '6')
        .replace('seven', '7')
        .replace('eight', '8')
        .replace('nine', '9');
};

const part2Regex = /(\d|one|two|three|four|five|six|seven|eight|nine|zero)/g;
const part2 = input.split('\n').map(l => {
    const match1 = parseMatch(l.match(part2Regex)!);

    let index = l.length - 1;
    while (!l.substring(index).match(part2Regex)) {
        index--;
    }
    const match2 = parseMatch(l.substring(index).match(part2Regex)!);

    return parseInt(match1 + match2);
}).reduce((sum, curr) => sum + curr, 0);
console.log(`Part 2: ${part2}`);