import { input } from './inputs/day-17';

const containers: readonly number[] = input.split('\n').map(line => parseInt(line));

const calc = (conts: readonly number[], litersLeft: number): number => {
    if (conts.length === 1)
        return litersLeft === conts[0] || litersLeft === 0 ? 1 : 0;

    return (litersLeft >= conts[0] ? calc(conts.slice(1), litersLeft - conts[0]) : 0) + calc(conts.slice(1), litersLeft);
};

console.log(`Part 1: ${calc(containers, 150)}`);

const calc2 = (conts: readonly number[], used: readonly number[], litersLeft: number): { readonly [used: number]: number } => {
    if (conts.length === 1)
        return {
            [used.length + (litersLeft === conts[0] ? 1 : 0)]: litersLeft === 0 || litersLeft === conts[0] ? 1 : 0,
        };

    const notUsed = calc2(conts.slice(1), used, litersLeft);
    const isUsed = litersLeft >= conts[0] ? calc2(conts.slice(1), [...used, conts[0]], litersLeft - conts[0]) : {};
    return [...new Set<string>([...Object.keys(notUsed), ...Object.keys(isUsed)])].reduce((comb, key) => {
        return {
            ...comb,
            [key]: (notUsed[parseInt(key)] ?? 0) + (isUsed[parseInt(key)] ?? 0)
        };
    }, {});
};

const part2 = calc2(containers, [], 150);
const part2Key = parseInt(Object.keys(part2).find(k => part2[parseInt(k)] !== 0) ?? '-1');
console.log(`Part 2: ${part2[part2Key]}`);