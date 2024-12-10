import { input } from './inputs/day-9';

type SrcDest = {
    readonly [src: string]: readonly { readonly dest: string, readonly dist: number }[]
}

const srcDestMap = input.split('\n').reduce((list, path) => {
    const locDist = path.split(' = ');
    const srcDest = locDist[0].split(' to ');

    return {
        ...list,
        [srcDest[0]]: [
            ...(list[srcDest[0]] ?? []),
            { dest: srcDest[1], dist: parseInt(locDist[1]) }
        ],
        [srcDest[1]]: [
            ...(list[srcDest[1]] ?? []),
            { dest: srcDest[0], dist: parseInt(locDist[1]) }
        ]
    };
}, {} as SrcDest);

const getMinMaxRemain = (useMin: boolean, src: string, map: SrcDest): number => {
    if (map[src].length === 1)
        return map[src][0].dist;

    return map[src].reduce((v, route) => {
        const nm = Object.keys(map).reduce((nm, k) => {
            if (k === src)
                return nm;

            return {
                ...nm,
                [k]: map[k].filter(rt => rt.dest !== src)
            };
        }, {} as SrcDest);
        const val = route.dist + getMinMaxRemain(useMin, route.dest, nm);
        return useMin ? Math.min(v, val) : Math.max(v, val);
    }, useMin ? Number.MAX_VALUE : 0);
};

const answer = Object.keys(srcDestMap).reduce((min, src) => Math.min(min, getMinMaxRemain(true, src, srcDestMap)), Number.MAX_VALUE);
console.log(`Part 1: ${answer}`);

const answer2 = Object.keys(srcDestMap).reduce((max, src) => Math.max(max, getMinMaxRemain(false, src, srcDestMap)), 0);
console.log(`Part 2: ${answer2}`);