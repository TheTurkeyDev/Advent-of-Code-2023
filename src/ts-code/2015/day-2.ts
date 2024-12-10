import { input } from './inputs/day-2';


const needed = input.split('\n').map((dimStr) => {
    const dims = dimStr.split('x').map(i => parseInt(i));
    const area = (2 * dims[0] * dims[1]) + (2 * dims[1] * dims[2]) + (2 * dims[2] * dims[0]);
    dims.sort((a, b) => a - b);
    return {
        paper: area + (dims[0] * dims[1]),
        ribbon: dims[0] + dims[0] + dims[1] + dims[1] + (dims[0] * dims[1] * dims[2]),
    };
}).reduce((sum, prev) => ({
    paper: sum.paper + prev.paper,
    ribbon: sum.ribbon + prev.ribbon
}), {
    paper: 0,
    ribbon: 0,
});

console.log(needed.paper);
console.log(needed.ribbon);