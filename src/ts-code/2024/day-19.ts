import { header, lap } from '../base';
import { input } from './inputs/day-19';

header(19);

const inputLines = input.split('\n');
const towels = inputLines[0].split(', ');
const cache = new Map<string, number>();
cache.set('', 1);

const getPatternCompositions = (pattern: string): number => {
    if (cache.has(pattern))
        return cache.get(pattern) ?? 0;

    const ret = towels.reduce((sum, t) => (
        sum + (pattern.startsWith(t) ? getPatternCompositions(pattern.substring(t.length)) : 0)
    ), 0);
    cache.set(pattern, ret);
    return ret;
};

const parts = inputLines.slice(2).reduce((partAns, pattern) => {
    const paths = getPatternCompositions(pattern);
    return [partAns[0] + (paths > 0 ? 1 : 0), partAns[1] + paths];
}, [0, 0]);
lap(parts[0]);
lap(parts[1]);