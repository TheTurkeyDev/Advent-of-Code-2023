import { BaseTheme, ButtonRow, ContainedButton, Headline2, Headline5, Icon, OutlinedButton, TextArea } from 'gobble-lib-react';
import { useState } from 'react';
import styled, { ThemeProps } from 'styled-components';

const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    justify-items: center;
`;

const InputHeadline = styled(Headline5)`
    position: relative;
`;

const InputWrapper = styled.div`
    z-index: 1;
    position: absolute;
    display: grid;
    gap: 8px;
    padding: 16px;
    background-color: ${({ theme }: ThemeProps<BaseTheme>) => theme.surface.color};
    border-radius: 5px;
`;

type DayBaseProps = {
    readonly day: number
    readonly children: JSX.Element
    readonly setInput: (input: string) => void
};

export const DayBase = ({ day, children, setInput }: DayBaseProps) => {
    const [showInput, setShowInput] = useState(false);
    const [taInput, setTAInput] = useState('');
    return (
        <ContentWrapper>
            <Headline2>Day {day}</Headline2>
            <InputHeadline>
                Input <Icon className='fas fa-chevron-down' onClick={() => setShowInput(old => !old)} />
                {showInput && <InputWrapper>
                    <TextArea value={taInput} onChange={e => setTAInput(e.target.value)} />
                    <ButtonRow>
                        <OutlinedButton onClick={() => setShowInput(false)}>Cancel</OutlinedButton>
                        <ContainedButton onClick={() => { setShowInput(false); setInput(taInput); }}>Save</ContainedButton>
                    </ButtonRow>
                </InputWrapper>}
            </InputHeadline>
            {children}
        </ContentWrapper>
    );
};