import { input } from './inputs/day-10';

type Point = {
    readonly row: number,
    readonly col: number
}

enum Direction {
    UP,
    RIGHT,
    DOWN,
    LEFT
}

const directionOffset = (point: Point, dir: Direction) => {
    switch (dir) {
        case Direction.UP: return { row: point.row - 1, col: point.col };
        case Direction.RIGHT: return { row: point.row, col: point.col + 1 };
        case Direction.DOWN: return { row: point.row + 1, col: point.col };
        case Direction.LEFT: return { row: point.row, col: point.col - 1 };
    };
};

const map = input.split('\n').map(line => line.split('').map(n => parseInt(n)));
const trailHeads = map.reduce((heads, row, rowI) => row.reduce((heads2, col, colI) => [...heads2, ...(col === 0 ? [{ row: rowI, col: colI }] : [])], heads), [] as readonly Point[]);

const getEndPoints = (map: readonly (readonly number[])[], start: Point, p: Point): readonly string[] => {
    const currHeight = map[p.row][p.col];
    return [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT]
        .map(d => directionOffset(p, d))
        .filter(p => p.row >= 0 && p.row < map.length && p.col >= 0 && p.col < map[0].length)
        .reduce((pts, nextP) => (
            map[nextP.row][nextP.col] === currHeight + 1
                ? [...pts, ...(map[nextP.row][nextP.col] === 9 ? [`${start.row},${start.col}-${nextP.row},${nextP.col}`] : getEndPoints(map, start, nextP))]
                : pts
        ), [] as readonly string[]);
};

const totalTrails = trailHeads.reduce((heads, head) => [...heads, ...getEndPoints(map, head, head)], [] as readonly string[]);

console.log(`Part 1: ${new Set<string>(totalTrails).size}`);
console.log(`Part 2: ${totalTrails.length}`);