import { createRef, useEffect, useState } from 'react';
import { DayBase } from '../day-base';
import { Body1, ContainedButton, InputsWrapper, ToggleSwitch, useInterval } from 'gobble-lib-react';
import styled from 'styled-components';

const width = 101;
const midX = 50;
const height = 103;
const midY = 51;

const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
`;

const Canvas = styled.canvas`
    background-color: black;
    height:${width * 4}px;
`;

type Point = {
    readonly x: number
    readonly y: number
}
type Robot = {
    readonly pos: Point
    readonly vel: Point
}

const mul = (p: Point, times: number) => ({ x: p.x * times, y: p.y * times });
const add = (p: Point, p2: Point) => ({ x: p.x + p2.x, y: p.y + p2.y });

const moveRobotXTimes = (robot: Robot, times: number) => {
    const np = add(robot.pos, mul(robot.vel, times));
    const newXtemp = np.x % width;
    const newX = newXtemp < 0 ? newXtemp + width : newXtemp;
    const newYtemp = np.y % height;
    const newY = newYtemp < 0 ? newYtemp + height : newYtemp;
    return { x: newX, y: newY };
};

const getLoopVal = (robots: readonly Robot[]) => {
    // eslint-disable-next-line functional/no-let
    let r = robots[0];
    const start = `${r.pos.x},${r.pos.y}`;
    // eslint-disable-next-line functional/no-let
    let loop = 0;
    do {
        r = { pos: moveRobotXTimes(r, 1), vel: r.vel };
        loop++;
    } while (`${r.pos.x},${r.pos.y}` !== start);

    return loop;
};

export const Day14 = () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const [input, setInput] = useState('');
    const [loop, setLoop] = useState(0);
    const [step, setStep] = useState(0);
    const [run, setRun] = useState(false);
    const [robots, setRobots] = useState<readonly Robot[]>([]);

    useEffect(() => {
        if (input === '')
            return;

        const rbts = input.split('\n').map(line => {
            const parts = line.split(' ');
            const posParts = parts[0].substring(2).split(',');
            const velParts = parts[1].substring(2).split(',');
            const pos = { x: parseInt(posParts[0]), y: parseInt(posParts[1]) };
            const vel = { x: parseInt(velParts[0]), y: parseInt(velParts[1]) };
            return { pos, vel } as Robot;
        });

        setRobots(rbts);
        setLoop(getLoopVal(rbts));
    }, [input]);

    useEffect(() => {
        const points = robots.map(r => moveRobotXTimes(r, step));
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx)
                return;
            const data = ctx.createImageData(width, height);
            const buf = new Uint32Array(data.data.buffer);
            points.forEach(p => buf[(p.x * width) + p.y] = 0xFFFFFFFF);
            ctx.putImageData(data, 0, 0);
        }
    }, [step, robots]);


    useInterval(() => {
        if (step < loop && run)
            setStep(old => old + 1);

        if (step >= loop)
            setRun(false);
    }, 100);

    return (
        <DayBase day={14} setInput={setInput}>
            <ContentWrapper>
                <ContainedButton onClick={() => setRun(old => !old)}>{run ? 'STOP' : 'RUN'}</ContainedButton>
                <Body1>{step}/{loop}</Body1>
                <input type='range' id='volume' name='volume' min={0} max={loop} value={step} onChange={e => setStep(parseInt(e.target.value))} />
                <Canvas ref={canvasRef} width={width} height={height} />
            </ContentWrapper>
        </DayBase>
    );
};