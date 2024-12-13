
// eslint-disable-next-line functional/no-let
let part = 1;
// eslint-disable-next-line functional/no-let
let timerStart = new Date().getTime();

export const header = (dayNum: number) => {
    console.log(`=== Day ${dayNum} ===`);
    timerStart = new Date().getTime();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lap = (answer: any) => {
    const timeSpent = new Date().getTime() - timerStart;
    console.log(`Part ${part}: ${answer}, Duration: ${timeToString(timeSpent)}`);
    timerStart = new Date().getTime();
    part++;
};

const timeToString = (timeSpent: number) => {
    if (timeSpent < 1000)
        return timeSpent + 'ms';
    return (timeSpent / 1000.0) + 's';
};