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
  const memo = new Map<string, number>();
  for (const s of stones) {
    const expansion = expandStone(s, runCount, memo);
    logger.debug({ s, expansion }, 'Expansion');
    expandedCount += expansion;
  }

  logger.info({ expandedCount, expected: expected }, 'Day 11 part one');
  return expandedCount;
}

function expandStone(
  s: string,
  runCount: number,
  memo: Map<string, number>,
): number {
  const key = `${s}-${runCount}`;
  if (runCount === 0) {
    memo.set(key, 1);
  }
  if (memo.has(key)) {
    return memo.get(key) || 0;
  }

  let acc = 0;
  [s]
    .flatMap(stone => {
      if (stone === '0') {
        return ['1'];
      }
      if (stone.length % 2 === 0) {
        const midpoint = stone.length / 2;
        let secondHalf = stone.slice(midpoint);
        for (let j = 0; j < secondHalf.length; j++) {
          const char = secondHalf[j];
          if (char !== '0' || j === secondHalf.length - 1) {
            secondHalf = secondHalf.slice(j);
            break;
          }
        }
        return [stone.slice(0, midpoint), secondHalf];
      }
      return [`${parseInt(stone) * 2024}`];
    })
    .forEach(stone => {
      acc += expandStone(stone, runCount - 1, memo);
    });

  memo.set(key, acc);
  return acc;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 11 part two with ${lines.length} lines and expected ${expected}`,
  );

  const stones = lines[0].split(' ');
  let expandedCount = 0;
  const memo = new Map<string, number>();
  for (const s of stones) {
    const expansion = expandStone(s, 75, memo);
    logger.debug({ s, expansion }, 'Expansion');
    expandedCount += expansion;
  }

  logger.info({ expandedCount, expected: expected }, 'Day 11 part two');
  return expandedCount;
}
