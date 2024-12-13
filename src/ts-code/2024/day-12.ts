import { header, lap } from '../base';
import { input } from './inputs/day-12';

header(12);
const map = input.split('\n').map(line => line.split(''));

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

const pointsHas = (pts: readonly Point[], p: Point) => !!pts.find(pt => pt.col === p.col && pt.row === p.row);
const within = (p: Point, width: number, height: number) => p.row >= 0 && p.row < height && p.col >= 0 && p.col < width;

const countSubSides = (sides: ReadonlyMap<string, readonly Point[]>, side: string, sideCount: number, isRow: boolean) => {
    const sidePoints = sides.get(side) ?? [];
    const val = parseInt(side.substring(0, side.indexOf(',')));
    const min = sidePoints.reduce((min, p) => Math.min(min, isRow ? p.row : p.col), Number.MAX_VALUE);
    const max = sidePoints.reduce((min, p) => Math.max(min, isRow ? p.row : p.col), Number.MIN_VALUE);
    return Array.from({ length: (max - min) + 1 }, (_, i) => min + i).reduce((data, i) => {
        const p1 = isRow ? { row: i, col: val } : { row: val, col: i };
        if (!data.lastHad && pointsHas(sidePoints, p1))
            return { lastHad: true, count: data.count + 1 };
        if (data.lastHad && !pointsHas(sidePoints, p1))
            return { lastHad: false, count: data.count };
        return { lastHad: data.lastHad, count: data.count };
    }, { lastHad: false, count: sideCount }).count;
};

const countSides = (sides: ReadonlyMap<string, readonly Point[]>) => (
    [...sides.keys()].reduce((sideCount, side) => (
        countSubSides(sides, side, sideCount, side.includes(',1') || side.includes(',3'))
    ), 0)
);

const getPlot = (p: Point) => {
    const plotChar = map[p.row][p.col];
    const sides = new Map<string, readonly Point[]>();
    // eslint-disable-next-line functional/no-let
    let perimeter = 0;
    const locs = new Set<Point>();
    const toVisit = [p];

    while (toVisit.length > 0) {
        const pos = toVisit.pop();
        if (!pos || pointsHas([...locs.values()], pos))
            continue;
        map[pos.row][pos.col] = '.';
        locs.add(pos);
        perimeter = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT].reduce((permsSum, d) => {
            const off = directionOffset(pos, d);
            if (pointsHas([...locs.values()], off))
                return permsSum;

            if (within(off, map.length, map[0].length) && map[off.row][off.col] === plotChar) {
                toVisit.push(off);
                return permsSum;
            }

            const key = (d === Direction.LEFT || d === Direction.RIGHT ? pos.col : pos.row) + ',' + d;
            sides.set(key, [...(sides.get(key) ?? []), pos]);
            return permsSum + 1;
        }, perimeter);
    }
    return [locs.size * perimeter, locs.size * countSides(sides)];
};

const parts = Array.from({ length: map.length }, (_, i) => i).reduce((ans, row) => (
    Array.from({ length: map[0].length }, (_, i) => i).reduce((answers, col) => {
        if (map[row][col] === '.')
            return answers;
        const partAnswers = getPlot({ row, col });
        return [answers[0] + partAnswers[0], answers[1] + partAnswers[1]];
    }, ans)
), [0, 0]);
lap(parts[0]);
lap(parts[1]);