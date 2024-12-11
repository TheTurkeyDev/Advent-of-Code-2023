import { input } from './inputs/day-16';

type MFCSAMTypes = {
    readonly children?: number
    readonly cats?: number
    readonly samoyeds?: number
    readonly pomeranians?: number
    readonly akitas?: number
    readonly vizslas?: number
    readonly goldfish?: number
    readonly trees?: number
    readonly cars?: number
    readonly perfumes?: number
}

const answers: MFCSAMTypes = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
};

const getValidSueNum = (part2: boolean) => {
    const validSue = input.split('\n').find(line => {
        const sue = line.substring(0, line.indexOf(' ', 4));
        const info = line.substring(sue.length + 1).split(', ').reduce((data, infoGroup) => {
            const parts = infoGroup.split(': ');
            return {
                ...data,
                [parts[0]]: parseInt(parts[1])
            };
        }, {} as MFCSAMTypes);

        return Object.keys(answers).every(k => {
            if (Object.keys(info).includes(k)) {
                const key = k as keyof MFCSAMTypes;
                if (part2 && ['cats', 'tress'].includes(k))
                    return info[key]! > answers[key]!;
                else if (part2 && ['pomeranians', 'goldfish'].includes(k))
                    return info[key]! < answers[key]!;
                else
                    return info[key] === answers[key];
            }
            return true;
        });
    })!;
    return validSue.substring(validSue.indexOf(' ') + 1, validSue.indexOf(' ', 4) - 1);
};

console.log(`Part 1: ${getValidSueNum(false)}`);
console.log(`Part 2: ${getValidSueNum(true)}`);