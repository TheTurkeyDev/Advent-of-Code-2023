import { input } from './day-4-input';
import * as crypto from 'crypto';

const getHashNum = (start: string) => {
    // eslint-disable-next-line functional/no-let
    let num = 0, hash = '';
    while (!hash.startsWith(start)) {
        num++;
        hash = crypto.createHash('md5').update(`${input}${num}`).digest('hex');
    }
    return num;
};

console.log(getHashNum('00000'));
console.log(getHashNum('000000'));