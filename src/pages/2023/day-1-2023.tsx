import { useEffect, useState } from 'react';
import { DayBase } from '../day-base';
import { Body1, InputsWrapper, ToggleSwitch } from 'gobble-lib-react';
import styled from 'styled-components';
import { AnswerHighlightBody1 } from '../../styling/text-styles';

const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
`;

const Line = styled.div`
    display: flex;
    flex-direction: row;
`;

type Matches = {
    readonly line: string
    readonly firstMatch: string
    readonly lastMatch: string
}

export const Day1 = () => {
    const [input, setInput] = useState('');
    const [showPart1, setShowPart1] = useState(true);
    const [part1, setPart1] = useState<readonly Matches[]>();
    const [part2, setPart2] = useState<readonly Matches[]>();

    useEffect(() => {
        if (input === '')
            return;
        setPart1(input.split('\n').map(l => {
            const matches = [...l.matchAll(/\d/g)];
            return {
                line: l,
                firstMatch: matches[0][0],
                lastMatch: matches[matches.length - 1][0]
            };
        }));

        const part2Regex = /(\d|one|two|three|four|five|six|seven|eight|nine|zero)/g;
        setPart2(input.split('\n').map(l => {
            // eslint-disable-next-line functional/no-let
            let index = l.length - 1;
            while (!l.substring(index).match(part2Regex)) {
                index--;
            }

            return {
                line: l,
                firstMatch: l.match(part2Regex)![0],
                lastMatch: l.substring(index).match(part2Regex)![0]
            };
        }));
    }, [input]);

    return (
        <DayBase day={1} setInput={setInput}>
            <ContentWrapper>
                <InputsWrapper style={{ justifySelf: 'center' }}>
                    <ToggleSwitch label='Part 1' checked={showPart1} onClick={() => setShowPart1(!showPart1)} />
                </InputsWrapper>
                {
                    (showPart1 ? part1 : part2)?.map(l => {
                        const firstMatchIndex = l.line.indexOf(l.firstMatch);
                        const firstMatchEnd = firstMatchIndex + l.firstMatch.length;
                        const lastMatchIndex = l.line.lastIndexOf(l.lastMatch);
                        const lastMatchEnd = lastMatchIndex + l.lastMatch.length;
                        return (
                            <Line>
                                <Body1>{l.line.substring(0, firstMatchIndex)}</Body1>
                                <AnswerHighlightBody1>{l.line.substring(firstMatchIndex, firstMatchEnd)}</AnswerHighlightBody1>
                                {lastMatchIndex !== firstMatchIndex && <Body1>{l.line.substring(firstMatchEnd, lastMatchIndex)}</Body1>}
                                {lastMatchIndex !== firstMatchIndex && <AnswerHighlightBody1>{l.line.substring(lastMatchIndex, lastMatchEnd)}</AnswerHighlightBody1>}
                                <Body1>{l.line.substring(lastMatchEnd)}</Body1>
                            </Line>
                        );
                    })
                }
            </ContentWrapper>
        </DayBase>
    );
};