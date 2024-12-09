import * as fs from "fs";
import { logger } from "./logger";
import { report } from "process";

export function partOne(filePath: string): number {
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
  return safeCount;
}

const allowedDiffs = new Set([1, 2, 3]);

function reportIsSafe(report: number[]): [boolean, number] {
  let increasing = report[0] < report[1];
  for (let i = 0; i < report.length - 1; i++) {
    let cur = report[i];
    let next = report[i + 1];

    if (increasing) {
      let diff = next - cur;
      if (cur < next && allowedDiffs.has(diff)) {
        continue;
      }
    } else {
      let diff = cur - next;
      if (cur > next && allowedDiffs.has(diff)) {
        continue;
      }
    }

    return [false, i];
  }

  return [true, -1];
}

function reportLineIsSafe(l: string): boolean {
  let levels = l.split(" ").map(Number);

  // Start with an easy filter or two to help debug initial incorrect solution
  let zeroCount = 0;
  let tooLargeCount = 0;
  for (let i = 0; i < levels.length - 1; i++) {
    let diff = Math.abs(levels[i] - levels[i + 1]);
    if (diff === 0) {
      zeroCount++;
    }
    if (diff > 3) {
      tooLargeCount++;
    }

    if (
      zeroCount >= 2 ||
      tooLargeCount >= 2 ||
      (zeroCount > 0 && tooLargeCount > 0)
    ) {
      logger.debug(
        { levels: levels.join(" "), zeroCount, tooLargeCount },
        "Diff count too large, unsafe"
      );
      return false;
    }
  }

  let [safe, firstSkippedLevel] = reportIsSafe(levels);
  if (!safe) {
    let levelsReduced0 = levels
      .slice(0, firstSkippedLevel)
      .concat(levels.slice(firstSkippedLevel + 1, levels.length));
    let levelsReduced1 = levels
      .slice(0, firstSkippedLevel + 1)
      .concat(levels.slice(firstSkippedLevel + 2, levels.length));
    logger.debug(
      {
        levels: levels.join(" "),
        levelsReduced0,
        levelsReduced1,
        firstSkippedLevel,
      },
      "One unsafe"
    );
    let [safe0, secondSkippedLevel0] = reportIsSafe(levelsReduced0);
    let [safe1, secondSkippedLevel1] = reportIsSafe(levelsReduced1);
    if (!(safe0 || safe1)) {
      logger.debug(
        {
          levels: levels.join(" "),
          firstSkippedLevel,
          secondSkippedLevel0,
          secondSkippedLevel1,
        },
        "Second unsafe"
      );
      // I don't love this, but it catches a special case I'm struggling to reason about
      // more abstractly. It catches a direction issue with the first level.
      if (firstSkippedLevel === 1) {
        let [safe2, thirdSkippedLevel] = reportIsSafe(
          levels.slice(1, levels.length)
        );
        if (safe2) {
          logger.debug({ levels: levels.join(" ") }, "Safe with skipped first");
          return true;
        }
      }
      return false;
    }
    return true;
  }

  logger.trace({ l, skippedLevel: firstSkippedLevel }, "Safe");
  return true;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 2 part two with ${lines.length} lines and expected ${expected}`
  );

  let safeCount = 0;
  lines.forEach((l) => {
    if (reportLineIsSafe(l)) {
      safeCount++;
    }
  });

  logger.info({ value: safeCount, expected: expected }, "Day 2 part two");
  return safeCount;
}
