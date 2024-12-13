import { header, lap } from '../base';
import { input } from './inputs/day-18';

header(18);

const map = input.split('\n').map(line => line.split('').map(c => c === '#'));
const height = map.length - 1;
const width = map[0].length - 1;

const part1 = Array.from({ length: 100 }, (_, i) => i)
    .reduce((m, _) => (
        m.map((rowB, row) => (
            rowB.map((colB, col) => {
                const onCount = Array.from({ length: 3 }, (_, j) => row + (j - 1)).reduce((count, j) => (
                    Array.from({ length: 3 }, (_, k) => col + (k - 1)).reduce((cnt, k) => {
                        if ((j === row && k === col) || j < 0 || k < 0 || j > height || k > width)
                            return cnt;
                        return cnt + (m[j][k] ? 1 : 0);
                    }, count)
                ), 0);
                return (colB && (onCount === 2 || onCount === 3)) || (!colB && onCount === 3);
            })
        ))
    ), map)
    .reduce((count, row) => row.reduce((cnt, col) => cnt + (col ? 1 : 0), count), 0);
lap(part1);

const isCorner = (row: number, col: number) => (row === 0 && (col === 0 || col === width)) || (row === height && (col === 0 || col === width));
const part2 = Array.from({ length: 100 }, (_, i) => i)
    .reduce((m, _) => (
        m.map((rowB, row) => (
            rowB.map((colB, col) => {
                const onCount = Array.from({ length: 3 }, (_, j) => row + (j - 1)).reduce((count, j) => (
                    Array.from({ length: 3 }, (_, k) => col + (k - 1)).reduce((cnt, k) => {
                        if ((j === row && k === col) || j < 0 || k < 0 || j > height || k > width)
                            return cnt;
                        return cnt + (m[j][k] ? 1 : 0);
                    }, count)
                ), 0);
                return isCorner(row, col) ? true : (colB && (onCount === 2 || onCount === 3)) || (!colB && onCount === 3);
            })
        ))
    ), map.map((rowB, row) => rowB.map((colB, col) => isCorner(row, col) ? true : colB)))
    .reduce((count, row) => row.reduce((cnt, col) => cnt + (col ? 1 : 0), count), 0);
lap(part2);