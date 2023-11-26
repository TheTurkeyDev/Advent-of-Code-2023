import { useEffect, useState } from 'react';
import { DayBase } from '../day-base';
import styled from 'styled-components';
import { Body1, Card, CardContent, CardHeader, Headline3 } from 'gobble-lib-react';
import { AnswerHighlightBody1 } from '../../styling/text-styles';

const InstructionsScrollWrapper = styled.div`
    width: 98vw;
    overflow-x: auto;
`;

const Instructions = styled.div`
    display: grid;
`;

const InstructionCol = styled.div`
    display: grid;
    grid-template-columns: auto;
    padding-right: 16px;
    padding-left: 16px;
    border-right: 1px solid white;
    justify-items: center;
`;

const AnswerCardContent = styled(CardContent)`
    display: grid;
    grid-template-columns: 1fr;
`;

type InstructionStep = {
    readonly instructionNum: number
    readonly instruction: string
    readonly currFloor: number
    readonly isFirstBasement: boolean
    readonly basementHit: boolean
}

export const Day1 = () => {
    const [input, setInput] = useState('');

    const [instructions, setInstructions] = useState<readonly InstructionStep[]>([]);
    const [firstBasementIndex, setFirstBasementIndex] = useState(-1);

    useEffect(() => {
        if (input === '')
            return;
        setInstructions(input.split('').reduce((curr, next, i) => {
            const last = curr[i - 1] ?? {
                instructionNum: 0,
                instruction: '',
                currFloor: 0,
                isFirstBasement: false,
                basementHit: false
            };
            const floor = last.currFloor + (next === ')' ? -1 : 1);
            const isFB = floor === -1 && !last.basementHit;
            if (isFB)
                setFirstBasementIndex(i + 1);
            return [...curr, {
                instructionNum: i + 1,
                instruction: next,
                currFloor: floor,
                isFirstBasement: isFB,
                basementHit: last.basementHit || isFB
            }];
        }, [] as readonly InstructionStep[]));
    }, [input]);

    return (
        <DayBase day={1} setInput={setInput}>
            <>
                <InstructionsScrollWrapper>
                    <Instructions style={{ gridTemplateColumns: `repeat(${instructions.length + 1}, auto)` }}>
                        <InstructionCol>
                            <Body1>Index</Body1>
                            <Body1>Instruction</Body1>
                            <Body1>Floor</Body1>
                        </InstructionCol>
                        {instructions.map((inst, i) => (
                            <InstructionCol>
                                {
                                    inst.isFirstBasement || i === instructions.length - 1 ?
                                        <AnswerHighlightBody1>{inst.instructionNum}</AnswerHighlightBody1> :
                                        <Body1>{inst.instructionNum}</Body1>
                                }
                                <Body1>{inst.instruction}</Body1>
                                {
                                    inst.isFirstBasement || i === instructions.length - 1 ?
                                        <AnswerHighlightBody1>{inst.currFloor}</AnswerHighlightBody1> :
                                        <Body1>{inst.currFloor}</Body1>
                                }
                            </InstructionCol>
                        ))}
                    </Instructions>
                </InstructionsScrollWrapper>
                <Card>
                    <CardHeader>
                        <Headline3>Answers</Headline3>
                    </CardHeader>
                    <AnswerCardContent>
                        <Body1>Part 1: <AnswerHighlightBody1>{instructions[instructions.length - 1]?.currFloor ?? 'N/A'}</AnswerHighlightBody1></Body1>
                        <Body1>Part 2: <AnswerHighlightBody1>{instructions[firstBasementIndex]?.instructionNum ?? 'N/A'}</AnswerHighlightBody1></Body1>
                    </AnswerCardContent>
                </Card>
            </>
        </DayBase>
    );
};