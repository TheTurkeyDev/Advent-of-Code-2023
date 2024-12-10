import { input } from './inputs/day-5';

const part1 = input.split('\n').filter(i => {
    if (!i.match(/([aeiou].*){3,}/g))
        return false;
    if (!i.match(/(.)\1/g))
        return false;
    if (i.includes('ab') || i.includes('dc') || i.includes('pq') || i.includes('xy'))
        return false;
    return true;
});

console.log(part1.length);

const part2 = input.split('\n').filter(i => {
    const valid = i.split('').reduce(([repeatValid, doubleValid], l, idx) => {
        const prev = i.substring(0, idx - 1);
        const doubleChars = i.substring(idx - 1, idx + 1);
        const repeat = i[idx - 2] === l;
        return [repeatValid || repeat, doubleValid || (prev.includes(doubleChars) && doubleChars.length === 2)];
    }, [false, false]);
    return valid[0] && valid[1];
});

console.log(part2.length); 