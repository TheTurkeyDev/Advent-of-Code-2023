import { header, lap } from '../base';
import { input } from './inputs/day-2';
import { IntCodeProgram } from './int-code-program';

header(2);

const programDef = input.split(',').map(n => parseInt(n));
const program = [...programDef];
program[1] = 12;
program[2] = 2;

const intCodeProgram = new IntCodeProgram(program);
intCodeProgram.run();
lap(intCodeProgram.program[0]);


// eslint-disable-next-line functional/no-let
let noun = -1;
// eslint-disable-next-line functional/no-let
let verb = 0;
while (true) {
    noun++;
    if (noun === 100) {
        noun = 0;
        verb++;
    }
    const program = [...programDef];
    program[1] = noun;
    program[2] = verb;
    const intCodeProgram = new IntCodeProgram(program);
    intCodeProgram.run();
    if (intCodeProgram.program[0] === 19690720) {
        lap(100 * noun + verb);
        break;
    }
}