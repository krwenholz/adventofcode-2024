import * as fs from 'fs';
import { logger } from './logger';

function canEval(val: number, nums: number[], acc: number): boolean {
  if (nums.length === 0) {
    return val === acc;
  }

  if (val < acc) {
    return false;
  }

  return (
    canEval(val, nums.slice(1), acc + nums[0]) ||
    canEval(val, nums.slice(1), acc * nums[0])
  );
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
    if (canEval(val, nums.slice(1), nums[0])) {
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
