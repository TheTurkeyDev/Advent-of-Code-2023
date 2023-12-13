import { Fragment, useEffect, useState } from 'react';
import { DayBase } from '../day-base';
import styled from 'styled-components';
import { Headline5, Label } from 'gobble-lib-react';

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

const GridsWrapper = styled.div`
    padding: 0px 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
`;

const Grid = styled.div`
    display: grid;
`;

const GridChar = styled.span`
    line-height: 0.75;
`;

type Reflection = {
    readonly type: 'row' | 'col'
    readonly about: number
}

export const Day13 = () => {
    const [input, setInput] = useState('');
    const [display, setDisplay] = useState(0);
    const [grids, setGrids] = useState<readonly (readonly (readonly string[])[])[]>([]);
    const [reflections, setReflections] = useState<readonly Reflection[]>([]);

    const doesReflectColumn = (grid: readonly (readonly string[])[], left: number, right: number) => {
        if (right >= grid[0].length)
            return -1;
        return Array.from({ length: Math.min(left + 1, grid[0].length - right) }).map(c => 0).reduce((wrong, _, i) => (
            wrong + grid.filter(line => line[left - i] !== line[right + i]).length
        ), 0);
    };

    const doesReflectRow = (grid: readonly (readonly string[])[], above: number, below: number) => {
        if (below >= grid.length)
            return -1;
        return Array.from({ length: Math.min(above + 1, grid.length - below) }).map(_ => 0).reduce((wrong, _, i) => (
            wrong + grid[above - i].filter((c, i2) => c !== grid[below + i][i2]).length
        ), 0);
    };

    useEffect(() => {
        if (!input)
            return;

        setGrids(input.split('\n\n').map(grid => grid.split('\n').map(l => l.split(''))));
    }, [input]);

    useEffect(() => {
        const expectedErrors = display === 0 ? 0 : 1;
        setReflections(grids.map(grid => {
            const rowReflect = grid.findIndex((_, row) => doesReflectRow(grid, row, row + 1) === expectedErrors);

            if (rowReflect !== -1)
                return { type: 'row', about: rowReflect };

            const colReflect = grid[0].findIndex((_, col) => doesReflectColumn(grid, col, col + 1) === expectedErrors) + 1;

            return { type: 'col', about: colReflect };
        }));

    }, [input, display, grids]);

    return (
        <DayBase day={13} setInput={setInput}>
            <ContentWrapper>
                <RadioLine>
                    <Headline5>Show</Headline5>
                    <RadioWrapper>
                        <Label>Part 1</Label>
                        <input type='radio' name='displayOption' onChange={() => setDisplay(0)} checked={display === 0} />
                    </RadioWrapper>
                    <RadioWrapper>
                        <Label>Part 2</Label>
                        <input type='radio' name='displayOption' onChange={() => setDisplay(1)} checked={display === 1} />
                    </RadioWrapper>
                </RadioLine>
                <GridsWrapper>
                    {
                        grids.map((grid, gridNum) => {
                            const gridReflection = reflections[gridNum];
                            if (!gridReflection)
                                return <Fragment key={gridNum} />;
                            return <Grid key={gridNum} style={{ gridTemplateColumns: `repeat(${grid[0].length}, auto)`, gridTemplateRows: `repeat(${grid.length}, 1em)` }}>
                                {
                                    grid.map((row, y) =>
                                        row.map((c, x) => (
                                            <GridChar key={`${x},${y}`} style={{
                                                borderBottom: gridReflection.type === 'row' && gridReflection.about === y ? '1px solid green' : '',
                                                borderLeft: gridReflection.type === 'col' && gridReflection.about === x ? '1px solid green' : '',
                                            }}>{c}</GridChar>
                                        ))
                                    )
                                }
                            </Grid>;
                        })
                    }
                </GridsWrapper>
            </ContentWrapper>
        </DayBase>
    );
};