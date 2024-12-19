import { header, lap } from '../base';
import { input } from './inputs/day-17';

header(17);

const arraysEqual = (a: readonly string[], b: readonly string[]) => {
    if (a.length !== b.length) return false;

    return a.every((n, i) => n === b[i]);
};

// eslint-disable-next-line functional/no-let
let regA = 0;
// eslint-disable-next-line functional/no-let
let regB = 0;
// eslint-disable-next-line functional/no-let
let regC = 0;

const run = (regADef: number, regBDef: number, regCDef: number, program: readonly number[], expected: readonly string[] | null) => {
    regA = regADef;
    regB = regBDef;
    regC = regCDef;
    const output = [];
    // eslint-disable-next-line functional/no-let
    let pc = 0;

    while (pc < program.length) {
        const operand = program[pc + 1];
        switch (program[pc]) {
            case 0:
                regA = Math.floor(regA / Math.pow(2, getComboOperandValue(operand)));
                break;
            case 1:
                regB = regB ^ operand;
                break;
            case 2:
                regB = getComboOperandValue(operand) % 8;
                break;
            case 3:
                if (regA !== 0) {
                    pc = operand;
                    continue;
                }
                break;
            case 4:
                regB = regB ^ regC;
                break;
            case 5:
                const nextOut = `${getComboOperandValue(operand) % 8}`;
                output.push(nextOut);
                if (expected !== null && expected[output.length - 1] !== nextOut)
                    return output;
                break;
            case 6:
                regB = Math.floor(regA / Math.pow(2, getComboOperandValue(operand)));
                break;
            case 7:
                regC = Math.floor(regA / Math.pow(2, getComboOperandValue(operand)));
                break;
        }

        pc += 2;
    }
    return output;
};

const getComboOperandValue = (operand: number) => {
    switch (operand) {
        case 0:
        case 1:
        case 2:
        case 3:
            return operand;
        case 4:
            return regA;
        case 5:
            return regB;
        case 6:
            return regC;
        default:
            return 0;
    };
};

const inputLines = input.split('\n');
const regADef = parseInt(inputLines[0].substring(12));
const regBDef = parseInt(inputLines[1].substring(12));
const regCDef = parseInt(inputLines[2].substring(12));

const expected = inputLines[4].substring(9).split(',');
const program = expected.map(n => parseInt(n));
// eslint-disable-next-line functional/no-let
let output = run(regADef, regBDef, regCDef, program, null);
lap(output.join(','));

// eslint-disable-next-line functional/no-let
let regVal = 0b1001011110111110100; //This number was reversed engineered based on increasingly "good" and longer output's.... It probably only works for my input
do {
    regVal += 0b10000000000000000000;
    console.log(regVal);
    output = run(regVal, regBDef, regCDef, program, expected);
} while (!arraysEqual(expected, output));

lap(regVal);