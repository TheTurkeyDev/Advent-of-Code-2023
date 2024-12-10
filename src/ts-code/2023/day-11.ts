/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-let */
import { input } from './inputs/day-11';

const map = input.split('\n').map(l => l.split(''));
const emptyRows = [] as number[];
const emptyColumns = [] as number[];

map.forEach((l, y) => {
    const lineEmpty = l.reduce((notEmpty, c) => {
        if (c !== '.')
            return false;
        return notEmpty;
    }, true);
    if (lineEmpty)
        emptyRows.push(y);
});

map[0].forEach((_, x) => {
    const lineEmpty = map.reduce((notEmpty, _, y) => {
        if (map[y][x] !== '.')
            return false;
        return notEmpty;
    }, true);
    if (lineEmpty)
        emptyColumns.push(x);
});


const getDistanceToAll = (startX: number, startY: number, expansionSize: number) => {
    let distance = 0;
    map.forEach((row, y) => {
        row.forEach((char, x) => {
            if (char === '.' || (startX === x && startY === y))
                return;
            if (y < startY || (y === startY && x < startX))
                return;
            const cols = emptyColumns.filter(c => c > Math.min(x, startX) && c < Math.max(x, startX)).length * (expansionSize - 1);
            const rows = emptyRows.filter(r => r > Math.min(y, startY) && r < Math.max(y, startY)).length * (expansionSize - 1);
            distance += Math.abs(y - startY) + Math.abs(x - startX) + cols + rows;
        });
    });
    return distance;
};

let part1 = 0;
let part2 = 0;

map.forEach((row, y) => {
    row.forEach((char, x) => {
        if (char === '.')
            return;
        part1 += getDistanceToAll(x, y, 2);
        part2 += getDistanceToAll(x, y, 1000000);
    });
});

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);