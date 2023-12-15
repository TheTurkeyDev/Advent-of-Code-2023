/* eslint-disable functional/prefer-readonly-type */
import { input } from './day-15-input';

const getHash = (str: string) => str.split('').map(c => c.charCodeAt(0)).reduce((sum, c) => ((sum + c) * 17) % 256, 0);

const operations = input.split(',');
const part1 = operations.map(getHash).reduce((sum, subSum) => subSum + sum, 0);

console.log(`Part 1: ${part1}`);

type Lens = {
    label: string
    focal: number
}

const boxes: { [key: number]: Lens[] } = {};
operations.forEach(op => {
    if (op.includes('=')) {
        const label = op.substring(0, op.indexOf('='));
        const focal = parseInt(op.substring(op.indexOf('=') + 1));
        const boxNum = getHash(label);
        const idx = (boxes[boxNum] ?? []).findIndex(s => s.label.includes(label));
        if (idx === -1) {
            boxes[boxNum] = [
                ...(boxes[boxNum] ?? []),
                { label, focal }
            ];
        }
        else {
            boxes[boxNum] = boxes[boxNum].map((l, i) => ({
                label: l.label,
                focal: i === idx ? focal : l.focal
            }));
        }
    } else {
        const label = op.replace('-', '');
        const boxNum = getHash(label);
        boxes[boxNum] = (boxes[boxNum] ?? []).filter(l => !l.label.includes(label));
    }
});

const part2 = Object.keys(boxes).reduce((sum, box) => {
    const boxNum = parseInt(box);
    return sum + (boxes[boxNum].reduce((subSum, lens, i) => subSum + ((boxNum + 1) * (i + 1) * lens.focal), 0));
}, 0);

console.log(`Part 2: ${part2}`);