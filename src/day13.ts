import * as fs from 'fs';
import { logger } from './logger';

type Button = {
  dX: number;
  dY: number;
};

type Prize = {
  x: number;
  y: number;
};

const BUTTON_REGEX = /Button [AB]: X\+(\d+), Y\+(\d+)/;
const PRICE_REGEX = /Prize: X=(\d+), Y=(\d+)/;

function memoKey(buttonA: Button, buttonB: Button, prize: Prize): string {
  return `${buttonA.dX},${buttonA.dY},${buttonB.dX},${buttonB.dY},${prize.x},${prize.y}`;
}

function minCost(a: number, b: number): number {
  if (a < 0) {
    return b + 1;
  }

  if (b < 0) {
    return a + 3;
  }

  return Math.min(a + 3, b + 1);
}

/**
 *
 * @param buttonA
 * @param buttonB
 * @param prize
 * @param memo
 * @returns -1 if the prize is unreachable, otherwise the total cost of presses
 */
function play(
  buttonA: Button,
  buttonB: Button,
  prize: Prize,
  memo: Map<string, number>,
): number {
  const key = memoKey(buttonA, buttonB, prize);
  if (memo.has(key)) {
    return memo.get(key) || -1;
  }

  if (prize.x < 0 || prize.y < 0) {
    return -1;
  }

  if (prize.x === 0 && prize.y === 0) {
    return 0;
  }

  const buttonACost = play(
    buttonA,
    buttonB,
    { x: prize.x - buttonA.dX, y: prize.y - buttonA.dY },
    memo,
  );

  const buttonBCost = play(
    buttonA,
    buttonB,
    { x: prize.x - buttonB.dX, y: prize.y - buttonB.dY },
    memo,
  );

  logger.debug({ buttonACost, buttonBCost, buttonA, buttonB, prize }, 'play');
  if (buttonACost === -1 && buttonBCost === -1) {
    memo.set(key, -1);
    return -1;
  }

  memo.set(key, minCost(buttonACost, buttonBCost));
  return memo.get(key) || -1;
}

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[0];
  lines = lines.slice(2);
  logger.info(
    `Running day 13 part one with ${lines.length} lines and expected ${expected}`,
  );

  let buttonA = null;
  let buttonB = null;
  let totalCost = 0;

  for (const l of lines) {
    if (l.startsWith('Button A')) {
      const match = l.match(BUTTON_REGEX);
      if (match) {
        const dX = parseInt(match[1]);
        const dY = parseInt(match[2]);
        buttonA = { dX, dY };
      }
    } else if (l.startsWith('Button B')) {
      const match = l.match(BUTTON_REGEX);
      if (match) {
        const dX = parseInt(match[1]);
        const dY = parseInt(match[2]);
        buttonB = { dX, dY };
      }
    } else if (l.startsWith('Prize:') && buttonA && buttonB) {
      const match = l.match(PRICE_REGEX);
      if (match) {
        const x = parseInt(match[1]);
        const y = parseInt(match[2]);
        const cost = play(buttonA, buttonB, { x, y }, new Map());
        if (cost === -1) {
          continue;
        }

        totalCost += cost;
      }
    }
  }

  logger.info({ totalCost, expected: expected }, 'Day 13 part one');
  return totalCost;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 13 part two with ${lines.length} lines and expected ${expected}`,
  );

  // TODO: Implement part two logic

  logger.info({ value: '', expected: expected }, 'Day 13 part two');
  return NaN;
}
