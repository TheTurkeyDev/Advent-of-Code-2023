import { header, lap } from '../base';
import { input } from './inputs/day-16';

type Point = {
    readonly x: number
    readonly y: number
}

type PossiblePath = {
    readonly p: Point
    readonly facing: string
    readonly score: number
    readonly path: ReadonlySet<string>
}

header(16);

const directionOffset = (p: Point, d: string) => {
    switch (d) {
        case '^':
            return { x: p.x, y: p.y - 1 };
        case '>':
            return { x: p.x + 1, y: p.y };
        case 'v':
            return { x: p.x, y: p.y + 1 };
        case '<':
            return { x: p.x - 1, y: p.y };
    }
    return p;
};

const map = input.split('\n').map(line => line.split(''));
const start = map.reduce((pt, row, rowI) => row.reduce((p, c, colI) => c === 'S' ? { x: colI, y: rowI } : p, pt), { x: 0, y: 0 });

const pointLowScores = new Map<string, number>();
const queue = [{ p: start, facing: '>', score: 0, path: new Set<string>() }];
// eslint-disable-next-line functional/prefer-readonly-type
const lowPaths = [] as PossiblePath[];
while (queue.length > 0) {
    const pp = queue.pop();
    if (!pp)
        continue;
    const ppStr = `${pp.p.x},${pp.p.y}`;
    const dp = `${ppStr}-${pp.facing}`;
    if (pointLowScores.get(dp) ?? Number.MAX_VALUE < pp.score)
        continue;
    pointLowScores.set(dp, pp.score);

    ['^', '>', 'v', '<'].forEach(d => {
        const offsetPoint = directionOffset(pp.p, d);
        const c = map[offsetPoint.y][offsetPoint.x];
        if (c === 'E' && d === pp.facing) {
            const newPath = pp.path;
            newPath.add(ppStr);
            lowPaths.push({ p: offsetPoint, facing: d, score: pp.score + 1, path: newPath });
            return;
        }
        if (c === '#')
            return;

        const newSet = new Set<string>(pp.path);
        newSet.add(ppStr);
        if (d !== pp.facing)
            queue.push({ p: pp.p, facing: d, score: pp.score + 1000, path: newSet });
        else
            queue.push({ p: offsetPoint, facing: d, score: pp.score + 1, path: newSet });
        queue.sort((a, b) => b.score - a.score);
    });
}
console.log(lowPaths.length);
lap(lowPaths[0].score);
const points = lowPaths.reduce((arr, pp) => {
    pp.path.forEach(p => arr.add(p));
    return arr;
}, new Set<string>());
lap(points.size + 1);