import * as fs from "fs";
import { logger } from "./logger";

export function partOne(filePath: string): void {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[0];
  lines = lines.slice(2);
  logger.info(
    `Running day 2 part one with ${lines.length} lines and expected ${expected}`
  );

  let safeCount = 0;
  lines.forEach((l) => {
    let reports = l.split(" ").map(Number);

    let increasing = reports[0] < reports[1];
    let safe = true;
    for (let i = 0; i < reports.length - 1; i++) {
      let cur = reports[i];
      let next = reports[i + 1];

      if (increasing) {
        let diff = next - cur;
        safe = safe && cur < next && [1, 2, 3].includes(diff);
      } else {
        let diff = cur - next;
        safe = safe && cur > next && [1, 2, 3].includes(diff);
      }
    }

    if (safe) {
      safeCount++;
      logger.debug({ safe: l });
    }
  });

  logger.info({ value: safeCount, expected: expected }, "Day 2 part one");
}

export function partTwo(filePath: string): void {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 2 part two with ${lines.length} lines and expected ${expected}`
  );

  // TODO: Implement part two logic

  logger.info({ value: "", expected: expected }, "Day 2 part two");
}
