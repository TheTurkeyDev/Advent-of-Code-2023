import { input } from './inputs/day-9';

const map = input;
const blocksOrig = map.split('').reduce((info, c) => {
    return {
        blocks: [
            ...info.blocks,
            ...Array.from({ length: parseInt(c) }, () => info.file ? info.id : -1)
        ],
        id: info.id + (info.file ? 1 : 0),
        file: !info.file
    };
}, { blocks: [] as readonly number[], id: 0, file: true }).blocks;

const blocks = blocksOrig.map(b => b);
[...blocks].reverse().every((blk, i) => {
    const ii = (blocks.length - 1) - i;
    if (blk === -1)
        return true;

    const moved = Array.from({ length: ii }, (_, j) => j).some(j => {
        if (blocks[j] === -1) {
            blocks[j] = blk;
            return true;
        }
        return false;
    });

    if (moved) {
        blocks[ii] = -1;
        return true;
    }
    return false;
});

const checkSum = blocks.reduce((sum, block, i) => sum + (block === -1 ? 0 : (i * block)), 0);
console.log(`Part 1: ${checkSum}`);

const blocks2 = blocksOrig.map(b => b);
[...blocks2].reverse().reduce((highestCheckedId, blk, i) => {
    const ii = (blocks.length - 1) - i;
    if (blk === -1 || blk >= highestCheckedId)
        return highestCheckedId;

    const tooMoveLength = Array.from({ length: ii }, (_, j) => j).find(j => blocks2[ii - j] !== blk) ?? ii + 1;
    Array.from({ length: ii }, (_, j) => j).every(j => {
        const freeSpace = Array.from({ length: ii }, (_, k) => k + 1).find(k => !(j + k < blocks2.length && blocks2[j + k] === -1)) ?? 1;
        if (blocks2[j] === -1 && freeSpace >= tooMoveLength) {
            Array.from({ length: tooMoveLength }, (_, k) => k).map(k => {
                blocks2[j + k] = blk;
                blocks2[ii - k] = -1;
            });
            return false;
        }
        return true;
    });

    return blk;
}, Number.MAX_VALUE);

const checkSum2 = blocks2.reduce((sum, block, i) => sum + (block === -1 ? 0 : (i * block)), 0);
console.log(`Part 1: ${checkSum2}`);