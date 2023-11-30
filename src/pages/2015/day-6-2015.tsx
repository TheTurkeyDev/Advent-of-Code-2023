import { createRef, useEffect, useState } from 'react';
import { DayBase } from '../day-base';
import styled from 'styled-components';
import { Body1, Card, CardContent, CardHeader, Headline4, InputsWrapper, ToggleSwitch } from 'gobble-lib-react';
import { AnswerHighlightBody1 } from '../../styling/text-styles';
import { AnswersCard } from '../../components/answers-card';

const ContentWrapper = styled.div`
    display: grid;
    grid-template-rows: auto 500px auto;
    gap: 16px;
`;

const LightsDisplayWrapper = styled.canvas`
    background-color: black;
    height: 100%;
`;

const TopRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

export const Day6 = () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const [step, setStep] = useState(0);
    const [input, setInput] = useState('');
    const [part1, setPart1] = useState(true);
    const [lights1, setLights1] = useState<readonly (readonly boolean[])[]>(new Array(1000).fill(false).map(() => new Array(1000).fill(false)));
    const [lights2, setLights2] = useState<readonly (readonly number[])[]>(new Array(1000).fill(false).map(() => new Array(1000).fill(false)));

    useEffect(() => {
        if (input === '')
            return;
        setStep(input.split('\n').length);
    }, [input]);

    useEffect(() => {
        if (input === '')
            return;
        const inputPortion = input.split('\n').slice(0, step);
        const lights = new Array(1000).fill(false).map(() => new Array(1000).fill(false));
        inputPortion.forEach(l => {
            const setRangeValues = (lowX: number, lowY: number, highX: number, highY: number, value: boolean) => {
                // eslint-disable-next-line functional/no-let
                for (let x = lowX; x <= highX; x++) {
                    // eslint-disable-next-line functional/no-let
                    for (let y = lowY; y <= highY; y++)
                        lights[x][y] = value;
                }
            };
            const setRangeToggle = (lowX: number, lowY: number, highX: number, highY: number) => {
                // eslint-disable-next-line functional/no-let
                for (let x = lowX; x <= highX; x++) {
                    // eslint-disable-next-line functional/no-let
                    for (let y = lowY; y <= highY; y++)
                        lights[x][y] = !lights[x][y];
                }
            };

            const parts = l.split(' ');
            if (parts[0] === 'turn') {
                const startCords = parts[2].split(',');
                const endCords = parts[4].split(',');
                const x1 = parseInt(startCords[0]);
                const y1 = parseInt(startCords[1]);
                const x2 = parseInt(endCords[0]);
                const y2 = parseInt(endCords[1]);
                if (parts[1] === 'on')
                    setRangeValues(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), true);
                else if (parts[1] === 'off')
                    setRangeValues(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), false);
            }
            else if (parts[0] === 'toggle') {
                const startCords = parts[1].split(',');
                const endCords = parts[3].split(',');
                const x1 = parseInt(startCords[0]);
                const y1 = parseInt(startCords[1]);
                const x2 = parseInt(endCords[0]);
                const y2 = parseInt(endCords[1]);
                setRangeToggle(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2));
            }
        });
        setLights1(lights);

        const lights2 = new Array(1000).fill(0).map(() => new Array(1000).fill(0));

        const changeRangeValues = (lowX: number, lowY: number, highX: number, highY: number, amount: number) => {
            // eslint-disable-next-line functional/no-let
            for (let x = lowX; x <= highX; x++) {
                // eslint-disable-next-line functional/no-let
                for (let y = lowY; y <= highY; y++)
                    lights2[x][y] = Math.max(lights2[x][y] + amount, 0);
            }
        };

        inputPortion.forEach(l => {
            const parts = l.split(' ');
            if (parts[0] === 'turn') {
                const startCords = parts[2].split(',');
                const endCords = parts[4].split(',');
                const x1 = parseInt(startCords[0]);
                const y1 = parseInt(startCords[1]);
                const x2 = parseInt(endCords[0]);
                const y2 = parseInt(endCords[1]);
                if (parts[1] === 'on')
                    changeRangeValues(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), 1);
                else if (parts[1] === 'off')
                    changeRangeValues(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), -1);
            }
            else if (parts[0] === 'toggle') {
                const startCords = parts[1].split(',');
                const endCords = parts[3].split(',');
                const x1 = parseInt(startCords[0]);
                const y1 = parseInt(startCords[1]);
                const x2 = parseInt(endCords[0]);
                const y2 = parseInt(endCords[1]);
                changeRangeValues(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), 2);
            }
        });
        setLights2(lights2);

        if (part1) {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                if (!ctx)
                    return;
                const data = ctx.createImageData(1000, 1000);
                const buf = new Uint32Array(data.data.buffer);
                lights.forEach((line, x) => line.forEach((l, y) => buf[(x * 1000) + y] = l ? 0xFF00FFFB : 0xFF000000));
                ctx.putImageData(data, 0, 0);
            }
        }
        else {
            const max = lights2.reduce((lineMax, line) => Math.max(lineMax, line.reduce((lMax, l) => Math.max(lMax, l), 0)), 0);
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                if (!ctx)
                    return;
                const data = ctx.createImageData(1000, 1000);
                const buf = new Uint32Array(data.data.buffer);
                lights2.forEach((line, x) => line.forEach((l, y) => buf[(x * 1000) + y] = (Math.floor((l / max) * 256) << 24) + 0x00FFFB));
                ctx.putImageData(data, 0, 0);
            }
        }
    }, [input, part1, step]);

    return (
        <DayBase day={6} setInput={setInput}>
            <ContentWrapper>
                <TopRow>
                    <InputsWrapper>
                        <ToggleSwitch label='Part 1' checked={part1} onClick={() => setPart1(!part1)} />
                    </InputsWrapper>
                    <AnswersCard
                        part1={lights1.reduce((sum, line) => sum + line.reduce((lineSum, l) => lineSum + (l ? 1 : 0), 0), 0)}
                        part2={lights2.reduce((sum, line) => sum + line.reduce((lineSum, l) => lineSum + l, 0), 0)}
                    />
                </TopRow>
                <LightsDisplayWrapper ref={canvasRef} width={1000} height={1000} />
                <input type='range' min='0' max={input.split('\n').length} value={step} onChange={e => setStep(parseInt(e.target.value))} />
            </ContentWrapper>
        </DayBase >
    );
};