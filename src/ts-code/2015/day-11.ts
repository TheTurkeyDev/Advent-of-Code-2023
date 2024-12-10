import { input } from './inputs/day-11';

const nextPass = (pass: string): string => {
    const char = pass.charCodeAt(pass.length - 1);
    const subStr = pass.slice(0, pass.length - 1);
    if (char === 122)
        return nextPass(subStr) + 'a';
    else
        return subStr + String.fromCharCode(char + 1);
};

const isValidPassword = (pass: string) => {
    const ascend = pass.split('').reduce((asc, letter) => {
        if (asc.length === 3)
            return asc;

        if (asc.length === 0 || asc.charCodeAt(asc.length - 1) + 1 !== letter.charCodeAt(0))
            return letter;
        else
            return asc + letter;
    }, '');

    if (ascend.length < 3)
        return false;

    if (pass.includes('i') || pass.includes('o') || pass.includes('l'))
        return false;

    const pairs = pass.split('').reduce((p, letter, i) => {
        if (i !== 0 && pass.charAt(i - 1) === letter && (i < 2 || pass.charAt(i - 2) !== letter))
            return p + 1;
        return p;
    }, 0);

    return pairs >= 2;
};

// eslint-disable-next-line functional/no-let
let password = input;
do {
    password = nextPass(password);
} while (!isValidPassword(password));

console.log(`Part 1: ${password}`);

do {
    password = nextPass(password);
} while (!isValidPassword(password));

console.log(`Part 2: ${password}`);