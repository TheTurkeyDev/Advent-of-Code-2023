import { Fragment, useEffect, useState } from 'react';
import { DayBase } from '../day-base';
import styled, { ThemeProps } from 'styled-components';
import { BaseTheme, Body1, Headline5, Headline6, InputsWrapper, Label } from 'gobble-lib-react';

const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
    justify-items: center;
`;

const GridsWrapper = styled.div`
    padding: 0px 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
`;

const Box = styled.div`
    display: grid;
    grid-template-rows: auto 1fr;
    border: 1px solid ${({ theme }: ThemeProps<BaseTheme>) => theme.inputs.outlineRaised};
    border-radius: 4px;
    padding: 4px;
`;

const BoxLenses = styled.div`
     display: flex;
     flex-direction: column;
     padding-left: 4px;
`;

type Lens = {
    readonly label: string
    readonly focal: number
}

type Boxes = { readonly [key: number]: readonly Lens[] }

const getHash = (str: string) => str.split('').map(c => c.charCodeAt(0)).reduce((sum, c) => ((sum + c) * 17) % 256, 0);

export const Day15 = () => {
    const [input, setInput] = useState('');
    const [step, setStep] = useState(0);
    const [boxes, setBoxes] = useState<Boxes>({});

    useEffect(() => {
        if (!input)
            return;
        setStep(input.split(',').length);
    }, [input]);

    useEffect(() => {
        if (!input)
            return;
        setBoxes(input.split(',').slice(0, step).reduce((boxes, op) => {
            if (op.includes('=')) {
                const label = op.substring(0, op.indexOf('='));
                const focal = parseInt(op.substring(op.indexOf('=') + 1));
                const boxNum = getHash(label);
                const idx = (boxes[boxNum] ?? []).findIndex(s => s.label.includes(label));
                if (idx === -1) {
                    return {
                        ...boxes,
                        [boxNum]: [
                            ...(boxes[boxNum] ?? []),
                            { label, focal }
                        ]
                    };
                }
                else {
                    return {
                        ...boxes,
                        [boxNum]: boxes[boxNum].map((l, i) => ({
                            label: l.label,
                            focal: i === idx ? focal : l.focal
                        }))
                    };
                }
            } else {
                const label = op.replace('-', '');
                const boxNum = getHash(label);
                return {
                    ...boxes,
                    [boxNum]: (boxes[boxNum] ?? []).filter(l => !l.label.includes(label))
                };
            }
        }, {} as Boxes));
    }, [input, step]);

    return (
        <DayBase day={15} setInput={setInput}>
            <ContentWrapper>
                <InputsWrapper>
                    <Label>Step</Label>
                    <input type='range' min='0' max={input.split(',').length} value={step} onChange={e => setStep(parseInt(e.target.value))} style={{ width: '300px' }} />
                </InputsWrapper>
                <Headline5>Operation: {input.split(',')[step - 1]}</Headline5>
                <GridsWrapper>
                    {
                        Object.keys(boxes).map(boxNum => {
                            const box = boxes[parseInt(boxNum)];
                            if (box.length === 0)
                                return <Fragment key={boxNum} />;
                            return (
                                <Box key={boxNum}>
                                    <Headline6>Box {boxNum}</Headline6>
                                    <BoxLenses>
                                        {box.map(b => <Body1>{b.label} {b.focal}</Body1>)}
                                    </BoxLenses>
                                </Box>
                            );
                        })
                    }
                </GridsWrapper>
            </ContentWrapper>
        </DayBase>
    );
};