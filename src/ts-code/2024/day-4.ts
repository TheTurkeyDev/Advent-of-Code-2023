import { input } from './inputs/day-4';

const lines = input.split('\n');
const height = lines.length;
const width = lines[0].length;

const getMatches = (s: string) => (s === 'XMAS' ? 1 : 0) + (s === 'SAMX' ? 1 : 0);

const answer1 = lines.reduce((answer, line, y) => (
    line.split('').reduce((count, _, x) => {
        //Horiz
        const horiz = x + 3 < width ? getMatches(line.substring(x, x + 4)) : 0;

        //Vert
        const vert = y + 3 < height ? getMatches(Array.from({ length: 4 }, (_, i) => lines[y + i].charAt(x)).join('')) : 0;

        //R->L Diag
        const rlDiag = y + 3 < height && x + 3 < width ? getMatches(Array.from({ length: 4 }, (_, i) => lines[y + i].charAt(x + i)).join('')) : 0;

        //L->R Diag
        const lrDiag = y + 3 < height && x - 3 >= 0 ? getMatches(Array.from({ length: 4 }, (_, i) => lines[y + i].charAt(x - i)).join('')) : 0;

        return count + horiz + vert + rlDiag + lrDiag;
    }, answer)
), 0);

console.log(`Part 1: ${answer1}`);


const getMatches2 = (s: string) => s === 'MAS' || s === 'SAM';

const answer2 = lines.slice(0, -2).reduce((answer, line, y) => (
    line.split('').slice(0, -2).reduce((count, _, x) => {
        const lrStr = Array.from({ length: 3 }, (_, i) => lines[y + i].charAt(x + i)).join('');
        const rlStr = Array.from({ length: 3 }, (_, i) => lines[y + i].charAt((x + 2) - i)).join('');
        return count + (getMatches2(lrStr) && getMatches2(rlStr) ? 1 : 0);
    }, answer)
), 0);

console.log(`Part 2: ${answer2}`);