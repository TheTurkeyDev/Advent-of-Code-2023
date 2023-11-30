import { Body1, Card, CardContent, CardHeader, ConfirmationModal, Headline4, ToggleSwitch } from 'gobble-lib-react';
import { AnswerHighlightBody1 } from '../styling/text-styles';
import styled from 'styled-components';
import { useState } from 'react';

const CustomCardContent = styled(CardContent)`
    display: grid;
    grid-template-columns: 1fr;
`;

const CustomCardHeader = styled(CardHeader)`
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 16px;
    align-items: center;
`;

type AnswersCardProps = {
    readonly part1: string | number
    readonly part2: string | number
}

export const AnswersCard = ({ part1, part2 }: AnswersCardProps) => {
    const [showAnswers, setShowAnswers] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const revealAnswers = () => {
        const confirmed = localStorage.getItem('aoc-answers-confirm') === 'true';
        if (!confirmed && !showAnswers) {
            setShowConfirmDialog(true);
            return;
        }
        setShowAnswers(!showAnswers);
    };

    const confirmReveal = () => {
        localStorage.setItem('aoc-answers-confirm', 'true');
        setShowConfirmDialog(false);
        setShowAnswers(!showAnswers);
    };

    return (
        <Card>
            <CustomCardHeader>
                <Headline4>
                    Answers
                </Headline4>
                <ToggleSwitch label='' checked={showAnswers} onClick={revealAnswers} />
            </CustomCardHeader>
            {
                showAnswers &&
                <CustomCardContent>
                    <Body1>Part 1: <AnswerHighlightBody1>{part1}</AnswerHighlightBody1></Body1>
                    <Body1>Part 2: <AnswerHighlightBody1>{part2}</AnswerHighlightBody1></Body1>
                </CustomCardContent>
            }
            <ConfirmationModal
                show={showConfirmDialog}
                text='The goal of Advent of Code is to learn how to program. The answers provided here are for helping you debug your own code. Submitting the answers given here without solving the problem yourself does not help you learn!'
                yesText='I Understand'
                onYesClick={confirmReveal}
                noText='No'
                onNoClick={() => setShowConfirmDialog(false)} />
        </Card>
    );
};