import { input } from './day-7-input';

type CardValues = { readonly [key: string]: number }
const part1CardValues: CardValues = {
    'A': 12,
    'K': 11,
    'Q': 10,
    'J': 9,
    'T': 8,
    '9': 7,
    '8': 6,
    '7': 5,
    '6': 4,
    '5': 3,
    '4': 2,
    '3': 1,
    '2': 0
};

const part2CardValues: CardValues = {
    'A': 12,
    'K': 11,
    'Q': 10,
    'T': 9,
    '9': 8,
    '8': 7,
    '7': 6,
    '6': 5,
    '5': 4,
    '4': 3,
    '3': 2,
    '2': 1,
    'J': 0,
};

const countCards = (hand: string) => hand.split('').reduce((cards, c) => ({ ...cards, [c]: (cards[c] ?? 0) + 1 }), {} as CardValues);

const getType = (hand: string) => {
    const cards = countCards(hand);
    const keys = Object.keys(cards);
    const maxPair = keys.reduce((ofAKind, c) => Math.max(ofAKind, cards[c]), 0);

    if (maxPair === 5)
        return 6;
    if (maxPair === 4)
        return 5;
    if (maxPair === 3)
        return keys.length === 2 ? 4 : 3;
    if (maxPair === 2)
        return keys.length === 3 ? 2 : 1;
    return 0;
};

const getPart2Type = (hand: string) => {
    const cards = countCards(hand);
    const jokersAmount = cards['J'] ?? 0;
    const keys = Object.keys(cards);
    const maxPair = keys.filter(k => k !== 'J').reduce((ofAKind, c) => Math.max(ofAKind, cards[c]), 0);

    if (maxPair + jokersAmount === 5)
        return 6;
    if (maxPair + jokersAmount === 4)
        return 5;
    if (maxPair + jokersAmount === 3)
        return keys.length - (jokersAmount > 0 ? 1 : 0) === 2 ? 4 : 3;
    if (maxPair + jokersAmount === 2)
        return keys.length - (jokersAmount > 0 ? 1 : 0) === 3 ? 2 : 1;
    return 0;
};

type HandData = {
    readonly hand: string,
    readonly bid: number
}

const getSort = (getPartType: (hand: string) => number, cardValues: CardValues) => {
    return (a: HandData, b: HandData) => {
        const aType = getPartType(a.hand);
        const bType = getPartType(b.hand);

        if (aType !== bType)
            return bType - aType;

        const aCards = a.hand.split('');
        const bCards = b.hand.split('');
        const val = aCards.reduce((returnVal, card, index) => {
            if (returnVal !== 0)
                return returnVal;
            if (cardValues[card] !== cardValues[bCards[index]])
                return cardValues[bCards[index]] - cardValues[card];
            return 0;
        }, 0);

        return val;
    };
};

const parsed = input.split('\n').map(l => {
    const parts = l.split(' ');
    return {
        hand: parts[0],
        bid: parseInt(parts[1], 10)
    };
});

const part1 = parsed
    .sort(getSort(getType, part1CardValues))
    .reduce((sum, hand, index, arr) => sum + (hand.bid * (arr.length - index)), 0);

console.log(`Part 1: ${part1}`);

const part2 = parsed
    .sort(getSort(getPart2Type, part2CardValues))
    .reduce((sum, hand, index, arr) => sum + (hand.bid * (arr.length - index)), 0);

console.log(`Part 2: ${part2}`);