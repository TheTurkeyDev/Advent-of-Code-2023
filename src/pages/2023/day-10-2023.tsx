import { useEffect, useState } from 'react';
import { DayBase } from '../day-base';
import { Headline5, Label } from 'gobble-lib-react';
import styled from 'styled-components';

const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
`;

const RadioLine = styled.div`
    display: flex;
    flex-direction: row;
    gap: 16px;
    margin-inline: auto;
    align-items: center;
`;

const RadioWrapper = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    gap: 2px;
`;

const MapContainer = styled.pre`
    display: grid;
    grid-template-columns: 1fr;
    font-family: monospace;
`;

const StartChar = styled.span`
    color: green;
`;

const ContainedChar = styled.span`
    color: red;
`;

const downChars = ['|', 'F', '7'];
const upChars = ['|', 'J', 'L'];
const leftChars = ['-', 'J', '7'];
const rightChars = ['-', 'F', 'L'];

const unicodeCharMapping: { readonly [key: string]: string } = {
    'F': '┏',
    'J': '┛',
    'L': '┗',
    '7': '┓',
    '|': '┃',
    '-': '━',
    '.': ' '
};

const arePosEqual = (pos1: readonly number[], pos2: readonly number[]) => pos1[0] === pos2[0] && pos1[1] === pos2[1];
const isInBounds = (pos: readonly number[], map: readonly (readonly string[])[]) => pos[1] >= 0 && pos[1] < map.length && pos[0] >= 0 && pos[0] < map[0].length;
const posToInt = (pos: readonly number[], map: readonly (readonly string[])[]) => (pos[1] * map[0].length) + pos[0];

const getConnecting = (pos: readonly number[], lastPos: readonly number[], map: readonly (readonly string[])[]) => {
    const char = map[pos[1]][pos[0]];

    const iters = [
        { chars: upChars, newPos: [pos[0], pos[1] - 1] },
        { chars: downChars, newPos: [pos[0], pos[1] + 1] },
        { chars: rightChars, newPos: [pos[0] + 1, pos[1]] },
        { chars: leftChars, newPos: [pos[0] - 1, pos[1]] }
    ];

    const i = iters.findIndex(iter => (
        iter.chars.includes(char) && isInBounds(iter.newPos, map) && !arePosEqual(iter.newPos, lastPos)
    ));

    return iters[i]?.newPos ?? [0, 0];
};

