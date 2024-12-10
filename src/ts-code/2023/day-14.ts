/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */
import { input } from './inputs/day-14';

const tiltNorth = (grid: string[][]): string[][] => {
    return grid.map((row, y) => {
        return row.map((c, x) => {
            if (c === '.') {
                const rockIndx = grid.slice(y).findIndex(r => r[x] === 'O');
                const blockIndx = grid.slice(y).findIndex(r => r[x] === '#');
                if (rockIndx === -1 || (blockIndx < rockIndx && blockIndx !== -1))
                    return c;
                grid[rockIndx + y][x] = '.';
                return 'O';
            }
            return c;
        });
    });
};

const tiltSouth = (grid: string[][]): string[][] => {
    return grid.reverse().map((row, y) => {
        return row.map((c, x) => {
            if (c === '.') {
                const rockIndx = grid.slice(y).findIndex(r => r[x] === 'O');
                const blockIndx = grid.slice(y).findIndex(r => r[x] === '#');
                if (rockIndx === -1 || (blockIndx < rockIndx && blockIndx !== -1))
                    return c;
                grid[rockIndx + y][x] = '.';
                return 'O';
            }
            return c;
        });
    }).reverse();
};

const tiltWest = (grid: string[][]): string[][] => {
    return grid.map((row, y) => {
        return row.map((c, x) => {
            if (c === '.') {
                const rockIndx = row.slice(x).findIndex(r => r === 'O');
                const blockIndx = row.slice(x).findIndex(r => r === '#');
                if (rockIndx === -1 || (blockIndx < rockIndx && blockIndx !== -1))
                    return c;
                grid[y][rockIndx + x] = '.';
                return 'O';
            }
            return c;
        });
    });
};

const tiltEast = (grid: string[][]): string[][] => {
    return grid.map((row, y) => {
        return row.reverse().map((c, x) => {
            if (c === '.') {
                const rockIndx = row.slice(x).findIndex(r => r === 'O');
                const blockIndx = row.slice(x).findIndex(r => r === '#');
                if (rockIndx === -1 || (blockIndx < rockIndx && blockIndx !== -1))
                    return c;
                grid[y][rockIndx + x] = '.';
                return 'O';
            }
            return c;
        }).reverse();
    });
};

const cycle = (grid: string[][]): string[][] => {
    grid = tiltNorth(grid);
    grid = tiltWest(grid);
    grid = tiltSouth(grid);
    grid = tiltEast(grid);
    return grid;
};

const getLoadValue = (grid: string[][]): number => grid.reduce((sum, row, y) => {
    return sum + row.reduce((rowSum, cell) => {
        return rowSum + (cell === 'O' ? (grid.length - y) : 0);
    }, 0);
}, 0);

const grid = input.split('\n').map(l => l.split(''));
const part1Grid = tiltNorth(grid);

console.log(`Part 1: ${getLoadValue(part1Grid)}`);

let grid2 = input.split('\n').map(l => l.split(''));
const cache = {} as { [key: string]: number };
for (let i = 0; i < 1000000000; i++) {
    grid2 = cycle(grid2);
    const key = grid2.map(row => row.join('')).join('');
    if (!!cache[key]) {
        const cycleLength = i - cache[key];
        i += Math.floor((1000000000 - i) / cycleLength) * cycleLength;
    }
    else {
        cache[key] = i;
    }
}

console.log(`Part 2: ${getLoadValue(grid2)}`);