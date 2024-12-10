import { input } from './inputs/day-13';

const doesReflectColumn = (grid: readonly (readonly string[])[], left: number, right: number) => {
    if (right >= grid[0].length)
        return -1;
    return Array.from({ length: Math.min(left + 1, grid[0].length - right) }).reduce((wrong, _, i) => (
        (wrong as number) + grid.filter(line => line[left - i] !== line[right + i]).length
    ), 0);
};

const doesReflectRow = (grid: readonly (readonly string[])[], above: number, below: number) => {
    if (below >= grid.length)
        return -1;
    return Array.from({ length: Math.min(above + 1, grid.length - below) }).reduce((wrong, _, i) => (
        (wrong as number) + grid[above - i].filter((c, i2) => c !== grid[below + i][i2]).length
    ), 0);
};

const grid = input.split('\n\n').map(grid => grid.split('\n').map(l => l.split('')));

const part1 = grid.reduce((sum, grid) => {
    const rowReflect = grid.findIndex((_, row) => doesReflectRow(grid, row, row + 1) === 0);

    if (rowReflect !== -1)
        return sum + (100 * (rowReflect + 1));

    const colReflect = grid[0].findIndex((_, col) => doesReflectColumn(grid, col, col + 1) === 0) + 1;

    return sum + colReflect;
}, 0);

console.log(`Part 1 ${part1}`);

const part2 = grid.reduce((sum, grid) => {
    const rowReflect = grid.findIndex((_, row) => doesReflectRow(grid, row, row + 1) === 1);

    if (rowReflect !== -1)
        return sum + (100 * (rowReflect + 1));

    const colReflect = grid[0].findIndex((_, col) => doesReflectColumn(grid, col, col + 1) === 1) + 1;

    return sum + colReflect;
}, 0);

console.log(`Part 2 ${part2}`);