export const Day10 = () => {
    const [map, setMap] = useState<readonly (readonly string[])[]>([]);
    const [input, setInput] = useState('');
    const [display, setDisplay] = useState(0);
    const [startingPosition, setStartingPosition] = useState<readonly number[]>([]);
    const [pathPositions, setPathPositions] = useState<readonly (readonly number[])[]>([]);
    const [containedPositions, setContainedPositions] = useState<readonly number[]>([]);

    useEffect(() => {
        if (!input)
            return;
        const mapVar = input.split('\n').map(l => l.split(''));

        const getStartingPos = () => {
            const y = mapVar.findIndex(l => l.includes('S'));
            const x = mapVar[y].findIndex(c => c === 'S');
            return [x, y];
        };

        const startingPos = getStartingPos();
        setStartingPosition(startingPos);

        const doFirstMove = () => {
            const left = [startingPos[0] - 1, startingPos[1]];
            const isLeft = '-FL'.includes(mapVar[left[1]][left[0]]);
            const right = [startingPos[0] + 1, startingPos[1]];
            const isRight = '-7J'.includes(mapVar[right[1]][right[0]]);
            const down = [startingPos[0], startingPos[1] + 1];
            const isDown = '|JL'.includes(mapVar[down[1]][down[0]]);
            const up = [startingPos[0], startingPos[1] - 1];
            const isUp = '|F7'.includes(mapVar[up[1]][up[0]]);
            if (isRight && isLeft) {
                mapVar[startingPos[1]][startingPos[0]] = '-';
                return [right, left];
            }
            if (isUp && isDown) {
                mapVar[startingPos[1]][startingPos[0]] = '|';
                return [up, down];
            }
            if (isRight && isDown) {
                mapVar[startingPos[1]][startingPos[0]] = 'F';
                return [right, down];
            }
            if (isLeft && isUp) {
                mapVar[startingPos[1]][startingPos[0]] = 'J';
                return [left, up];
            }
            if (isLeft && isDown) {
                mapVar[startingPos[1]][startingPos[0]] = '7';
                return [left, down];
            }
            if (isRight && isUp) {
                mapVar[startingPos[1]][startingPos[0]] = 'L';
                return [right, up];
            }

            return [startingPos, startingPos];
        };

        // eslint-disable-next-line functional/no-let
        let lastPositions = [startingPos, startingPos];
        // eslint-disable-next-line functional/no-let
        let positions = doFirstMove();
        console.log(mapVar[startingPos[1]][startingPos[0]]);
        // eslint-disable-next-line functional/no-let
        let moves = 1;

        // eslint-disable-next-line functional/prefer-readonly-type
        const paths = Array.from({ length: mapVar.length }).fill([]) as number[][];
        paths[startingPos[1]].push(posToInt(startingPos, mapVar));
        paths[positions[0][1]].push(posToInt(positions[0], mapVar));
        paths[positions[1][1]].push(posToInt(positions[1], mapVar));
        while (!arePosEqual(positions[0], positions[1])) {
            const pos1 = positions[0];
            const newPos1 = getConnecting(pos1, lastPositions[0], mapVar);
            const pos2 = positions[1];
            const newPos2 = getConnecting(pos2, lastPositions[1], mapVar);
            lastPositions = [pos1, pos2];
            positions = [newPos1, newPos2];
            paths[newPos1[1]].push(posToInt(newPos1, mapVar));
            paths[newPos2[1]].push(posToInt(newPos2, mapVar));
            moves++;
        }
        setPathPositions(paths);

        // eslint-disable-next-line functional/prefer-readonly-type
        const containedPos = [] as number[];
        mapVar.forEach((mapY, y) => {
            const yPathPos = paths[y];
            mapY.forEach((_, x) => {
                const num = y * mapY.length;
                if (yPathPos.length <= 2 || yPathPos.includes(num + x))
                    return;

                const isInside = Array.from({ length: x + 1 }).map((_, i, arr) => (arr.length - i) - 1).reduce((isInside, xx) => {
                    if (yPathPos.includes(num + xx) && 'JL|'.includes(mapY[xx]))
                        isInside = !isInside;
                    return isInside;
                }, false);

                if (isInside)
                    containedPos.push(posToInt([x, y], mapVar));
            });
        });

        setContainedPositions(containedPos);
        setMap(mapVar);
    }, [input]);

    const getCharsForDisplay = (c: string, x: number, y: number) => {
        const isStart = startingPosition[0] === x && startingPosition[1] === y;
        if (display === 1) {
            return isStart ? <StartChar key={`${x},${y}`}>{unicodeCharMapping[c]}</StartChar> : unicodeCharMapping[c];
        }
        else if (display === 2) {
            const posNum = posToInt([x, y], map);
            return pathPositions[y].includes(posNum) ?
                (isStart ? <StartChar key={`${x},${y}`}>{unicodeCharMapping[c]}</StartChar> : unicodeCharMapping[c])
                : ' ';
        }
        else if (display === 3) {
            const isPath = pathPositions[y].includes(posToInt([x, y], map));
            const isContained = containedPositions.includes(posToInt([x, y], map));
            return isPath ?
                (isStart ? <StartChar key={`${x},${y}`}>{unicodeCharMapping[c]}</StartChar> : unicodeCharMapping[c]) :
                (isContained ? <ContainedChar key={`${x},${y}`}>#</ContainedChar> : ' ');
        }
        return c;
    };
    return (
        <DayBase day={10} setInput={setInput}>
            <ContentWrapper>
                <RadioLine>
                    <Headline5>Display Type</Headline5>
                    <RadioWrapper>
                        <Label>Raw</Label>
                        <input type='radio' name='displayOption' onChange={() => setDisplay(0)} checked={display === 0} />
                    </RadioWrapper>
                    <RadioWrapper>
                        <Label>Styled</Label>
                        <input type='radio' name='displayOption' onChange={() => setDisplay(1)} checked={display === 1} />
                    </RadioWrapper>
                    <RadioWrapper>
                        <Label>Filtered</Label>
                        <input type='radio' name='displayOption' onChange={() => setDisplay(2)} checked={display === 2} />
                    </RadioWrapper>
                    <RadioWrapper>
                        <Label>Enclosed</Label>
                        <input type='radio' name='displayOption' onChange={() => setDisplay(3)} checked={display === 3} />
                    </RadioWrapper>
                </RadioLine>
                <MapContainer>
                    {
                        map.map((l, y) => <div key={y}>{l.map((c, x) => getCharsForDisplay(c, x, y))}</div>)
                    }
                </MapContainer>
            </ContentWrapper>
        </DayBase>
    );
};