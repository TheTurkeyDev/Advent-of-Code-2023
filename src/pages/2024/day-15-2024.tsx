import { useEffect, useState } from 'react';
import { DayBase } from '../day-base';
import { Body1, ButtonRow, ContainedButton, OutlinedButton, useInterval } from 'gobble-lib-react';
import styled from 'styled-components';

const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
`;

const Grid = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    font-size: 12px;
`;

type Point = {
    readonly x: number
    readonly y: number
}

const directionOffset = (p: Point, d: string) => {
    switch (d) {
        case '^':
            return { x: p.x, y: p.y - 1 };
        case '>':
            return { x: p.x + 1, y: p.y };
        case 'v':
            return { x: p.x, y: p.y + 1 };
        case '<':
            return { x: p.x - 1, y: p.y };
    }
    return p;
};

const move1 = (map: readonly (readonly string[])[], robot: Point, d: string): readonly [Point, readonly (readonly string[])[]] => {
    //Terrible hack
    const newMap = map.map(m => m.map(m2 => m2));
    // eslint-disable-next-line functional/no-let
    let canMove = false;
    // eslint-disable-next-line functional/no-let
    let p = robot;
    const toMove = [];
    do {
        p = directionOffset(p, d);
        if (newMap[p.y][p.x] === '.') {
            canMove = true;
            break;
        }
        toMove.push(p);
    } while (newMap[p.y][p.x] !== '#');

    if (!canMove)
        return [robot, newMap];

    toMove.reverse().forEach(pt => {
        const np = directionOffset(pt, d);
        newMap[np.y][np.x] = newMap[pt.y][pt.x];
    });
    newMap[robot.y][robot.x] = '.';
    robot = directionOffset(robot, d);
    newMap[robot.y][robot.x] = '@';
    return [robot, newMap];
};

const move2 = (map: readonly (readonly string[])[], robot: Point, d: string): readonly [Point, readonly (readonly string[])[]] => {
    //Terrible hack
    const newMap = map.map(m => m.map(m2 => m2));
    // eslint-disable-next-line functional/no-let
    let canMove = false;
    // eslint-disable-next-line functional/no-let
    let p = robot;
    // eslint-disable-next-line functional/prefer-readonly-type
    const boxes = [] as Point[];
    if (d === '<' || d === '>') {
        do {
            p = directionOffset(p, d);
            if (newMap[p.y][p.x] === '.') {
                canMove = true;
                break;
            }
            if (newMap[p.y][p.x] === '[')
                boxes.push(p);
        } while (newMap[p.y][p.x] !== '#');
    }
    else {
        // eslint-disable-next-line functional/no-let
        let wallFound = false;
        const lastBoxes = [];
        p = directionOffset(p, d);
        const nextChar = map[p.y][p.x];
        if (nextChar === '[')
            lastBoxes.push(p);
        else if (nextChar === ']')
            lastBoxes.push({ x: p.x - 1, y: p.y });
        else if (nextChar === '#')
            wallFound = true;
        else if (nextChar === '.')
            canMove = true;

        while (!wallFound && lastBoxes.length !== 0) {
            // eslint-disable-next-line functional/no-let
            let allEmpty = true;
            const nextBoxes = [];
            // eslint-disable-next-line functional/no-let
            for (let i = 0; i < lastBoxes.length; i++) {
                const box = lastBoxes[i];
                // eslint-disable-next-line functional/no-let
                for (let j = 0; j < 2; j++) {
                    const nextP = directionOffset({ x: box.x + j, y: box.y }, d);
                    const nextChar = newMap[nextP.y][nextP.x];
                    if (nextChar !== '.')
                        allEmpty = false;
                    if (nextChar === '#') {
                        wallFound = true;
                        break;
                    }
                    if (nextChar === '[')
                        nextBoxes.push(nextP);
                    else if (nextChar === ']')
                        nextBoxes.push({ x: nextP.x - 1, y: nextP.y });

                }
            }
            while (lastBoxes.length > 0) {
                const b = lastBoxes.pop();
                if (!!b && !boxes.find(bb => bb.x === b.x && bb.y === b.y))
                    boxes.push(b);
            }
            nextBoxes.forEach(b => lastBoxes.push(b));
            if (allEmpty) {
                canMove = true;
                break;
            }
        }
    }

    if (!canMove)
        return [robot, newMap];

    //Clear out box locations
    boxes.forEach(pt => {
        newMap[pt.y][pt.x] = '.';
        newMap[pt.y][pt.x + 1] = '.';
    });
    //Set new box locations
    boxes.forEach(pt => {
        const np = directionOffset(pt, d);
        newMap[np.y][np.x] = '[';
        newMap[np.y][np.x + 1] = ']';
    });
    newMap[robot.y][robot.x] = '.';
    robot = directionOffset(robot, d);
    newMap[robot.y][robot.x] = '@';
    return [robot, newMap];
};

