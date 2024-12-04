import { input } from './day-10-input';

type Entry = {
    readonly count: number
    readonly num: number
}

const getAnswer = (passes: number) => {
    return Array.from({ length: passes }, (_, i) => i).reduce((val, i) => {
        return val.split('')
            .reduce((countArr, char) => {
                const num = parseInt(char);
                if (countArr.length !== 0 && countArr[countArr.length - 1].num === num)
                    return countArr.map((c, i) => i === countArr.length - 1 ? { num: c.num, count: c.count + 1 } : c);
                return [...countArr, { num: num, count: 1 }];
            }, [] as readonly Entry[])
            .reduce((s, entry) => `${s}${entry.count}${entry.num}`, '');
    }, input).length;
};


console.log(`Part 1: ${getAnswer(40)}`);
console.log(`Part 2: ${getAnswer(50)}`);