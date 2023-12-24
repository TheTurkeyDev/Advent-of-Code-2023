/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-let */
import { input } from './day-22-input';

type Block = {
    id: number
    readonly xMin: number
    readonly yMin: number
    zMin: number
    readonly xMax: number
    readonly yMax: number
    zMax: number
    supportedBy: Set<number>
    supports: Set<number>
}

type Blocks = {
    [key: string]: Block
}

const test = `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`;

const blocks = input.split('\n').reduce((bs, l, i) => {
    const parts = l.split('~');
    const startCoords = parts[0].split(',').map(c => parseInt(c, 10));
    const endCoords = parts[1].split(',').map(c => parseInt(c, 10));

    return {
        ...bs,
        [i]: {
            id: i,
            xMin: Math.min(startCoords[0], endCoords[0]),
            yMin: Math.min(startCoords[1], endCoords[1]),
            zMin: Math.min(startCoords[2], endCoords[2]),
            xMax: Math.max(startCoords[0], endCoords[0]),
            yMax: Math.max(startCoords[1], endCoords[1]),
            zMax: Math.max(startCoords[2], endCoords[2]),
            supportedBy: new Set<number>,
            supports: new Set<number>,
        }
    };
}, {} as Blocks);

const world: Block[][] = [];

const addBlockToLayer = (z: number, b: Block) => {
    if (!world[z])
        world[z] = [b];
    else if (!world[z].find(b2 => b2.id === b.id))
        world[z].push(b);
};

const removeBlockFromLayer = (z: number, bId: number) => {
    if (!world[z])
        world[z] = [];
    else
        world[z] = world[z].filter(b => b.id !== bId);
};

const addBlock = (b: Block) => {
    for (let z = b.zMin; z <= b.zMax; z++)
        addBlockToLayer(z, b);
};

Object.values(blocks).forEach(b => addBlock(b));

const getSupported = (b: Block) => {
    const supportedBy = new Set<number>;

    if (b.zMin === 1) {
        supportedBy.add(-1);
        return supportedBy;
    }
    const belowPos = new Set<string>;
    for (let x = b.xMin; x <= b.xMax; x++)
        for (let y = b.yMin; y <= b.yMax; y++)
            belowPos.add(`${x},${y},${b.zMin - 1}`);

    const blocksBelow = world[b.zMin - 1] ?? [];
    for (let bi = 0; bi < blocksBelow.length; bi++) {
        const b2 = blocksBelow[bi];
        if (b2.supportedBy.size > 0)
            for (let x = b2.xMin; x <= b2.xMax; x++)
                for (let y = b2.yMin; y <= b2.yMax; y++)
                    for (let z = b2.zMin; z <= b2.zMax; z++)
                        if (belowPos.has(`${x},${y},${z}`))
                            supportedBy.add(b2.id);
    }

    return supportedBy;
};

const update = (b: Block) => {
    if (b.supportedBy.size > 0)
        return false;

    const supportedBy = getSupported(b);
    if (supportedBy.size > 0) {
        b.supportedBy = supportedBy;
        supportedBy.forEach(supId => {
            if (supId !== -1)
                blocks[supId].supports.add(b.id);
        });
    }
    else {
        removeBlockFromLayer(b.zMax, b.id);
        addBlockToLayer(b.zMin - 1, b);
        b.zMin -= 1;
        b.zMax -= 1;
        return true;
    }

    return false;
};

let moved = true;
while (moved) {
    moved = false;
    Object.values(blocks).forEach(b => {
        if (b.supportedBy.size > 0)
            return;
        moved = update(b) || moved;
    });
}

console.log(world[6]);

const part1 = Object.values(blocks).filter((b, i) => {
    let canRemove = true;
    b.supports.forEach(sup => {
        if (blocks[sup].supportedBy.size === 1)
            canRemove = false;
    });
    // if (canRemove)
    //     console.log(i);
    return canRemove;
});

console.log(`Part 1: ${part1.length}`);