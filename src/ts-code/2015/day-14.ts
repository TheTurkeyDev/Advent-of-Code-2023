import { input } from './inputs/day-14';

const reindeerInfo = input.split('\n').map(line => {
    const parts = line.split(' ');
    const name = parts[0];
    const speed = parseInt(parts[3]);
    const speedDur = parseInt(parts[6]);
    const sleepDur = parseInt(parts[13]);

    return { name, speed, speedDur, totalDur: speedDur + sleepDur, totalDist: speed * speedDur };
});

const calcWinner = (time: number) => (
    reindeerInfo.map(ri => {
        const times = Math.floor(time / ri.totalDur);
        const rem = time % ri.totalDur;
        const distRem = Math.min(ri.speedDur, rem);
        return { name: ri.name, dist: (times * ri.totalDist) + (distRem * ri.speed) };
    }).reduce((max, traveled) => {
        if (max[0].dist > traveled.dist)
            return max;
        else if (max[0].dist === traveled.dist)
            return [...max, traveled];
        return [traveled];
    }, [{ name: '', dist: 0 }])
);

console.log(`Part 1: ${calcWinner(2503)[0].dist}`);

const part2 = Array.from({ length: 2503 }, (_, i) => i).slice(1).reduce((points, time) => (
    calcWinner(time).reduce((pts, leader) => ({
        ...pts,
        [leader.name]: (pts[leader.name] ?? 0) + 1
    }), points)
), {} as { readonly [name: string]: number });

console.log(`Part 2: ${Object.keys(part2).reduce((max, k) => Math.max(max, part2[k]), 0)}`);