import { header, lap } from '../base';
import { input } from './inputs/day-18';

header(18);

const WIDTH = 70;
const HEIGHT = 70;

type Point = {
    readonly x: number,
    readonly y: number
}

type PossiblePath = {
    readonly p: Point
    readonly path: readonly Point[]
}

const within = (p: Point, width: number, height: number) => p.y >= 0 && p.y < height && p.x >= 0 && p.x < width;
const hasPoint = (p: Point, pts: readonly Point[]) => !!pts.find(pt => pt.x === p.x && pt.y === p.y);

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

const getMinSteps = (bytes: readonly Point[]) => {
    // eslint-disable-next-line functional/prefer-readonly-type
    const visited = [] as Point[];
    const queue = [{ p: { x: 0, y: 0 }, path: [] } as PossiblePath];
    while (queue.length > 0) {
        const pp = queue.shift();
        if (!pp || hasPoint(pp.p, visited))
            continue;
        visited.push(pp.p);

        const hitsEnd = ['^', '>', 'v', '<'].map(d => directionOffset(pp.p, d)).some(offsetPoint => {
            if (offsetPoint.x === WIDTH && offsetPoint.y === HEIGHT)
                return true;
            if (!(!within(pp.p, WIDTH + 1, HEIGHT + 1) || hasPoint(offsetPoint, visited) || hasPoint(offsetPoint, bytes)))
                queue.push({ p: offsetPoint, path: [...pp.path, pp.p] });
            return false;
        });

        if (hitsEnd)
            return [...pp.path, { x: WIDTH, y: HEIGHT }];
    }

    return [];
};

const fallingBytes = input.split('\n').map(line => {
    const parts = line.split(',').map(n => parseInt(n));
    return { x: parts[0], y: parts[1] };
});

const steps = getMinSteps(fallingBytes.slice(0, 1024));
lap(steps.length);

const part2 = fallingBytes.slice(1023).reduce((data, blocker, i) => {
    if (data.answer !== '')
        return data;

    if (hasPoint(blocker, data.steps)) {
        const newSteps = getMinSteps(fallingBytes.slice(0, i + 1024));
        return { answer: newSteps.length === 0 ? blocker.x + ',' + blocker.y : '', steps: newSteps };
    }
    return data;
}, { answer: '', steps });

lap(part2.answer);