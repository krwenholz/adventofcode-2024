import * as fs from "fs";
import { logger } from "./logger";

export function partOne(filePath: string): void {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[0];
  lines = lines.slice(1);
  logger.info(
    `Running day 1 part one with ${lines.length} lines and expected ${expected}`
  );

  let lList: number[] = [];
  let rList: number[] = [];
  lines.forEach((l) => {
    const nums = l.split("   ");
    lList.push(Number(nums[0]));
    rList.push(Number(nums[1]));
  });

  lList.sort();
  rList.sort();

  let acc = 0;
  for (let i = 0; i < lList.length; i++) {
    acc += Math.abs(lList[i] - rList[i]);
  }

  logger.info({ value: acc, expected: expected }, "Day 1 part one");
}

export function partTwo(filePath: string): void {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[0];
  lines = lines.slice(1);
  logger.info(
    `Running day 1 part two with ${lines.length} lines and expected ${expected}`
  );
  // TODO: Implement part two logic
}
