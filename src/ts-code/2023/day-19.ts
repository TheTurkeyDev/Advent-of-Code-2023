/* eslint-disable functional/no-let */
import { input } from './day-19-input';

const inputsSections = input.split('\n\n');

type Conditions = {
    readonly category: string,
    readonly compare: string,
    readonly value: number,
    readonly action: string
}

const isAcceptReject = (v: string) => v === 'A' || v === 'R';

const workflows = inputsSections[0].split('\n').reduce((wfs, wf) => {
    const name = wf.substring(0, wf.indexOf('{'));
    const conditions = wf.substring(wf.indexOf('{') + 1, wf.indexOf('}')).split(',').map((c, i, arr) => {
        if (i === arr.length - 1) {
            return {
                category: '',
                compare: '=',
                value: 0,
                action: c
            };
        }

        const category = c.substring(0, 1);
        const compare = c.substring(1, 2);
        const value = parseInt(c.substring(2, c.indexOf(':')), 10);
        const action = c.substring(c.indexOf(':') + 1);

        return {
            category,
            compare,
            value,
            action
        };
    });

    return {
        ...wfs,
        [name]: conditions
    };
}, {} as { readonly [key: string]: readonly Conditions[] });

const parts = inputsSections[1].split('\n').map(p => {
    return p.substring(1, p.length - 1).split(',').reduce((partInfo, i) => {
        return {
            ...partInfo,
            [i.substring(0, 1)]: parseInt(i.substring(2))
        };
    }, {} as { readonly [key: string]: number });
});

const part1 = parts.reduce((sum, part, i) => {
    let workflow = workflows['in'];
    let result = '';
    do {
        for (let i = 0; i < workflow.length; i++) {
            const cond = workflow[i];
            if (cond.compare === '>') {
                if (part[cond.category] > cond.value) {
                    if (isAcceptReject(cond.action)) {
                        result = cond.action;
                        break;
                    }
                    else {
                        workflow = workflows[cond.action];
                        break;
                    }
                }
            }
            else if (cond.compare === '<') {
                if (part[cond.category] < cond.value) {
                    if (isAcceptReject(cond.action)) {
                        result = cond.action;
                        break;
                    }
                    else {
                        workflow = workflows[cond.action];
                        break;
                    }
                }
            }
            else if (cond.compare === '=') {
                if (isAcceptReject(cond.action)) {
                    result = cond.action;
                    break;
                }
                else {
                    workflow = workflows[cond.action];
                    break;
                }
            }
        }
    } while (!isAcceptReject(result));

    return sum + (result === 'A' ? Object.keys(part).reduce((sum2, k) => sum2 + part[k], 0) : 0);
}, 0);

console.log(`Part 1: ${part1}`);

type Part = {
    readonly xMin: number,
    readonly xMax: number,
    readonly mMin: number,
    readonly mMax: number,
    readonly aMin: number,
    readonly aMax: number,
    readonly sMin: number,
    readonly sMax: number,
}

const calcSum = (part: Part) => (part.xMax - part.xMin) * (part.mMax - part.mMin) * (part.aMax - part.aMin) * (part.sMax - part.sMin);

const capPartSum = (part: Part, workflow: readonly Conditions[]) => {
    let sum = 0;

    for (let i = 0; i < workflow.length; i++) {
        const wf = workflow[i];
        if (wf.compare === '>') {
            const partSplit = {
                xMin: wf.category !== 'x' ? part.xMin : Math.min(Math.max(part.xMin, wf.value + 1), part.xMax),
                xMax: part.xMax,
                mMin: wf.category !== 'm' ? part.mMin : Math.min(Math.max(part.mMin, wf.value + 1), part.mMax),
                mMax: part.mMax,
                aMin: wf.category !== 'a' ? part.aMin : Math.min(Math.max(part.aMin, wf.value + 1), part.aMax),
                aMax: part.aMax,
                sMin: wf.category !== 's' ? part.sMin : Math.min(Math.max(part.sMin, wf.value + 1), part.sMax),
                sMax: part.sMax,
            };
            part = {
                xMin: part.xMin,
                xMax: wf.category !== 'x' ? part.xMax : Math.max(Math.min(part.xMax, wf.value + 1), part.xMin),
                mMin: part.mMin,
                mMax: wf.category !== 'm' ? part.mMax : Math.max(Math.min(part.mMax, wf.value + 1), part.mMin),
                aMin: part.aMin,
                aMax: wf.category !== 'a' ? part.aMax : Math.max(Math.min(part.aMax, wf.value + 1), part.aMin),
                sMin: part.sMin,
                sMax: wf.category !== 's' ? part.sMax : Math.max(Math.min(part.sMax, wf.value + 1), part.sMin),
            };

            if (isAcceptReject(wf.action)) {
                if (wf.action === 'A')
                    sum += calcSum(partSplit);
            }
            else {
                sum += capPartSum(partSplit, workflows[wf.action]);
            }
        }
        else if (wf.compare === '<') {
            const partSplit = {
                xMin: part.xMin,
                xMax: wf.category !== 'x' ? part.xMax : Math.max(Math.min(part.xMax, wf.value), part.xMin),
                mMin: part.mMin,
                mMax: wf.category !== 'm' ? part.mMax : Math.max(Math.min(part.mMax, wf.value), part.mMin),
                aMin: part.aMin,
                aMax: wf.category !== 'a' ? part.aMax : Math.max(Math.min(part.aMax, wf.value), part.aMin),
                sMin: part.sMin,
                sMax: wf.category !== 's' ? part.sMax : Math.max(Math.min(part.sMax, wf.value), part.sMin),
            };
            part = {
                xMin: wf.category !== 'x' ? part.xMin : Math.min(Math.max(part.xMin, wf.value), part.xMax),
                xMax: part.xMax,
                mMin: wf.category !== 'm' ? part.mMin : Math.min(Math.max(part.mMin, wf.value), part.mMax),
                mMax: part.mMax,
                aMin: wf.category !== 'a' ? part.aMin : Math.min(Math.max(part.aMin, wf.value), part.aMax),
                aMax: part.aMax,
                sMin: wf.category !== 's' ? part.sMin : Math.min(Math.max(part.sMin, wf.value), part.sMax),
                sMax: part.sMax,
            };
            if (isAcceptReject(wf.action)) {
                if (wf.action === 'A')
                    sum += calcSum(partSplit);
            }
            else {
                sum += capPartSum(partSplit, workflows[wf.action]);
            }
        }
        else if (wf.compare === '=') {
            if (isAcceptReject(wf.action)) {
                if (wf.action === 'A')
                    sum += calcSum(part);
            }
            else {
                sum += capPartSum(part, workflows[wf.action]);
            }
        }
    }

    return sum;
};

console.log(`Part 2: ${ capPartSum({
    xMin: 1,
    xMax: 4001,
    mMin: 1,
    mMax: 4001,
    aMin: 1,
    aMax: 4001,
    sMin: 1,
    sMax: 4001,
}, workflows['in'])}`);