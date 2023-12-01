import { input } from './day-7-input';

type LogicMap = {
    // eslint-disable-next-line functional/prefer-readonly-type
    [wire: string]: () => number
}

const generateLogicMap = (): LogicMap => {
    const logicMap: LogicMap = input.split('\n').reduce((map, curr) => {
        const parts = curr.split(' ');
        const wire = parts[parts.length - 1];
    
        const getValue = (key: string) => {
            if (key.match(/^\d+$/))
                return parseInt(key);
            else
                return logicMap[key]();
        };
    
        return {
            ...map,
            [wire]: () => {
                if (parts[1] === '->') {
                    const val = getValue(parts[0]);
                    logicMap[wire] = () => val;
                    return val;
                }
                else if (parts[2] === '->') {
                    const val = ~getValue(parts[1]);
                    logicMap[wire] = () => val;
                    return val;
                }
                else if (parts[3] === '->') {
                    if (parts[1] === 'AND') {
                        const val = getValue(parts[0]) & getValue(parts[2]);
                        logicMap[wire] = () => val;
                        return val;
                    }
                    else if (parts[1] === 'OR') {
                        const val = getValue(parts[0]) | getValue(parts[2]);
                        logicMap[wire] = () => val;
                        return val;
                    }
                    else if (parts[1] === 'LSHIFT') {
                        const val = logicMap[parts[0]]() << parseInt(parts[2]);
                        logicMap[wire] = () => val;
                        return val;
                    }
                    else if (parts[1] === 'RSHIFT') {
                        const val = logicMap[parts[0]]() >> parseInt(parts[2]);
                        logicMap[wire] = () => val;
                        return val;
                    }
                }
                return 0;
            }
        };
    }, {} as LogicMap);

    return logicMap;
};

const logicMap = generateLogicMap();

console.log(`Part 1: ${logicMap['a']()}`);

const logicMap2 = generateLogicMap();
logicMap2['b'] = () => 3176;

console.log(`Part 2: ${logicMap2['a']()}`);