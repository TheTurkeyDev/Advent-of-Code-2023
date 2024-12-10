import { input } from './inputs/day-2';

const part1 = input.split('\n').reduce((sum, line) => {
    const colonIndx = line.indexOf(':');
    const gameStr = line.substring(0, colonIndx);
    const gameNum = parseInt(gameStr.substring(gameStr.indexOf(' ') + 1));
    const subsets = line.substring(colonIndx + 1).trim().split(';');
    const invalid = subsets.reduce((v, subset) => {
        const die = subset.trim().split(',').map(d => d.trim().split(' '));
        const dieInvalid = die.reduce((v2, dieCount) => {
            const count = parseInt(dieCount[0]);
            return v2 || (dieCount[1] === 'red' ? count > 12 : (dieCount[1] === 'green' ? count > 13 : (dieCount[1] === 'blue' ? count > 14 : count > 0)));
        }, false);
        return v || dieInvalid;
    }, false);

    return sum + (invalid ? 0: gameNum);
}, 0);

console.log(part1);

const part2 = input.split('\n').reduce((sum, line) => {
    const colonIndx = line.indexOf(':');
    const subsets = line.substring(colonIndx + 1).trim().split(';');
    const colorMax = subsets.reduce((colors, subset) => {
        const die = subset.trim().split(',').map(d => d.trim().split(' '));
        const subsetColors = die.reduce((colors2, dieCount) => {
            const count = parseInt(dieCount[0]);
            return {
                ...colors2,
                [dieCount[1]]: count,
            };
        }, {red: 0, green: 0, blue: 0});
        return {
            red: Math.max(colors.red, subsetColors.red),
            green: Math.max(colors.green, subsetColors.green),
            blue: Math.max(colors.blue, subsetColors.blue)
        };
    }, {red: 0, green: 0, blue: 0});
   
    return sum + (colorMax.red * colorMax.blue * colorMax.green);
}, 0);

console.log(part2);