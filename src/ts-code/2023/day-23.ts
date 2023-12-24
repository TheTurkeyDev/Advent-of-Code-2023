/* eslint-disable functional/prefer-readonly-type */
import { input } from './day-23-input';

// const test = `#.#####################
// #.......#########...###
// #######.#########.#.###
// ###.....#.>.>.###.#.###
// ###v#####.#v#.###.#.###
// ###.>...#.#.#.....#...#
// ###v###.#.#.#########.#
// ###...#.#.#.......#...#
// #####.#.#.#######.#.###
// #.....#.#.#.......#...#
// #.#####.#.#.#########v#
// #.#...#...#...###...>.#
// #.#.#v#######v###.###v#
// #...#.>.#...>.>.#.###.#
// #####v#.#.###v#.#.###.#
// #.....#...#...#.#.#...#
// #.#########.###.#.#.###
// #...###...#...#...#.###
// ###.###.#.###v#####v###
// #...#...#.#.>.>.#.>.###
// #.###.###.#.###.#.#v###
// #.....###...###...#...#
// #####################.#`;
const map = input.split('\n').map(l => l.split(''));

const startingPos = { y: 0, x: map[0].findIndex(c => c === '.') };

const isValidPath = (c: string, slopeC: string, p2: boolean) => p2 ? c !== '#' : (c === '.' || c === slopeC);

const getLongestPath = (currPath: Set<string>, pos: { x: number, y: number }, part2: boolean): Set<string> => {
    const nextSteps = [];

    // console.log(pos);

    while (pos.y !== map.length - 1) {
        if (pos.y !== 0) {
            const upChar = map[pos.y - 1][pos.x];
            if (isValidPath(upChar, '^', part2) && !currPath.has(`${pos.x},${pos.y - 1}`))
                nextSteps.push({ x: pos.x, y: pos.y - 1 });
        }
        const downChar = map[pos.y + 1][pos.x];
        if (isValidPath(downChar, 'v', part2) && !currPath.has(`${pos.x},${pos.y + 1}`))
            nextSteps.push({ x: pos.x, y: pos.y + 1 });
        const leftChar = map[pos.y][pos.x - 1];
        if (isValidPath(leftChar, '<', part2) && !currPath.has(`${pos.x - 1},${pos.y}`))
            nextSteps.push({ x: pos.x - 1, y: pos.y });
        const rightChar = map[pos.y][pos.x + 1];
        if (isValidPath(rightChar, '>', part2) && !currPath.has(`${pos.x + 1},${pos.y}`))
            nextSteps.push({ x: pos.x + 1, y: pos.y });

        if (nextSteps.length > 1) {
            return nextSteps.reduce((longest, path) => {
                const newPath = new Set<string>(currPath);
                newPath.add(`${path.x},${path.y}`);
                const subPath = getLongestPath(newPath, { x: path.x, y: path.y }, part2);
                return subPath.size > longest.size ? subPath : longest;
            }, new Set<string>);
        }
        else {
            const next = nextSteps.pop();
            if (next !== undefined) {
                pos.x = next.x;
                pos.y = next.y;
                currPath.add(`${next.x},${next.y}`);
            }
            else {
                return new Set<string>;
            }
        }
    }

    return currPath;
};

const path = getLongestPath(new Set<string>, startingPos, false);
console.log(`Part 1: ${path.size}`);

const path2 = getLongestPath(new Set<string>, startingPos, true);
console.log(`Part 2: ${path2.size - 1}`);

// map.forEach((l, y) => {
//     const editedLine = l.map((c, x) => path.has(`${x},${y}`) ? 'O' : c);
//     console.log(editedLine.join(''));
// });