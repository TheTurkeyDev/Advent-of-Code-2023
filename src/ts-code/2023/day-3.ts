/* eslint-disable functional/no-let */
import { input } from './day-3-input';

// eslint-disable-next-line functional/prefer-readonly-type
const numIndex: { lineIndx: number, startIndex: number }[] = [];
const isNum = (c: string) => c <= '9' && c >= '0';

const readNum = (line: string, lineIndx: number, indexStart: number) => {
    let start = indexStart;
    while (isNum(line.charAt(start)) && start >= 0) {
        start--;
    }
    start++;
    let end = indexStart;
    while (isNum(line.charAt(end)) && end < line.length) {
        end++;
    }
    const num = parseInt(line.substring(start, end));
    const indxObj = {
        lineIndx,
        startIndex: start,
    };
    if (!numIndex.includes(indxObj)) {
        numIndex.push(indxObj);
        return num;
    }
    return 0;
};

const lines = input.split('\n');

const part = lines.reduce((sum, line, lineNum) => {
    const chars = line.split('');
    const lineSum = chars.reduce((lineSum, c, index) => {
        let subSum = 0;
        let subProduct = 1;
        let count = 0;
        if (c !== '.' && (c > '9' || c < '0')) {
            const topLeft = lineNum > 0 && index > 0 && isNum(lines[lineNum - 1].charAt(index - 1));
            const top = lineNum > 0 && isNum(lines[lineNum - 1].charAt(index));
            const topRight = lineNum > 0 && index < chars.length - 1 && isNum(lines[lineNum - 1].charAt(index + 1));

            const left = index > 0 && isNum(chars[index - 1]);
            const right = index < chars.length - 1 && isNum(chars[index + 1]);

            const botLeft = lineNum < lines.length - 1 && index > 0 && isNum(lines[lineNum + 1].charAt(index - 1));
            const bot = lineNum < lines.length - 1 && isNum(lines[lineNum + 1].charAt(index));
            const botRight = lineNum < lines.length - 1 && index < chars.length + 1 && isNum(lines[lineNum + 1].charAt(index + 1));

            if (topLeft) {
                const num = readNum(lines[lineNum - 1], lineNum - 1, index - 1);
                subSum += num;
                subProduct *= num;
                count++;
            }
            if (top && !topLeft) {
                const num = readNum(lines[lineNum - 1], lineNum - 1, index);
                subSum += num;
                subProduct *= num;
                count++;
            }
            if (topRight && !top) {
                const num = readNum(lines[lineNum - 1], lineNum - 1, index + 1);
                subSum += num;
                subProduct *= num;
                count++;
            }
            if (left) {
                const num = readNum(line, lineNum, index - 1);
                subSum += num;
                subProduct *= num;
                count++;
            }
            if (right) {
                const num = readNum(line, lineNum, index + 1);
                subSum += num;
                subProduct *= num;
                count++;
            }
            if (botLeft) {
                const num = readNum(lines[lineNum + 1], lineNum + 1, index - 1);
                subSum += num;
                subProduct *= num;
                count++;
            }
            if (bot && !botLeft) {
                const num = readNum(lines[lineNum + 1], lineNum + 1, index);
                subSum += num;
                subProduct *= num;
                count++;
            }
            if (botRight && !bot) {
                const num = readNum(lines[lineNum + 1], lineNum + 1, index + 1);
                subSum += num;
                subProduct *= num;
                count++;
            }
        }
        return [lineSum[0] + subSum, lineSum[1] + (count === 2 && c === '*' ? subProduct : 0)];
    }, [0, 0]);
    return [sum[0] + lineSum[0], sum[1] + lineSum[1]];
}, [0, 0]);

console.log(`Part 1: ${part[0]}`);
console.log(`Part 2: ${part[1]}`);