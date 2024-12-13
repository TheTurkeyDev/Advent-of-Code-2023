import { header, lap } from '../base';
import { input } from './inputs/day-11';

header(11);
const cache = new Map<string, number>();

const calcNumStones = (stone: number, blinkTimes: number): number => {
    if (blinkTimes === 0)
        return 1;

    const key = `${stone}-${blinkTimes}`;
    if (cache.has(key))
        return cache.get(key) ?? -1;

    if (stone === 0) {
        const ans = calcNumStones(1, blinkTimes - 1);
        cache.set(key, ans);
        return ans;
    }

    const stoneStr = `${stone}`;
    if (stoneStr.length % 2 === 0) {
        const left = parseInt(stoneStr.substring(0, stoneStr.length / 2));
        const leftAns = calcNumStones(left, blinkTimes - 1);

        const right = parseInt(stoneStr.substring(stoneStr.length / 2));
        const rightAns = calcNumStones(right, blinkTimes - 1);

        cache.set(key, leftAns + rightAns);
        return leftAns + rightAns;
    }

    const ans = calcNumStones(stone * 2024, blinkTimes - 1);
    cache.set(key, ans);
    return ans;
};

const parts = input
    .split(' ')
    .map(n => parseInt(n))
    .reduce((answer, stone) => [answer[0] + calcNumStones(stone, 25), answer[1] + calcNumStones(stone, 75)], [0, 0]);
lap(parts[0]);
lap(parts[1]);