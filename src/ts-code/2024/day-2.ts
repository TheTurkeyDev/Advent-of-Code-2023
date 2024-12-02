import { input } from './day-2-input';

const parsed = input.split('\n').map(l => l.split(' ').map(n => parseInt(n)));

console.log(`Part 1: ${parsed.filter(nums => isSafe(nums)).length}`);
console.log(`Part 2: ${parsed.filter(nums => (
    isSafe(nums)
        ? true
        : nums.some((_, i) => isSafe([...nums.slice(0, i), ...nums.slice(i + 1)]))
)).length}`);


function isSafe(nums: readonly number[]) {
    const firstDiff = nums[0] - nums[1];
    if (firstDiff === 0)
        return false;

    const inc = firstDiff < 0;
    return nums.every((_, i) => {
        if (i === nums.length - 1)
            return true;

        const diff = nums[i] - nums[i + 1];
        const diffAbs = Math.abs(diff);
        return ((diff < 0 && inc) || (diff > 0 && !inc)) && diffAbs >= 1 && diffAbs <= 3;
    });
}