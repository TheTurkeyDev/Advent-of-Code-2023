import { input } from './inputs/day-6';

type Point = {
    readonly row: number
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

const cycleCW = (dir: Direction) => {
    switch (dir) {
        case Direction.UP: return Direction.RIGHT;
        case Direction.RIGHT: return Direction.DOWN;
        case Direction.DOWN: return Direction.LEFT;
        case Direction.LEFT: return Direction.UP;
    };
};

const isCycle = (map: readonly (readonly string[])[], dir: Direction, guardLoc: Point) => {
    const visited = new Set<string>();
    while (true) {
        visited.add(`${guardLoc.row},${guardLoc.col},${dir}`);
        const next = directionOffset(guardLoc, dir);
        if (!(next.row >= 0 && next.row < map.length && next.col >= 0 && next.col < map[0].length))
            return false;

        if (map[next.row][next.col] === '#')
            dir = cycleCW(dir);
        else
            guardLoc = next;

        if (visited.has(`${guardLoc.row},${guardLoc.col},${dir}`))
            return true;
    }
};

// eslint-disable-next-line functional/no-let
let dir = Direction.UP;
// eslint-disable-next-line functional/no-let
let guardLoc = { row: 0, col: 0 } as Point;

const map = input.split('\n').reduce((mapRow, rowStr, row) => (
    [
        ...mapRow,
        rowStr.split('').reduce((mapCol, c, col) => {
            if (c === '^')
                guardLoc = { row, col };
            return [...mapCol, c];
        }, [] as readonly string[])
    ]
), [] as readonly (readonly string[])[]);

const visited = new Set<string>();
const obstructionPos = new Set<string>();
while (true) {
    visited.add(`${ guardLoc.row},${guardLoc.col}`);
    const next = directionOffset(guardLoc, dir);
    if (!(next.row >= 0 && next.row < map.length && next.col >= 0 && next.col < map[0].length))
        break;

    if (map[next.row][next.col] === '#')
        dir = cycleCW(dir);
    else
        guardLoc = next;

    const obstruction = directionOffset(guardLoc, dir);
    const or = obstruction.row;
    const oc = obstruction.col;
    if (or >= 0 && or < map.length && oc >= 0 && oc < map[0].length && map[or][oc] === '.' && !visited.has(`${ obstruction.row},${obstruction.col}`)) {
        const mapClone = map.map(m => [...m]);
        mapClone[or][oc] = '#';
        if (isCycle(mapClone, dir, guardLoc))
            obstructionPos.add(`${ obstruction.row},${obstruction.col}`);
    }
}

console.log(`Part 1: ${visited.size}`);
console.log(`Part 2: ${obstructionPos.size}`);