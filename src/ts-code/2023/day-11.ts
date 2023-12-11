/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-let */
import { input } from './day-11-input';

const map = input.split('\n').map(l => l.split(''));
const emptyRows = [] as number[];
const emptyColumns = [] as number[];

for (let y = 0; y < map.length; y++) {
    let lineEmpty = true;
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] !== '.') {
            lineEmpty = false;
            break;
        }
    }
    if (lineEmpty)
        emptyRows.push(y);
}


for (let x = 0; x < map[0].length; x++) {
    let lineEmpty = true;
    for (let y = 0; y < map.length; y++) {
        if (map[y][x] !== '.') {
            lineEmpty = false;
            break;
        }
    }
    if (lineEmpty)
        emptyColumns.push(x);
}


const getDistanceToAll = (startX: number, startY: number, expansionSize: number) => {
    let distance = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '.' || (startX === x && startY === y))
                continue;
            if (y < startY || (y === startY && x < startX))
                continue;
            const cols = emptyColumns.filter(c => c > Math.min(x, startX) && c < Math.max(x, startX)).length * (expansionSize - 1);
            const rows = emptyRows.filter(r => r > Math.min(y, startY) && r < Math.max(y, startY)).length * (expansionSize - 1);
            distance += Math.abs(y - startY) + Math.abs(x - startX) + cols + rows;
        }
    }
    return distance;
};

let part1 = 0;
let part2 = 0;

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === '.')
            continue;
        part1 += getDistanceToAll(x, y, 2);
        part2 += getDistanceToAll(x, y, 1000000);
    }
}

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);