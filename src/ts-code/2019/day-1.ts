import { header, lap } from '../base';
import { input } from './inputs/day-1';

header(1);

const calcMissing = (mass: number): number => {
    const result = (Math.floor(mass / 3)) - 2;
    return result > 0 ? calcMissing(result) + result : 0;
};

const sum = input
    .split('\n')
    .map(n => parseInt(n))
    .reduce((sum, mass) => [sum[0] + ((Math.floor(mass / 3)) - 2), sum[1] + calcMissing(mass)], [0, 0]);

lap(sum[0]);
lap(sum[1]);