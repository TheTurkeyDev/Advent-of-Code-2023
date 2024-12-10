import { input } from './inputs/day-12';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getValue = (elem: any, ignoreRed: boolean): number => {
    return Object.keys(elem).reduce((sum, k) => {
        const value = elem[k];
        const typeOf = typeof value;
        
        if (typeOf === 'number')
            return sum + (value as number);
        if (typeOf === 'string')
            return sum;

        const keys = Object.keys(value);
        const isArray = keys[0] === '0';
        if (ignoreRed && !isArray && keys.some(k => value[k] === 'red'))
            return sum;
        return sum + getValue(value, ignoreRed);
    }, 0);
};

console.log(`Part 1: ${getValue(input, false)}`);
console.log(`Part 2: ${getValue(input, true)}`);