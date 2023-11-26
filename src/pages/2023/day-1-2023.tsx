import { useEffect, useState } from 'react';
import { DayBase } from '../day-base';
import { Body1 } from 'gobble-lib-react';

export const Day1 = () => {
    const [input, setInput] = useState('');

    useEffect(() => {
        if (input === '')
            return;
    }, [input]);

    return (
        <DayBase day={1} setInput={setInput}>
            <Body1>Coming soon?</Body1>
        </DayBase>
    );
};