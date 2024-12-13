import * as fs from "fs";
import { logger } from "./logger";

const Directions = [
  [-1, 0], // Up
  [-1, 1], // Up Right
  [0, 1], // Right
  [1, 1], // Down Right
  [1, 0], // Down
  [1, -1], // Down Left
  [0, -1], // Left
  [-1, -1], // Up Left
]

function getPosition(row: number, col: number, grid: string[]): string {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
    return "";
  }
  return grid[row][col];
}

const xmas = ["X", "M", "A", "S"];

function isXmas(row: number, col: number, grid: string[], direction: number[]): boolean {

  for (let letter of xmas) {
    const next = getPosition(row, col, grid);
    if (next !== letter) {
      return false;
    }
    row += direction[0];
    col += direction[1];
  }

  return true;
}

function hasXmas(startRow: number, startCol: number, grid: string[]): number {
  let count = 0;
  for (let direction of Directions) {
    if (isXmas(startRow, startCol, grid, direction)) {
      count++;
    }
  }
  return count;
}

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[0];
  lines = lines.slice(2);
  logger.info(`Running day 4 part one with ${lines.length} lines and expected ${expected}`);

  let xmasCount = 0;
  for (let row = 0; row < lines.length; row++) {
    // for every row look for the start of xmas (x)
    // then for every direction around that x, look for it spelling xmas
    // traverse along that direction until we get all the letters (either forward or backwards) 
    // if we hit a non xmas letter, break and try the next direction
    for (let col = 0; col < lines[row].length; col++) {
      xmasCount += hasXmas(row, col, lines);
    }
  }

  logger.info({ value: xmasCount, expected: expected }, "Day 4 part one");
  return xmasCount;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(`Running day 4 part two with ${lines.length} lines and expected ${expected}`);

  // TODO: Implement part two logic

  logger.info({ value: "", expected: expected }, "Day 4 part two");
  return NaN;
}