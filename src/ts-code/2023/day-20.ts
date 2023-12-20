/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-let */
import { input } from './day-20-input';

type BroadcasterModule = {
    readonly name: string,
    readonly type: string,
    readonly dest: readonly string[]
}

type FlipFlopModule = {
    readonly name: string,
    readonly type: string,
    readonly dest: readonly string[]
    isHigh: boolean
}

type ConjunctionModule = {
    readonly name: string,
    readonly type: string,
    readonly dest: readonly string[]
    isHigh: { [input: string]: boolean }
}

type Modules = {
    readonly [key: string]: BroadcasterModule | FlipFlopModule | ConjunctionModule
}

const getModules = () => {
    const modules = input.split('\n').reduce((modules, line) => {
        const parts = line.split(' -> ');
        const moduleType = parts[0].substring(0, 1);
        const module = parts[0].substring(moduleType === 'b' ? 0 : 1);
        const dest = parts[1].split(',').map(d => d.trim());
        const moduleBase = {
            name: module,
            type: moduleType,
            dest,
        };
        if (moduleType === 'b') {
            return {
                ...modules,
                [module]: moduleBase
            };
        }
        else if (moduleType === '%') {
            return {
                ...modules,
                [module]: {
                    ...moduleBase,
                    isHigh: false
                }
            };
        }
        else if (moduleType === '&') {
            return {
                ...modules,
                [module]: {
                    ...moduleBase,
                    isHigh: {}
                }
            };
        }
        return {
            ...modules,
            [module]: moduleBase
        };
    }, {} as Modules);

    Object.keys(modules).forEach(module => {
        if (modules[module].type === '&') {
            const inputs = Object.keys(modules).filter(k => modules[k].dest.includes(module));
            (modules[module] as ConjunctionModule).isHigh = inputs.reduce((out, input) => ({ ...out, [input]: false }), {});
        }
    });

    return modules;
};

let rxGetLow = false;
const sendPulseTo = (modules: Modules, moduleName: string, from: string, high: boolean): number[] => {
    if (moduleName === 'rx' && !high)
        rxGetLow = true;
    const module = modules[moduleName];

    if (!module)
        return [0, 0];

    if (module.type === 'b') {
        return module.dest.reduce((sum, dest) => {
            const pulsesSent = sendPulseTo(modules, dest, moduleName, high);
            return [sum[0] + pulsesSent[0], sum[1] + pulsesSent[1]];
        }, [!high ? module.dest.length : 0, high ? module.dest.length : 0]);
    }
    else if (module.type === '%') {
        if (!high) {
            const ffm = (module as FlipFlopModule);
            ffm.isHigh = !ffm.isHigh;
            return module.dest.reduce((sum, dest) => {
                const pulsesSent = sendPulseTo(modules, dest, moduleName, ffm.isHigh);
                return [sum[0] + pulsesSent[0], sum[1] + pulsesSent[1]];
            }, [!ffm.isHigh ? module.dest.length : 0, ffm.isHigh ? module.dest.length : 0]);
        }
    }
    else if (module.type === '&') {
        const cm = (module as ConjunctionModule);
        cm.isHigh[from] = high;
        const sendHigh = Object.keys(cm.isHigh).filter(k => !cm.isHigh[k]).length !== 0;
        return module.dest.reduce((sum, dest) => {
            const pulsesSent = sendPulseTo(modules, dest, moduleName, sendHigh);
            return [sum[0] + pulsesSent[0], sum[1] + pulsesSent[1]];
        }, [!sendHigh ? module.dest.length : 0, sendHigh ? module.dest.length : 0]);
    }
    return [0, 0];
};

const part1Modules = getModules();
const part1 = Array.from({ length: 1000 }).map(_ => 0).reduce((pulses) => {
    const sent = sendPulseTo(part1Modules, 'broadcaster', 'button', false);
    return [pulses[0] + sent[0] + 1, pulses[1] + sent[1]];
}, [0, 0]);

console.log(`Part 1: ${part1[0] * part1[1]}`);

let presses = 0;
rxGetLow = false;
const part2Modules = getModules();
while (!rxGetLow) {
    sendPulseTo(part2Modules, 'broadcaster', 'button', false);
    presses++;
    if (presses % 1000000 === 0)
        console.log(presses);
}

console.log(`Part 2: ${presses}`);