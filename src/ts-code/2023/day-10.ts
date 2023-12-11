/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-let */
import { input } from './day-10-input';

const downChars = ['|', 'F', '7'];
const upChars = ['|', 'J', 'L'];
const leftChars = ['-', 'J', '7'];
const rightChars = ['-', 'F', 'L'];

const map = input.split('\n').map(l => l.split(''));

const getStartingPos = () => {
    const y = map.findIndex(l => l.includes('S'));
    const x = map[y].findIndex(c => c === 'S');
    return [x, y];
};

const arePosEqual = (pos1: readonly number[], pos2: readonly number[]) => pos1[0] === pos2[0] && pos1[1] === pos2[1];
const isInBounds = (pos: readonly number[]) => pos[1] >= 0 && pos[1] < map.length && pos[0] >= 0 && pos[0] < map[0].length;
const posToInt = (pos: readonly number[]) => (pos[1] * map[0].length) + pos[0];

const startingPos = getStartingPos();
//TODO Not hard code?
let lastPositions = [startingPos, startingPos];
let positions = [[startingPos[0], startingPos[1] + 1], [startingPos[0] - 1, startingPos[1]]];
let moves = 1;

const getConnecting = (pos: readonly number[], lastPos: readonly number[]) => {
    const char = map[pos[1]][pos[0]];

    const iters = [
        { chars: upChars, newPos: [pos[0], pos[1] - 1] },
        { chars: downChars, newPos: [pos[0], pos[1] + 1] },
        { chars: rightChars, newPos: [pos[0] + 1, pos[1]] },
        { chars: leftChars, newPos: [pos[0] - 1, pos[1]] }
    ];

    const i = iters.findIndex(iter => (
        iter.chars.includes(char) && isInBounds(iter.newPos) && !arePosEqual(iter.newPos, lastPos)
    ));

    return iters[i]?.newPos ?? [0, 0];
};

const pathPositions = Array.from({ length: map.length }).fill([]) as number[][];
pathPositions[startingPos[1]].push(posToInt(startingPos));
pathPositions[positions[0][1]].push(posToInt(positions[0]));
pathPositions[positions[1][1]].push(posToInt(positions[1]));
while (!arePosEqual(positions[0], positions[1])) {
    const pos1 = positions[0];
    const newPos1 = getConnecting(pos1, lastPositions[0]);
    const pos2 = positions[1];
    const newPos2 = getConnecting(pos2, lastPositions[1]);
    lastPositions = [pos1, pos2];
    positions = [newPos1, newPos2];
    pathPositions[newPos1[1]].push(posToInt(newPos1));
    pathPositions[newPos2[1]].push(posToInt(newPos2));
    moves++;
}

console.log(`Part 1: ${moves}`);

const containedPos = [] as number[];
map.forEach((mapY, y) => {
    const yPathPos = pathPositions[y];
    mapY.forEach((_, x) => {
        const num = y * mapY.length;
        if (yPathPos.length <= 2 || yPathPos.includes(num + x))
            return;

        const isInside = Array.from({ length: x + 1 }).map((_, i, arr) => (arr.length - i) - 1).reduce((isInside, xx) => {
            if (yPathPos.includes(num + xx) && 'JL|'.includes(mapY[xx]))
                isInside = !isInside;
            return isInside;
        }, false);

        if (isInside)
            containedPos.push(posToInt([x, y]));
    });
});

console.log(`Part 2: ${containedPos.length}`);