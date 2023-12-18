/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-let */
import { input } from './day-18-input';

const test = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;
const instructions = test.split('\n').map(l => l.split(' '));

const solve = (part1: boolean) => {
    const positions = new Set<string>;
    let pos = { x: 0, y: 0 };
    let xMin = Number.MAX_VALUE;
    let yMin = Number.MAX_VALUE;
    let xMax = Number.MIN_VALUE;
    let yMax = Number.MIN_VALUE;
    instructions.forEach(i => {
        const hex = i[2];
        const dir = part1 ? i[0] : ['R', 'D', 'L', 'U'][parseInt(hex.charAt(7))];
        const amount = part1 ? parseInt(i[1], 10) : parseInt(hex.substring(2, 7), 16);
        console.log(dir, amount);
        for (let i = 1; i <= amount; i++) {
            pos = {
                x: pos.x + (dir === 'R' ? 1 : (dir === 'L' ? -1 : 0)),
                y: pos.y + (dir === 'U' ? -1 : (dir === 'D' ? 1 : 0))
            };
            xMin = Math.min(xMin, pos.x);
            yMin = Math.min(yMin, pos.y);
            xMax = Math.max(xMax, pos.x);
            yMax = Math.max(yMax, pos.y);

            positions.add(`${pos.x}-${pos.y}`);
        }

    });

    let queue = [{ x: 5, y: 4 }];
    let visited = new Set<string>;

    while (queue.length > 0) {
        const pos = queue.pop();
        if (!pos)
            break;

        if (pos.x < xMin || pos.y < yMin || pos.x > xMax || pos.y > yMax) {
            console.log('OUTSIDE SHAPE!');
            break;
        }

        const posStr = `${pos.x}-${pos.y}`;

        if (visited.has(posStr))
            continue;

        visited.add(posStr);

        [
            { x: pos.x, y: pos.y - 1 },
            { x: pos.x, y: pos.y + 1 },
            { x: pos.x - 1, y: pos.y },
            { x: pos.x + 1, y: pos.y }
        ].forEach(p => {
            const pStr = `${p.x}-${p.y}`;
            if (visited.has(pStr) || positions.has(pStr))
                return;
            queue.push(p);
        });
    }

    return positions.size + visited.size;
};

console.log(`Part 1: ${solve(true)}`);
console.log(`Part 2: ${solve(false)}`);