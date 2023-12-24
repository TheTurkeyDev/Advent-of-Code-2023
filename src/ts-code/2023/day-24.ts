/* eslint-disable functional/no-let */
import { input } from './day-24-input';

const lines = input.split('\n').map(l => {
    const parts = l.replaceAll(' ', '').split('@');
    const pos = parts[0].split(',');
    const vel = parts[1].split(',');

    return {
        x: parseInt(pos[0], 10),
        y: parseInt(pos[1], 10),
        z: parseInt(pos[2], 10),
        vx: parseInt(vel[0], 10),
        vy: parseInt(vel[1], 10),
        vz: parseInt(vel[2], 10),
    };
});

const intersection = (l1sx: number, l1sy: number, l1ex: number, l1ey: number, l2sx: number, l2sy: number, l2ex: number, l2ey: number) => {
    const denominator = ((l2ey - l2sy) * (l1ex - l1sx)) - ((l2ex - l2sx) * (l1ey - l1sy));
    if (denominator === 0)
        return null;

    let a = l1sy - l2sy;
    let b = l1sx - l2sx;
    const numerator1 = ((l2ex - l2sx) * a) - ((l2ey - l2sy) * b);
    const numerator2 = ((l1ex - l1sx) * a) - ((l1ey - l1sy) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // In the past. Don't want.
    if(a < 0 || b < 0)
        return null;

    return {
        x: l1sx + (a * (l1ex - l1sx)),
        y: l1sy + (a * (l1ey - l1sy))
    };
};

let goodIntersections = 0;
lines.forEach((l1, i) => {
    lines.forEach((l2, i2) => {
        if (i2 < i)
            return;

        const int = intersection(l1.x, l1.y, l1.x + l1.vx, l1.y + l1.vy, l2.x, l2.y, l2.x + l2.vx, l2.y + l2.vy);

        if (!!int && int.x >= 200000000000000 && int.y >= 200000000000000 && int.x <= 400000000000000 && int.y <= 400000000000000)
            goodIntersections++;
    });
});

console.log(`Part 1: ${goodIntersections}`);