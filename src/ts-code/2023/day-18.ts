import { input } from './inputs/day-18';

const instructions = input.split('\n').map(l => l.split(' '));

const solve = (part1: boolean) => {
    const pos = { x: 0, y: 0 };
    const positions = instructions.map(i => {
        const hex = i[2];
        const dir = part1 ? i[0] : ['R', 'D', 'L', 'U'][parseInt(hex.charAt(7))];
        const amount = part1 ? parseInt(i[1], 10) : parseInt(hex.substring(2, 7), 16);
        const hold = { x: pos.x, y: pos.y, dist: amount };
        pos.x = pos.x + (dir === 'R' ? amount : (dir === 'L' ? -amount : 0));
        pos.y = pos.y + (dir === 'U' ? amount : (dir === 'D' ? -amount : 0));
        return hold;
    });

    const xy = positions.reduce((sum, p, i) => sum + (p.x * positions[i === positions.length - 1 ? 0 : i + 1].y), 0);
    const yx = positions.reduce((sum, p, i) => sum + (p.y * positions[i === positions.length - 1 ? 0 : i + 1].x), 0);
    return Math.abs((xy - yx) / 2) + ((positions.reduce((sum, p) => sum + p.dist, 0) + 2) / 2);
};

console.log(`Part 1: ${solve(true)}`);
console.log(`Part 2: ${solve(false)}`);