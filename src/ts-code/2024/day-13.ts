import { header, lap } from '../base';
import { input } from './inputs/day-13';

header(13);

type Position = {
    readonly x: number,
    readonly y: number
}

const calcCost = (aBtn: Position, bBtn: Position, prize: Position) => {
    const c1 = -prize.x;
    const a1 = aBtn.x;
    const b1 = bBtn.x;
    const c2 = -prize.y;
    const a2 = aBtn.y;
    const b2 = bBtn.y;
    const denom = (a1 * b2) - (a2 * b1);
    const i = ((b1 * c2) - (b2 * c1)) / denom;
    const j = ((a2 * c1) - (a1 * c2)) / denom;
    return i % 1 > 0 || j % 1 > 0 ? 0 : (i * 3) + j;
};

const answers = input.split('\n\n').map(cm => {
    const parts = cm.split('\n');
    const abs = parts[0];
    const ax = parseInt(abs.substring(12, abs.indexOf(',')));
    const ay = parseInt(abs.substring(abs.indexOf(',') + 4));
    const bbs = parts[1];
    const bx = parseInt(bbs.substring(12, bbs.indexOf(',')));
    const by = parseInt(bbs.substring(bbs.indexOf(',') + 4));
    const prize = parts[2];
    const px = parseInt(prize.substring(9, prize.indexOf(',')));
    const py = parseInt(prize.substring(prize.indexOf(',') + 4));
    return {
        aBtn: { x: ax, y: ay },
        bBtn: { x: bx, y: by },
        prize: { x: px, y: py },
        prize2: { x: px + 10000000000000, y: py + 10000000000000 },
    };
}).reduce((ans, clawMachine) => {
    const minCost = calcCost(clawMachine.aBtn, clawMachine.bBtn, clawMachine.prize);
    const minCost2 = calcCost(clawMachine.aBtn, clawMachine.bBtn, clawMachine.prize2);
    return [ans[0] + (minCost !== Number.MAX_VALUE ? minCost : 0), ans[1] + (minCost2 !== Number.MAX_VALUE ? minCost2 : 0)];
}, [0, 0]);

lap(answers[0]);
lap(answers[1]);