import { input } from './inputs/day-3';

type Location = {
    readonly x: number,
    readonly y: number
}
type TrackingData = {
    readonly santa: Location
    readonly roboSanta: Location
    readonly locations: readonly string[]
}

const part1 = input.split('').reduce((data, curr) => {
    const loc = [data.santa.x, data.santa.y];
    if (curr === '>')
        loc[0] += 1;
    else if (curr === '<')
        loc[0] -= 1;
    else if (curr === '^')
        loc[1] += 1;
    else if (curr === 'v')
        loc[1] -= 1;
    const key = `${loc[0]},${loc[1]}`;
    return {
        santa: { x: loc[0], y: loc[1] },
        roboSanta: data.roboSanta,
        locations: [
            ...data.locations.filter(k => k !== key),
            key
        ]
    };
}, { santa: { x: 0, y: 0 }, roboSanta: { x: 0, y: 0 }, locations: ['0,0'] } as TrackingData);

console.log(part1.locations.length);

const part2 = input.split('').reduce((data, curr, i) => {
    const isSanta = i % 2 === 0;
    const loc = isSanta ? [data.santa.x, data.santa.y] : [data.roboSanta.x, data.roboSanta.y];
    if (curr === '>')
        loc[0] += 1;
    else if (curr === '<')
        loc[0] -= 1;
    else if (curr === '^')
        loc[1] += 1;
    else if (curr === 'v')
        loc[1] -= 1;
    const key = `${loc[0]},${loc[1]}`;
    return {
        santa: isSanta ? { x: loc[0], y: loc[1] } : data.santa,
        roboSanta: isSanta ? data.roboSanta: { x: loc[0], y: loc[1] },
        locations: [
            ...data.locations.filter(k => k !== key),
            key
        ]
    };
}, { santa: { x: 0, y: 0 }, roboSanta: { x: 0, y: 0 }, locations: ['0,0'] } as TrackingData);

console.log(part2.locations.length);