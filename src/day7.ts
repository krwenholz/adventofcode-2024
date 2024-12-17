import * as fs from 'fs';
import { logger } from './logger';

function canEval(val: number, nums: number[], ops: string[]): boolean {
  if (ops.length === nums.length - 1) {
    let sum = nums[0];
    for (let i = 0; i < ops.length; i++) {
      switch (ops[i]) {
        case '+':
          sum += nums[i + 1];
          break;
        case '*':
          sum *= nums[i + 1];
          break;
      }
    }
    return sum === val;
  }

  return canEval(val, nums, [...ops, '+']) || canEval(val, nums, [...ops, '*']);
}

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[0];
  lines = lines.slice(2);
  logger.info(
    `Running day 7 part one with ${lines.length} lines and expected ${expected}`,
  );

  let sum = 0;
  for (let l of lines) {
    let [valStr, numsStr] = l.split(': ');
    const val = Number(valStr);
    const nums = numsStr.split(' ').map(Number);
    if (canEval(val, nums, [])) {
      sum += val;
    }
  }

  logger.info({ value: sum, expected: expected }, 'Day 7 part one');
  return sum;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 7 part two with ${lines.length} lines and expected ${expected}`,
  );

  // TODO: Implement part two logic

  logger.info({ value: '', expected: expected }, 'Day 7 part two');
  return NaN;
}
