import { input } from './inputs/day-15';

type Ingredient = {
    readonly capacity: number,
    readonly durability: number,
    readonly flavor: number,
    readonly texture: number,
    readonly calories: number
}

const ignoreLastChar = (str: string) => str.substring(0, str.length - 1);

const ingredients: readonly Ingredient[] = input.split('\n').map(line => {
    const parts = line.split(' ');
    return {
        capacity: parseInt(ignoreLastChar(parts[2])),
        durability: parseInt(ignoreLastChar(parts[4])),
        flavor: parseInt(ignoreLastChar(parts[6])),
        texture: parseInt(ignoreLastChar(parts[8])),
        calories: parseInt(parts[10])
    };
});

const calc = (ing: readonly Ingredient[], teaspoonsLeft: number, score: Ingredient, caloriesToHit: number): number => {
    if (ing.length === 1) {
        const finalScore = {
            capacity: Math.max(score.capacity + (ing[0].capacity * teaspoonsLeft), 0),
            durability: Math.max(score.durability + (ing[0].durability * teaspoonsLeft), 0),
            flavor: Math.max(score.flavor + (ing[0].flavor * teaspoonsLeft), 0),
            texture: Math.max(score.texture + (ing[0].texture * teaspoonsLeft), 0),
            calories: Math.max(score.calories + (ing[0].calories * teaspoonsLeft), 0),
        };

        if (caloriesToHit === -1 || finalScore.calories === caloriesToHit)
            return finalScore.capacity * finalScore.durability * finalScore.flavor * finalScore.texture;
        return 0;
    }

    return Array.from({ length: teaspoonsLeft }, (_, i) => i).reduce((max, tspToUse) => {
        const newScore = {
            ...score,
            capacity: score.capacity + (ing[0].capacity * tspToUse),
            durability: score.durability + (ing[0].durability * tspToUse),
            flavor: score.flavor + (ing[0].flavor * tspToUse),
            texture: score.texture + (ing[0].texture * tspToUse),
            calories: score.calories + (ing[0].calories * tspToUse),
        };
        if (caloriesToHit !== -1 && newScore.calories > caloriesToHit)
            return max;

        return Math.max(max, calc(ing.slice(1), teaspoonsLeft - tspToUse, newScore, caloriesToHit));
    }, -1);
};


console.log(`Part 1: ${calc(ingredients, 100, {
    capacity: 0,
    durability: 0,
    flavor: 0,
    texture: 0,
    calories: 0
}, -1)}`);

console.log(`Part 2: ${calc(ingredients, 100, {
    capacity: 0,
    durability: 0,
    flavor: 0,
    texture: 0,
    calories: 0
}, 500)}`);