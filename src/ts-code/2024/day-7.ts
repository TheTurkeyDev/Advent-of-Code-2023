import { input } from './inputs/day-7';

const solvePart = (operands: readonly string[]) => {
    return input.split('\n').reduce((partAnswer, s) => {
        const parts = s.split(':');
        const testVolume = parseInt(parts[0]);
        const testNums = parts[1].trim().split(' ').map(n => parseInt(n));
        const operandValues = testNums.map(() => 0);
        const possible = Array.from({ length: Math.pow(operands.length, testNums.length) }, () => 0).some(() => {
            const answer = testNums.slice(1).reduce((ans, _, j) => {
                const num = testNums[j + 1];
                const operand = operandValues[j];
                if (operand === 0)
                    return ans + num;
                else if (operand === 1)
                    return ans * num;
                else
                    return parseInt(`${ans}${num}`);
            }, testNums[0]);

            if (answer === testVolume)
                return true;

            testNums.some((_, j) => {
                operandValues[j]++;
                if (operandValues[j] === operands.length) {
                    Array.from({ length: j + 1 }, (_, k) => k).forEach(k => operandValues[k] = 0);
                    return false;
                }
                return true;
            }, false);
            return false;
        }, false);
        return partAnswer + (possible ? testVolume : 0);
    }, 0);
};

console.log(`Part 1: ${solvePart(['+', '*'])}`);
console.log(`Part 2: ${solvePart(['+', '*', '||'])}`);