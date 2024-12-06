import * as fs from "fs";
import { logger } from "./logger";

export function newDay(dayNumber: number): void {
  const template = `
import { logger } from "./logger";

export function partOne(filePath: string): void {
    logger.info("Running day ${dayNumber} part one");
    // TODO: Implement part one logic
}

export function partTwo(filePath: string): void {
    logger.info("Running day ${dayNumber} part two");
    // TODO: Implement part two logic
}
`;

  const fileName = `./src/day${dayNumber}.ts`;
  fs.writeFileSync(fileName, template.trim());
  logger.info(`Created ${fileName}`);
}
