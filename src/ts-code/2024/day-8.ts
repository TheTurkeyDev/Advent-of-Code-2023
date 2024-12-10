import { input } from './inputs/day-8';

type Point = {
    readonly row: number
    readonly col: number
}

type NodeLoc = { readonly [key: string]: readonly Point[] }

const inputLines = input.split('\n');
const height = inputLines.length;
const width = inputLines[0].length;

const nodeLocations = inputLines.reduce((locs, rowStr, row) => {
    return rowStr.split('').reduce((locs2, c, col) => {
        if (c === '.')
            return locs2;

        return {
            ...locs2,
            [c]: [...(locs2[c] ?? []), { row, col }]
        };
    }, locs);
}, {} as NodeLoc);

const antiNodeLocs = Object.keys(nodeLocations).reduce((anl, c) => {
    const nodes = nodeLocations[c];
    return nodes.reduce((anl2, p1, i) => {
        return nodes.slice(i + 1).reduce((anl3, p2) => {
            const rise = p1.row - p2.row;
            const run = p1.col - p2.col;
            const pp = { row: p2.row - rise, col: p2.col - run };
            if(pp.row >= 0 && pp.row < height && pp.col >= 0 && pp.col < width)
                anl3.add(`${pp.row},${pp.col}`);
            const pp2 = { row: p1.row + rise, col: p1.col + run };
            if(pp2.row >= 0 && pp2.row < height && pp2.col >= 0 && pp2.col < width)
                anl3.add(`${pp2.row},${pp2.col}`);
            return anl3;
        }, anl2);
    }, anl);
}, new Set<string>());

console.log(`Part 1: ${antiNodeLocs.size}`);

const antiNodeLocs2 = Object.keys(nodeLocations).reduce((anl, c) => {
    const nodes = nodeLocations[c];
    return nodes.reduce((anl2, p1, i) => {
        return nodes.slice(i + 1).reduce((anl3, p2) => {
            const rise = p1.row - p2.row;
            const run = p1.col - p2.col;
            return Array.from({ length: width + height }, (_, k) => k).reduce((anl4, k) => {
                const pp = { row: p2.row - (rise * k), col: p2.col - (run * k) };
                if(pp.row >= 0 && pp.row < height && pp.col >= 0 && pp.col < width)
                    anl3.add(`${pp.row},${pp.col}`);
                const pp2 = { row: p1.row + (rise * k), col: p1.col + (run * k) };
                if(pp2.row >= 0 && pp2.row < height && pp2.col >= 0 && pp2.col < width)
                    anl3.add(`${pp2.row},${pp2.col}`);
                return anl3;
            }, anl3);
        }, anl2);
    }, anl);
}, new Set<string>());

console.log(`Part 2: ${antiNodeLocs2.size}`);