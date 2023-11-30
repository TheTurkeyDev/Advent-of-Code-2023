/* eslint-disable functional/no-let */
import { input } from './day-6-2015-input';

const lights = new Array(1000).fill(false).map(() => new Array(1000).fill(false));

const setRangeValues = (lowX: number, lowY: number, highX: number, highY: number, value: boolean) => {
    for (let x = lowX; x <= highX; x++) {
        for (let y = lowY; y <= highY; y++) {
            lights[x][y] = value;
        }
    }
};
const setRangeToggle = (lowX: number, lowY: number, highX: number, highY: number) => {
    for (let x = lowX; x <= highX; x++) {
        for (let y = lowY; y <= highY; y++) {
            lights[x][y] = !lights[x][y];
        }
    }
};

input.split('\n').forEach(l => {
    const parts = l.split(' ');
    if (parts[0] === 'turn') {
        const startCords = parts[2].split(',');
        const endCords = parts[4].split(',');
        const x1 = parseInt(startCords[0]);
        const y1 = parseInt(startCords[1]);
        const x2 = parseInt(endCords[0]);
        const y2 = parseInt(endCords[1]);
        if (parts[1] === 'on')
            setRangeValues(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), true);
        else if (parts[1] === 'off')
            setRangeValues(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), false);
    }
    else if (parts[0] === 'toggle') {
        const startCords = parts[1].split(',');
        const endCords = parts[3].split(',');
        const x1 = parseInt(startCords[0]);
        const y1 = parseInt(startCords[1]);
        const x2 = parseInt(endCords[0]);
        const y2 = parseInt(endCords[1]);
        setRangeToggle(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2));
    }
});

const lit = lights.reduce((sum, line) => sum + line.reduce((lineSum, l) => lineSum + (l ? 1 : 0), 0), 0);
console.log(`Part 1: ${lit}`);


//PART 2

const lights2 = new Array(1000).fill(0).map(() => new Array(1000).fill(0));

const changeRangeValues = (lowX: number, lowY: number, highX: number, highY: number, amount: number) => {
    for (let x = lowX; x <= highX; x++) {
        for (let y = lowY; y <= highY; y++) {
            lights2[x][y] = Math.max(lights2[x][y] + amount, 0);
        }
    }
};

input.split('\n').forEach(l => {
    const parts = l.split(' ');
    if (parts[0] === 'turn') {
        const startCords = parts[2].split(',');
        const endCords = parts[4].split(',');
        const x1 = parseInt(startCords[0]);
        const y1 = parseInt(startCords[1]);
        const x2 = parseInt(endCords[0]);
        const y2 = parseInt(endCords[1]);
        if (parts[1] === 'on')
            changeRangeValues(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), 1);
        else if (parts[1] === 'off')
            changeRangeValues(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), -1);
    }
    else if (parts[0] === 'toggle') {
        const startCords = parts[1].split(',');
        const endCords = parts[3].split(',');
        const x1 = parseInt(startCords[0]);
        const y1 = parseInt(startCords[1]);
        const x2 = parseInt(endCords[0]);
        const y2 = parseInt(endCords[1]);
        changeRangeValues(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), 2);
    }
});

const lit2 = lights2.reduce((sum, line) => sum + line.reduce((lineSum, l) => lineSum + l, 0), 0);
console.log(`Part 2: ${lit2}`);