export const Day15 = () => {
    const [input, setInput] = useState('');
    const [map, setMap] = useState<readonly (readonly string[])[]>([]);
    const [map2, setMap2] = useState<readonly (readonly string[])[]>([]);
    const [dispMap, setDispMap] = useState<readonly (readonly string[])[]>([]);
    const [robot, setRobot] = useState({ x: 0, y: 0 });
    const [robot2, setRobot2] = useState({ x: 0, y: 0 });
    const [steps, setSteps] = useState<readonly string[]>([]);
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (input === '')
            return;

        const inputParts = input.split('\n\n');
        const map = inputParts[0].split('\n').map(line => line.split(''));
        const map2 = inputParts[0].split('\n').map(line => line.split('').reduce((row, char) => {
            switch (char) {
                case '#':
                case '.':
                    return [...row, char, char];
                case 'O':
                    return [...row, '[', ']'];
                case '@':
                    return [...row, char, '.'];
            }
            return row;
            // eslint-disable-next-line functional/prefer-readonly-type
        }, [] as string[]));

        setMap(map);
        setMap2(map2);
        setRobot(map.reduce((pt, row, rowI) => row.reduce((p, c, colI) => c === '@' ? { x: colI, y: rowI } : p, pt), { x: 0, y: 0 }));
        setRobot2(map2.reduce((pt, row, rowI) => row.reduce((p, c, colI) => c === '@' ? { x: colI, y: rowI } : p, pt), { x: 0, y: 0 }));
        setSteps(inputParts[1].split('\n').reduce((steps, line) => [...steps, ...line.split('')], [] as readonly string[]));
    }, [input]);

    useEffect(() => {
        const info = steps.slice(0, step).reduce((data, d) => {
            const [r1, newMap] = move1(data[2], data[0], d);
            const [r2, newMap2] = move2(data[3], data[1], d);
            return [r1, r2, newMap, newMap2] as readonly [Point, Point, readonly (readonly string[])[], readonly (readonly string[])[]];
        }, [robot, robot2, map, map2] as readonly [Point, Point, readonly (readonly string[])[], readonly (readonly string[])[]]);
        setDispMap(info[3]);
    }, [step, robot, robot2, map, map2]);

    return (
        <DayBase day={15} setInput={setInput}>
            <ContentWrapper>
                <Body1>{step}/{steps.length}</Body1>
                <input type='range' id='volume' name='volume' min={0} max={steps.length} value={step} onChange={e => setStep(parseInt(e.target.value))} />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Body1>Instruction: {step === 0 ? 'Initial State' : steps[step - 1]} | Score: {dispMap.reduce((score, row, y) => row.reduce((scr, c, x) => scr + (c === '[' ? (100 * y) + x : 0), score), 0)}</Body1>
                    <ButtonRow>
                        <OutlinedButton onClick={() => setStep(Math.max(0, step - 1))}>Back</OutlinedButton>
                        <OutlinedButton onClick={() => setStep(Math.min(steps.length, step + 1))}>Next</OutlinedButton>
                    </ButtonRow>
                </div>
                <Grid style={{ gridTemplateRows: `repeat(${dispMap.length}, 12px)`, gridTemplateColumns: `repeat(${dispMap[0]?.length ?? 0}, 10px)` }}>
                    {dispMap.map((row, y) => row.map((c, x) => <span key={`${x},${y}`}>{c === '.' ? '' : c}</span>))}
                </Grid>
            </ContentWrapper>
        </DayBase>
    );
};