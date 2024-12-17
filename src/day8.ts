import * as fs from 'fs';
import { logger } from './logger';

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[0];
  lines = lines.slice(2);
  logger.info(
    `Running day 8 part one with ${lines.length} lines and expected ${expected}`,
  );

  // TODO: Implement part one logic

  logger.info({ value: '', expected: expected }, 'Day 8 part one');
  return NaN;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 8 part two with ${lines.length} lines and expected ${expected}`,
  );

  // TODO: Implement part two logic

  logger.info({ value: '', expected: expected }, 'Day 8 part two');
  return NaN;
}
