/* eslint-disable functional/prefer-readonly-type */
export class IntCodeProgram {
    program: number[];
    pc: number = 0;
    constructor(program: readonly number[]) {
        this.program = [...program];
    }

    run() {
        while (this.program[this.pc] !== 99) {
            const opCode = this.program[this.pc];
            const nums = this.program.slice(this.pc, this.pc + 4);
            switch (opCode) {
                case 1:
                    this.program[nums[3]] = this.program[nums[1]] + this.program[nums[2]];
                    break;
                case 2:
                    this.program[nums[3]] = this.program[nums[1]] * this.program[nums[2]];
                    break;
                case 99:
                    break;
            }
            this.pc += 4;
        }
    }
}