import { input } from './inputs/day-3';

const partAnswers = input.split('\n').reduce((answers, l) => {

    const lineAns = l.split('').reduce((prod, c, i) => {
        if (c === 'm' || c === 'd') {
            const part = l.substring(i, l.indexOf(')', i) + 1);
            if (!!part.match(/^mul\(\d+,\d+\)$/)) {
                const product = part.substring(4, part.length - 1).split(',').reduce((prod, c) => prod * parseInt(c), 1);
                return [prod[0] + product, prod[1] + (!!prod[2] ? 0 : product), prod[2]];
            }
            else if (!!part.match(/^do\(\)$/)) {
                return [prod[0], prod[1], 0];
            }
            else if (!!part.match(/^don't\(\)$/)) {
                return [prod[0], prod[1], 1];
            }
        }
        return prod;
    }, [0, 0, answers[2]]);

    return [answers[0] + lineAns[0], answers[1] + lineAns[1], lineAns[2]];
}, [0, 0, 0]);

console.log(`Part 1: ${partAnswers[0]}`);
console.log(`Part 2: ${partAnswers[1]}`);