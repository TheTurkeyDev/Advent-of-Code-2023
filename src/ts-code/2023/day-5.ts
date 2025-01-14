/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-let */
import { input } from './inputs/day-5';

const lines = input.split('\n');
let values = lines[0].substring(7).split(' ').map(v => parseInt(v, 10));

const groups = input.split('\n\n').slice(1);

groups.forEach(g => {
    const map = g.split('\n').slice(1).map(l => {
        const parts = l.split(' ');
        return {
            destStart: parseInt(parts[0], 10),
            sourceStart: parseInt(parts[1], 10),
            range: parseInt(parts[2], 10),
        };
    });

    values = values.map(v => {
        const range = map.find(m => m.sourceStart <= v && m.sourceStart + m.range > v);
        return range ? (v - range.sourceStart) + range.destStart : v;
    });
});
console.log(`Part 1: ${values.reduce((min, v) => Math.min(min, v), Number.MAX_VALUE)}`);

values = lines[0].substring(7).split(' ').map(v => parseInt(v, 10));
let values2 = values.reduce((ranges, v, index) => {
    const newIndex = Math.floor(index / 2);
    ranges[newIndex] = [
        ...ranges[newIndex],
        v
    ];
    return ranges;
}, Array.from({ length: values.length / 2 }).fill([]) as number[][]).map(v => [v[0], v[0] + v[1] - 1]);

const overlap = (mapStart: number, mapEnd: number, valueStart: number, valueEnd: number) => valueStart < mapEnd && valueEnd >= mapStart;

const rangeSplit = (mapStart: number, mapEnd: number, valueStart: number, valueEnd: number) => {
    if (!overlap(mapStart, mapEnd, valueStart, valueEnd))
        return [[valueStart, valueEnd]];

    return [
        valueStart < mapStart ? [valueStart, mapStart - 1] : [],
        [Math.max(valueStart, mapStart), Math.min(valueEnd, mapEnd)],
        valueEnd >= mapEnd ? [mapEnd + 1, valueEnd] : [],
    ].filter(a => a.length === 2);
};

groups.forEach(g => {
    const map = g.split('\n').slice(1).map(l => {
        const parts = l.split(' ');
        return {
            destStart: parseInt(parts[0], 10),
            sourceStart: parseInt(parts[1], 10),
            range: parseInt(parts[2], 10),
        };
    });

    let newValues2 = [] as number[][];
    for (let value2 = 0; value2 < values2.length; value2++) {
        const v = values2[value2];
        let valueRanges = [v];
        const ranges = map.filter(m => overlap(m.sourceStart, m.sourceStart + m.range, v[0], v[1]));
        for (let r = 0; r < ranges.length; r++) {
            let range = ranges[r];
            let newRanges = [];
            for (let v2 = 0; v2 < valueRanges.length; v2++)
                newRanges.push(rangeSplit(range.sourceStart, range.sourceStart + range.range, valueRanges[v2][0], valueRanges[v2][1]));
            valueRanges = newRanges.flat();
        }
        newValues2 = [
            ...newValues2,
            ...valueRanges
        ];
    }

    values2 = newValues2.map(v => {
        const range = map.find(m => m.sourceStart <= v[0] && m.sourceStart + m.range > v[1]);
        return range ? [(v[0] - range.sourceStart) + range.destStart, (v[1] - range.sourceStart) + range.destStart] : v;
    });
});

console.log(`Part 2: ${values2.reduce((min, v) => Math.min(min, Math.min(v[0], v[1])), Number.MAX_VALUE)}`);