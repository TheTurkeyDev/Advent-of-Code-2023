import { header, lap } from '../base';
import { input } from './inputs/day-15';

type Point = {
    readonly x: number
    readonly y: number
}

header(15);

const inputParts = input.split('\n\n');
const map = inputParts[0].split('\n').map(line => line.split(''));
const map2 = inputParts[0].split('\n').map(line => line.split('').reduce((row, char) => {
    switch (char) {
        case '#':
        case '.':
            return [...row, char, char];
        case 'O':
            return [...row, '[', ']'];
        case '@':
            return [...row, char, '.'];
    }
    return row;
    // eslint-disable-next-line functional/prefer-readonly-type
}, [] as string[]));

const robot = map.reduce((pt, row, rowI) => row.reduce((p, c, colI) => c === '@' ? { x: colI, y: rowI } : p, pt), { x: 0, y: 0 });
const robot2 = map2.reduce((pt, row, rowI) => row.reduce((p, c, colI) => c === '@' ? { x: colI, y: rowI } : p, pt), { x: 0, y: 0 });

const steps = inputParts[1].split('\n').reduce((steps, line) => [...steps, ...line.split('')], [] as readonly string[]);

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
// eslint-disable-next-line functional/prefer-readonly-type
const move1 = (map: string[][], robot: Point, d: string) => {
    // eslint-disable-next-line functional/no-let
    let canMove = false;
    // eslint-disable-next-line functional/no-let
    let p = robot;
    const toMove = [];
    do {
        p = directionOffset(p, d);
        if (map[p.y][p.x] === '.') {
            canMove = true;
            break;
        }
        toMove.push(p);
    } while (map[p.y][p.x] !== '#');

    if (!canMove)
        return robot;

    toMove.reverse().forEach(pt => {
        const np = directionOffset(pt, d);
        map[np.y][np.x] = map[pt.y][pt.x];
    });
    map[robot.y][robot.x] = '.';
    robot = directionOffset(robot, d);
    map[robot.y][robot.x] = '@';
    return robot;
};

// eslint-disable-next-line functional/prefer-readonly-type
const move2 = (map: string[][], robot: Point, d: string) => {
    // eslint-disable-next-line functional/no-let
    let canMove = false;
    // eslint-disable-next-line functional/no-let
    let p = robot;
    // eslint-disable-next-line functional/prefer-readonly-type
    const boxes = [] as Point[];
    if (d === '<' || d === '>') {
        do {
            p = directionOffset(p, d);
            if (map[p.y][p.x] === '.') {
                canMove = true;
                break;
            }
            if (map[p.y][p.x] === '[')
                boxes.push(p);
        } while (map[p.y][p.x] !== '#');
    }
    else {
        // eslint-disable-next-line functional/no-let
        let wallFound = false;
        const lastBoxes = [];
        p = directionOffset(p, d);
        const nextChar = map[p.y][p.x];
        if (nextChar === '[')
            lastBoxes.push(p);
        else if (nextChar === ']')
            lastBoxes.push({ x: p.x - 1, y: p.y });
        else if (nextChar === '#')
            wallFound = true;
        else if (nextChar === '.')
            canMove = true;

        while (!wallFound && lastBoxes.length !== 0) {
            // eslint-disable-next-line functional/no-let
            let allEmpty = true;
            const nextBoxes = [];
            // eslint-disable-next-line functional/no-let
            for (let i = 0; i < lastBoxes.length; i++) {
                const box = lastBoxes[i];
                // eslint-disable-next-line functional/no-let
                for (let j = 0; j < 2; j++) {
                    const nextP = directionOffset({ x: box.x + j, y: box.y }, d);
                    const nextChar = map[nextP.y][nextP.x];
                    if (nextChar !== '.')
                        allEmpty = false;
                    if (nextChar === '#') {
                        wallFound = true;
                        break;
                    }
                    if (nextChar === '[')
                        nextBoxes.push(nextP);
                    else if (nextChar === ']')
                        nextBoxes.push({ x: nextP.x - 1, y: nextP.y });

                }
            }
            while (lastBoxes.length > 0) {
                const b = lastBoxes.pop();
                if (!!b && !boxes.find(bb => bb.x === b.x && bb.y === b.y))
                    boxes.push(b);
            }
            nextBoxes.forEach(b => lastBoxes.push(b));
            if (allEmpty) {
                canMove = true;
                break;
            }
        }
    }

    if (!canMove)
        return robot;

    //Clear out box locations
    boxes.forEach(pt => {
        map[pt.y][pt.x] = '.';
        map[pt.y][pt.x + 1] = '.';
    });
    //Set new box locations
    boxes.forEach(pt => {
        const np = directionOffset(pt, d);
        map[np.y][np.x] = '[';
        map[np.y][np.x + 1] = ']';
    });
    map[robot.y][robot.x] = '.';
    robot = directionOffset(robot, d);
    map[robot.y][robot.x] = '@';
    return robot;
};

steps.reduce((robots, d, i) => {
    const r1 = move1(map, robots[0], d);
    const r2 = move2(map2, robots[1], d);
    return [r1, r2];
}, [robot, robot2]);

const part1 = map.reduce((score, row, y) => row.reduce((scr, c, x) => scr + (c === 'O' ? (100 * y) + x : 0), score), 0);
lap(part1);
const part2 = map2.reduce((score, row, y) => row.reduce((scr, c, x) => scr + (c === '[' ? (100 * y) + x : 0), score), 0);
lap(part2);