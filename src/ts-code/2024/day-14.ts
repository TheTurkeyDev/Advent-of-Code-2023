import { header, lap } from '../base';
import { input } from './inputs/day-14';

const width = 101;
const midX = 50;
const height = 103;
const midY = 51;

header(14);

type Point = {
    readonly x: number
    readonly y: number
}
type Robot = {
    readonly pos: Point
    readonly vel: Point
}

const mul = (p: Point, times: number) => ({ x: p.x * times, y: p.y * times });
const add = (p: Point, p2: Point) => ({ x: p.x + p2.x, y: p.y + p2.y });

const moveRobotXTimes = (robot: Robot, times: number) => {
    const np = add(robot.pos, mul(robot.vel, times));
    const newXtemp = np.x % width;
    const newX = newXtemp < 0 ? newXtemp + width : newXtemp;
    const newYtemp = np.y % height;
    const newY = newYtemp < 0 ? newYtemp + height : newYtemp;
    return { x: newX, y: newY };
};

const robots = input.split('\n').map(line => {
    const parts = line.split(' ');
    const posParts = parts[0].substring(2).split(',');
    const velParts = parts[1].substring(2).split(',');
    const pos = { x: parseInt(posParts[0]), y: parseInt(posParts[1]) };
    const vel = { x: parseInt(velParts[0]), y: parseInt(velParts[1]) };
    return { pos, vel } as Robot;
});

const part1Robots = robots.map(r => ({ pos: moveRobotXTimes(r, 100), vel: r.vel }));


const quads = part1Robots.reduce((q, robot) => {
    const upper = robot.pos.y < midY;
    const lower = robot.pos.y > midY;
    const left = robot.pos.x < midX;
    const right = robot.pos.x > midX;
    if (upper && left)
        return [q[0] + 1, q[1], q[2], q[3]];
    else if (upper && right)
        return [q[0], q[1] + 1, q[2], q[3]];
    else if (lower && left)
        return [q[0], q[1], q[2] + 1, q[3]];
    else if (lower && right)
        return [q[0], q[1], q[2], q[3] + 1];
    else
        return q;
}, [0, 0, 0, 0]);

lap(quads[0] * quads[1] * quads[2] * quads[3]);