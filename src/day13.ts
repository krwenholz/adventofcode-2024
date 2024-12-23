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

function solve(buttonA: Button, buttonB: Button, { x, y }: Prize): number {
  // Build some equations!
  // Xa*a + Xb*b = x
  // Ya*a + Yb*b = y
  // Line them up!
  // Yb * ((Xa*a) + (Xb*b)) = Yb * (x)
  // -Xb * ((Ya*a) + (Yb*b)) = -Xb * (y)
  // Add the equations!
  // Yb * ((Xa*a) + (Xb*b)) - Xb * ((Ya*a) + (Yb*b)) = Yb * (x) - Xb * (y)
  // Simplify!
  // Yb*Xa*a + Yb*Xb*b - Xb*Ya*a - Xb*Yb*b = Yb*x - Xb*y
  // (Yb*Xa - Xb*Ya)*a = Yb*x - Xb*y
  // a = (Yb*x - Xb*y) / (Yb*Xa - Xb*Ya)
  // Then substitute a back in to get b!
  // b = (x - Xa*a) / Xb
  const a =
    (buttonB.dY * x - buttonB.dX * y) /
    (buttonB.dY * buttonA.dX - buttonB.dX * buttonA.dY);
  const b = (x - buttonA.dX * a) / buttonB.dX;
  logger.debug({ a, b, x, y, buttonA, buttonB }, 'equations');

  if (Math.floor(a) !== a || Math.floor(b) !== b) {
    return 0;
  }

  return a * 3 + b;
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

        totalCost += solve(buttonA, buttonB, { x, y });
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
        const x = parseInt(match[1]) + 10000000000000;
        const y = parseInt(match[2]) + 10000000000000;
        totalCost += solve(buttonA, buttonB, { x, y });
      }
    }
  }

  logger.info({ totalCost, expected: expected }, 'Day 13 part two');
  return totalCost;
}
