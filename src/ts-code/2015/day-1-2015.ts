import { input } from './day-1-2015-input';

const finalFloor = input.split('').reduce((floor, next) => floor + (next === ')' ? -1 : 1), 0);
console.log(finalFloor);

const basement = input.split('').reduce((floor, next, i) => floor[0] === -1 ? floor : [floor[0] + (next === ')' ? -1 : 1), i + 1], [0, 1]);
console.log(basement[1]);