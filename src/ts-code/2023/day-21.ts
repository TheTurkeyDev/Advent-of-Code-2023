/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-let */
import { input } from './day-21-input';

const test = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

const map = input.split('\n').map(l => l.split(''));
const width = map[0].length;
const height = map.length;

const getStaringPos = () => {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 'S') {
                return { x, y };
            }
        }
    }
    return { x: 0, y: 0 };
};

const getMapCordsForPos = (p: { x: number, y: number }) => `${Math.floor(p.x / map[0].length)}:${Math.floor(p.y / map.length)}`;


const getMapChar = (x: number, y: number, isInfinite: boolean) => {
    if (!isInfinite && (x < 0 || y < 0 || y >= map.length || x >= map[0].length))
        return '#';

    const adjX = (width + (x % width)) % width;
    const adjY = (height + (y % height)) % height;

    return map[adjY][adjX];
};

const getCanReach = (steps: number, isInfinite: boolean) => {
    let positionsHash = new Set<string>;
    const startingPos = getStaringPos();
    positionsHash.add(`${startingPos.x}:${startingPos.y}`);
    let finishedMaps: { [key: string]: number } = {};

    for (let step = 0; step < steps; step++) {
        const nextHash = new Set<string>;
        const editedMaps = new Set<string>;
        const finishedMapKeys = Object.keys(finishedMaps);
        positionsHash.forEach(p => {
            const parts = p.split(':');
            const px = parseInt(parts[0]);
            const py = parseInt(parts[1]);
            const up = { x: px, y: py - 1 };
            const down = { x: px, y: py + 1 };
            const left = { x: px - 1, y: py };
            const right = { x: px + 1, y: py };

            const upStr = `${up.x}:${up.y}`;
            const upMap = getMapCordsForPos(up);
            if (getMapChar(up.x, up.y, isInfinite) !== '#' && !nextHash.has(upStr) && !finishedMapKeys.includes(upMap)) {
                nextHash.add(upStr);
                editedMaps.add(upMap);
            }

            const downStr = `${down.x}:${down.y}`;
            const downMap = getMapCordsForPos(up);
            if (getMapChar(down.x, down.y, isInfinite) !== '#' && !nextHash.has(downStr) && !finishedMapKeys.includes(downMap)) {
                nextHash.add(downStr);
                editedMaps.add(downMap);
            }

            const leftStr = `${left.x}:${left.y}`;
            const leftMap = getMapCordsForPos(up);
            if (getMapChar(left.x, left.y, isInfinite) !== '#' && !nextHash.has(leftStr) && !finishedMapKeys.includes(leftMap)) {
                nextHash.add(leftStr);
                editedMaps.add(leftMap);
            }

            const rightStr = `${right.x}:${right.y}`;
            const rightMap = getMapCordsForPos(up);
            if (getMapChar(right.x, right.y, isInfinite) !== '#' && !nextHash.has(rightStr) && !finishedMapKeys.includes(rightMap)) {
                nextHash.add(rightStr);
                editedMaps.add(rightMap);
            }
        });
        positionsHash = nextHash;

        editedMaps.forEach(em => {
            const partsOff = em.split(':');
            const xOff = parseInt(partsOff[0], 10);
            const yOff = parseInt(partsOff[1], 10);
            const yMin = yOff * height;
            const yMax = (yOff * height) + (height - 1);
            const xMin = xOff * width;
            const xMax = (xOff * width) + (width - 1);
            if (positionsHash.has(`${xMin}:${yMin}`) && positionsHash.has(`${xMin}:${yMax}`) && positionsHash.has(`${xMax}:${yMin}`) && positionsHash.has(`${xMax}:${yMax}`)) {
                finishedMaps = {
                    ...finishedMaps,
                    [em]: step,
                };
            }
        });
    }

    // for (let y = 0; y < map.length; y++) {
    //     let str = '';
    //     for (let x = 0; x < map[y].length; x++) {
    //         str += positionsHash.has(`${x}:${y}`) ? '@' : map[y][x];
    //     }
    //     console.log(str);
    // }

    return positionsHash.size;
};

console.log(`Part 1: ${getCanReach(64, false)}`);
// console.log(`Part 2: ${getCanReach(5000, true)}`);