import * as fs from "fs";
import { logger } from "./logger";

export function newDay(dayNumber: number): void {
  const template = `
import * as fs from "fs";
import { logger } from "./logger";

export function partOne(filePath: string): void {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\\n");
  const expected = lines[0];
  lines = lines.slice(2);
  logger.info(\`Running day ${dayNumber} part one with \${lines.length} lines and expected \${expected}\`);

  // TODO: Implement part one logic

  logger.info({ value: "", expected: expected }, "Day ${dayNumber} part one");
}

export function partTwo(filePath: string): void {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\\n");
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(\`Running day ${dayNumber} part two with \${lines.length} lines\ and expected \${expected}\`);

  // TODO: Implement part two logic

  logger.info({ value: "", expected: expected }, "Day ${dayNumber} part two");
}
`;

  const fileName = `./src/day${dayNumber}.ts`;
  fs.writeFileSync(fileName, template.trim());
  logger.info(`Created ${fileName}`);
}
