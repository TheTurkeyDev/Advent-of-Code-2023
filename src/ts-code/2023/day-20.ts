/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-let */
import { input } from './inputs/day-20';

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

let presses = 0;
const moduleFeeder: { [key: string]: number } = {
    dh: 0,
    sg: 0,
    lm: 0,
    db: 0,
};
const sendPulseTo = (modules: Modules, mn: string, from: string, h: boolean): number[] => {

    let pulses = [0, 0];
    const modulesToRun: { moduleName: string, from: string, high: boolean }[] = [{
        moduleName: mn,
        from,
        high: h
    }];
    while (modulesToRun.length > 0) {
        const toRun = modulesToRun.shift();
        if (!toRun)
            continue;

        if (Object.keys(moduleFeeder).includes(toRun.from) && moduleFeeder[toRun.from] === 0 && toRun.high)
            moduleFeeder[toRun.from] = presses + 1;

        const module = modules[toRun.moduleName];

        if (!module)
            continue;

        if (module.type === 'b') {
            modulesToRun.push(...module.dest.map(dest => ({
                moduleName: dest,
                from: toRun.moduleName,
                high: toRun.high
            })));
            pulses[0] += !toRun.high ? module.dest.length : 0;
            pulses[1] += toRun.high ? module.dest.length : 0;
        }
        else if (module.type === '%') {
            if (!toRun.high) {
                const ffm = (module as FlipFlopModule);
                ffm.isHigh = !ffm.isHigh;
                modulesToRun.push(...module.dest.map(dest => ({
                    moduleName: dest,
                    from: toRun.moduleName,
                    high: ffm.isHigh
                })));
                pulses[0] += !ffm.isHigh ? module.dest.length : 0;
                pulses[1] += ffm.isHigh ? module.dest.length : 0;
            }
        }
        else if (module.type === '&') {
            const cm = (module as ConjunctionModule);
            cm.isHigh[toRun.from] = toRun.high;
            const sendHigh = Object.keys(cm.isHigh).filter(k => !cm.isHigh[k]).length !== 0;
            modulesToRun.push(...module.dest.map(dest => ({
                moduleName: dest,
                from: toRun.moduleName,
                high: sendHigh
            })));
            pulses[0] += !sendHigh ? module.dest.length : 0;
            pulses[1] += sendHigh ? module.dest.length : 0;
        }
    }
    return pulses;
};

const part1Modules = getModules();
const part1 = Array.from({ length: 1000 }).map(_ => 0).reduce((pulses) => {
    const sent = sendPulseTo(part1Modules, 'broadcaster', 'button', false);
    return [pulses[0] + sent[0] + 1, pulses[1] + sent[1]];
}, [0, 0]);

console.log(`Part 1: ${part1[0] * part1[1]}`);

const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
const lcm = (arr: number[]) => arr.reduce((x, y) => (x * y) / gcd(x, y));

const part2Modules = getModules();

while (Object.keys(moduleFeeder).filter(k => moduleFeeder[k] === 0).length !== 0) {
    sendPulseTo(part2Modules, 'broadcaster', 'button', false);
    presses++;
}

console.log(`Part 2: ${lcm(Object.keys(moduleFeeder).map(k => moduleFeeder[k]))}`);