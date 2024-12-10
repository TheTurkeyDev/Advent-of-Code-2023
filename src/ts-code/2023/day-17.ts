/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */
import { input } from './inputs/day-17';

type Position = {
    x: number
    y: number
}

const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
];

type Path = {
    currPos: Position,
    cost: number
    straightStreak: number
    direction: number
}

const test = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const map = input.split('\n').map(l => l.split('').map(n => parseInt(n, 10)));

const width = map[0].length;

//694

const search = (minDist: number, maxDist: number) => {
    let paths: Path[][] = [[{
        currPos: { x: 0, y: 0 },
        cost: 0,
        straightStreak: 1,
        direction: 1
    }, {
        currPos: { x: 0, y: 0 },
        cost: 0,
        straightStreak: 1,
        direction: 2
    }]];

    const visited = new Set<string>;

    let answer = 0;
    let lowest = 0;

    while (answer === 0) {
        while ((paths[lowest] ?? []).length !== 0) {
            const p = paths[lowest].pop();

            if (!p)
                break;

            if (p.currPos.y === map.length - 1 && p.currPos.x === width - 1 && p.straightStreak >= minDist) {
                answer = p.cost;
                break;
            }

            [p.direction, (p.direction + 1) % directions.length, (p.direction <= 0 ? directions.length : p.direction) - 1].forEach(d => {
                const direction = directions[d];
                const newPos = { x: p.currPos.x + direction.x, y: p.currPos.y + direction.y };

                if (newPos.y >= map.length || newPos.y < 0 || newPos.x >= width || newPos.x < 0)
                    return;

                const streak = d === p.direction ? p.straightStreak + 1 : 1;
                if (streak > maxDist)
                    return;

                if (p.straightStreak < minDist && d !== p.direction)
                    return;

                const posString = `${newPos.x}-${newPos.y}-${d}-${streak}`;

                if (visited.has(posString))
                    return;

                visited.add(posString);

                const cost = p.cost + map[newPos.y][newPos.x];

                paths[cost] ??= [];
                paths[cost].push({
                    currPos: newPos,
                    cost: cost,
                    straightStreak: streak,
                    direction: d
                });
            });
        }
        lowest++;
    }
    return answer;
};

console.log(`Part 1: ${search(0, 3)}`);
console.log(`Part 2: ${search(4, 10)}`);