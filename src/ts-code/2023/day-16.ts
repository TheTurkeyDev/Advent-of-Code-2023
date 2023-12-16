/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-let */
import { input } from './day-16-input';

type Position = {
    x: number
    y: number
}

type Tracked = { pos: Position, dir: Position }

const map = input.split('\n').map(l => l.split(''));

const getNewDirs = (currChange: Position, currentSquare: string): Position[] => {
    if (currentSquare === '/') {
        if (currChange.x === 1)
            return [{ x: 0, y: -1 }];
        if (currChange.x === -1)
            return [{ x: 0, y: 1 }];
        if (currChange.y === 1)
            return [{ x: -1, y: 0 }];
        if (currChange.y === -1)
            return [{ x: 1, y: 0 }];
    }
    if (currentSquare === '?') {
        if (currChange.x === 1)
            return [{ x: 0, y: 1 }];
        if (currChange.x === -1)
            return [{ x: 0, y: -1 }];
        if (currChange.y === 1)
            return [{ x: 1, y: 0 }];
        if (currChange.y === -1)
            return [{ x: -1, y: 0 }];
    }
    if (currentSquare === '|' && (currChange.x === 1 || currChange.x === -1)) {
        return [{ x: 0, y: 1 }, { x: 0, y: -1 }];
    }
    if (currentSquare === '-' && (currChange.y === 1 || currChange.y === -1)) {
        return [{ x: 1, y: 0 }, { x: -1, y: 0 }];
    }
    return [currChange];
};

const getEnergized = (startPos: Position, startDir: Position) => {
    let tracked: Tracked[] = [{ pos: startPos, dir: startDir }];

    const energized = new Set<string>();
    const energizedWithDir = new Set<string>();

    while (tracked.length > 0) {
        let newTracked: Tracked[] = [];

        tracked.forEach(t => {
            const position = { x: t.pos.x + t.dir.x, y: t.pos.y + t.dir.y };
            energizedWithDir.add(`${position.x}-${position.y}-${t.dir.x}-${t.dir.y}`);

            if (position.x >= 0 && position.y >= 0 && position.x < map[0].length && position.y < map.length) {
                energized.add(`${position.x}-${position.y}`);

                const currentSquare = map[position.y][position.x];
                const newDirs = getNewDirs(t.dir, currentSquare)
                    .filter(nd => !energizedWithDir.has(`${position.x + nd.x}-${position.y + nd.y}-${nd.x}-${nd.y}`));
                newTracked.push(...(newDirs.map(nd => ({ pos: position, dir: nd }))));
            }
        });

        tracked = newTracked;
    }
    return energized.size;
};

console.log(`Part 1: ${getEnergized({ x: -1, y: 0 }, { x: 1, y: 0 })}`);

const length = map[0].length;
let max = 0;
for (let x = 0; x < length - 1; x++) {
    const top = getEnergized({ x: x, y: -1 }, { x: 0, y: 1 });
    const bot = getEnergized({ x: x, y: map.length }, { x: 0, y: -1 });
    max = Math.max(Math.max(top, bot), max);
}

for (let y = 0; y < map.length - 1; y++) {
    const left = getEnergized({ x: -1, y: y }, { x: 1, y: 0 });
    const right = getEnergized({ x: length, y: y }, { x: -1, y: 0 });
    max = Math.max(Math.max(left, right), max);
}

console.log(`Part 2: ${max}`);