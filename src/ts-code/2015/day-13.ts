import { input } from './inputs/day-13';

type HappyType = { readonly [name: string]: { readonly [name2: string]: number } }
const inputHappyValues = input.split('\n').reduce((values, line) => {
    const lineParts = line.split(' ');
    const firstName = lineParts[0];
    const secondName = lineParts[lineParts.length - 1].substring(0, lineParts[lineParts.length - 1].length - 1);
    const plusMinus = lineParts[2];
    const happinessVal = parseInt(lineParts[3]) * (plusMinus === 'lose' ? -1 : 1);
    return {
        ...values,
        [firstName]: {
            ...values[firstName],
            [secondName]: happinessVal
        }
    };
}, {} as HappyType);

const happyValues = ['me', ...Object.keys(inputHappyValues)].reduce((values, person) => {
    return person === 'me' ?
        {
            ...values,
            [person]: Object.keys(inputHappyValues).reduce((myVals, k) => ({ ...myVals, [k]: 0 }), {})
        } :
        {
            ...values,
            [person]: {
                ...inputHappyValues[person],
                me: 0
            }
        };
}, {} as HappyType);

const calcMaxSeatingHappiness = (assignments: readonly string[], missing: readonly string[]): number => {
    const lastAssignment = assignments[assignments.length - 1];
    if (missing.length === 0)
        return happyValues[assignments[0]][lastAssignment] + happyValues[lastAssignment][assignments[0]];

    return missing.reduce((max, person) => {
        const maxSubHappy = calcMaxSeatingHappiness([...assignments, person], missing.filter(m => m !== person));
        const currentHappyVal = happyValues[lastAssignment][person] + happyValues[person][lastAssignment] + maxSubHappy;
        return Math.max(max, currentHappyVal);
    }, Number.MIN_VALUE);
};

const reduceFunc = (max: number, p: string, _: number, keys: readonly string[]) => Math.max(max, calcMaxSeatingHappiness([p], keys.filter(k => k !== p)));

const part1 = Object.keys(inputHappyValues).reduce(reduceFunc, Number.MIN_VALUE);
console.log(`Part 1: ${part1}`);

const part2 = Object.keys(happyValues).reduce(reduceFunc, Number.MIN_VALUE);
console.log(`Part 2: ${part2}`);