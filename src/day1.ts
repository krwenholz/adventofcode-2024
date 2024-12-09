import * as fs from "fs";
import { logger } from "./logger";

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[0];
  lines = lines.slice(2);
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
  return acc;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 1 part two with ${lines.length} lines and expected ${expected}`
  );

  let lList: number[] = [];
  let rListCount: Map<number, number> = new Map();
  lines.forEach((l) => {
    const nums = l.split("   ").map(Number);
    lList.push(nums[0]);
    rListCount.set(nums[1], (rListCount.get(nums[1]) ?? 0) + 1);
  });

  lList.sort();

  let acc = 0;
  for (let i = 0; i < lList.length; i++) {
    acc += Math.abs(lList[i] * (rListCount.get(lList[i]) ?? 0));
  }

  logger.info({ value: acc, expected: expected }, "Day 1 part two");
  return acc;
}
