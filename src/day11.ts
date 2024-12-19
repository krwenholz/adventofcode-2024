import * as fs from 'fs';
import { logger } from './logger';

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[0];
  lines = lines.slice(2);
  const runCount = process.env.RUN_COUNT ? parseInt(process.env.RUN_COUNT) : 25;
  logger.info(
    `Running day 11 part one with ${lines.length} lines, expected ${expected}, and run count ${runCount}`,
  );

  const stones = lines[0].split(' ');
  let expandedCount = 0;
  for (const s of stones) {
    let expanded = [s];
    for (let i = 0; i < runCount; i++) {
      /**
       * - If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
       * - If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
       * - If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
       */
      expanded = expanded.flatMap(s => {
        if (s === '0') {
          return ['1'];
        }
        if (s.length % 2 === 0) {
          const midpoint = s.length / 2;
          let secondHalf = s.slice(midpoint);
          for (let j = 0; j < secondHalf.length; j++) {
            const char = secondHalf[j];
            if (char !== '0' || j === secondHalf.length - 1) {
              secondHalf = secondHalf.slice(j);
              break;
            }
          }
          return [s.slice(0, midpoint), secondHalf];
        }
        return [`${parseInt(s) * 2024}`];
      });
    }
    logger.debug({ s, expanded }, `finished expansion`);
    expandedCount += expanded.length;
  }

  logger.info({ expandedCount, expected: expected }, 'Day 11 part one');
  return expandedCount;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 11 part two with ${lines.length} lines and expected ${expected}`,
  );

  // TODO: Implement part two logic

  logger.info({ value: '', expected: expected }, 'Day 11 part two');
  return NaN;
}
