import * as fs from 'fs';
import { logger } from './logger';

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContents.split('\n');
  const expected = lines[0];
  logger.info(
    `Running day 3 part one with ${lines.length} lines and expected ${expected}`,
  );
  const instructions = lines.slice(2);

  let acc = 0;
  for (let i = 0; i < instructions.length; i++) {
    const instructionLine = instructions[i];
    const matches = instructionLine.matchAll(/mul\((\d+),(\d+)\)/g);
    let match = matches.next();
    while (!match.done) {
      const num1 = parseInt(match.value[1], 10);
      const num2 = parseInt(match.value[2], 10);
      acc += num1 * num2;

      match = matches.next();
    }
  }

  logger.info({ value: acc, expected: expected }, 'Day 3 part one');
  return acc;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 3 part two with ${lines.length} lines and expected ${expected}`,
  );

  let mulEnabled = true;
  let acc = 0;
  for (let i = 0; i < lines.length; i++) {
    const instructionLine = lines[i];
    const matches = instructionLine.matchAll(
      /((?<do>do\(\))|mul\((?<firstNum>\d+),(?<secondNum>\d+)\)|(?<dont>don't\(\)))/g,
    );
    let match = matches.next();
    for (; !match.done; match = matches.next()) {
      logger.debug({ match, mulEnabled }, 'match');

      // do
      if (match.value[2]) {
        mulEnabled = true;
        continue;
      }

      // don't
      if (match.value[5]) {
        mulEnabled = false;
        continue;
      }

      if (mulEnabled) {
        const num1 = match.value[3];
        const num2 = match.value[4];
        acc += parseInt(num1, 10) * parseInt(num2, 10);
      }
    }
  }

  logger.info({ value: acc, expected: expected }, 'Day 3 part two');
  return acc;
}
