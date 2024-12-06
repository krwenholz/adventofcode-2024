import * as fs from "fs";
import { logger } from "./logger";

export function partOne(filePath: string): void {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    let lines = fileContents.split("\n");
    const expected = lines[0];
    lines = lines.slice(1);
    logger.info(`Running day 1 part one with ${lines.length} lines and expected ${expected}`);
    // TODO: Implement part one logic
}

export function partTwo(filePath: string): void {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    let lines = fileContents.split("\n");
    const expected = lines[0];
    lines = lines.slice(1);
    logger.info(`Running day 1 part two with ${lines.length} lines and expected ${expected}`);
    // TODO: Implement part two logic
}