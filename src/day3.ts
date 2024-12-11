import * as fs from "fs";
import { logger } from "./logger";

export function partOne(filePath: string): void {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[0];
  logger.info(`Running day 3 part one with ${lines.length} lines and expected ${expected}`);
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

  logger.info({ value: acc, expected: expected }, "Day 3 part one");
}

export function partTwo(filePath: string): void {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(`Running day 3 part two with ${lines.length} lines and expected ${expected}`);

  // TODO: Implement part two logic

  logger.info({ value: "", expected: expected }, "Day 3 part two");
}