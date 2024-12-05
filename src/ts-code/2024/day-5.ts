import { input } from './day-5-input';

type Rules = {
    readonly [key: number]: {
        readonly before: readonly number[];
        readonly after: readonly number[]
    }
}

const inputHalves = input.split('\n\n');

const rules = inputHalves[0].split('\n').map(l => l.split('|').map(n => parseInt(n))).reduce((rs, l) => {
    return {
        ...rs,
        [l[0]]: {
            before: [...(rs[l[0]]?.before ?? [])],
            after: [...(rs[l[0]]?.after ?? []), l[1]],
        },
        [l[1]]: {
            before: [...(rs[l[1]]?.before ?? []), l[0]],
            after: [...(rs[l[1]]?.after ?? [])],
        },
    };
}, {} as Rules);

const getInvalid = (parts: readonly number[]) => {
    return parts.reduce((invalid, num, i) => {
        if (invalid[0] !== -1)
            return invalid;

        const afterRulesForNum = rules[num]?.after ?? [];
        const invalidNum = parts.slice(0, i).find(n => afterRulesForNum.includes(n)) ?? -1;
        if (invalidNum !== -1)
            return [num, invalidNum];

        const beforeRuleForNum = rules[num]?.before ?? [];
        const invalidNum2 = parts.slice(i + 1, parts.length).find(n => beforeRuleForNum.includes(n)) ?? -1;
        if (invalidNum2 !== -1)
            return [num, invalidNum2];

        return invalid;
    }, [-1, -1]);
};

const partAnswers = inputHalves[1].split('\n').map(l => l.split(',').map(n => parseInt(n))).reduce((answers, updates) => {
    // eslint-disable-next-line functional/no-let
    let invalid = getInvalid(updates);
    if (invalid[0] === -1) {
        return [answers[0] + updates[Math.floor(updates.length / 2)], answers[1]];
    }
    else {
        while (invalid[0] !== -1) {
            const index1 = updates.indexOf(invalid[0]);
            const index2 = updates.indexOf(invalid[1]);
            updates[index1] = invalid[1];
            updates[index2] = invalid[0];
            invalid = getInvalid(updates);
        }
        return [answers[0], answers[1] + updates[Math.floor(updates.length / 2)]];
    }
}, [0, 0]);

console.log(`Part 1: ${partAnswers[0]}`);
console.log(`Part 2: ${partAnswers[1]}`);