import * as fs from "fs";
import { logger } from "./logger";
import { getPosition } from "./util";

const Directions = [
  [-1, 0], // up, starting position
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
];

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[0];
  const grid = lines.slice(2);

  let row = 0;
  let col = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "^") {
        row = i;
        col = j;
        break;
      }
    }
    if (col !== 0) {
      break;
    }
  }

  const positions = new Set<string>([`${row},${col}`]);
  let dir = Directions[0];
  let symbol = getPosition(row, col, grid);
  while (symbol) {
    const nextRow = row + dir[0];
    const nextCol = col + dir[1];
    symbol = getPosition(nextRow, nextCol, grid);
    if (symbol === "#") {
      dir = Directions[(Directions.indexOf(dir) + 1) % 4];
    } else {
      row = nextRow;
      col = nextCol;
    }

    if (symbol === ".") {
      positions.add(`${row},${col}`);
    }
  }

  let total = 0;
  positions.forEach((value) => {
    total++;
  });

  logger.info({ value: total, expected: expected }, "Day 6 part one");
  return total;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, "utf-8");
  let lines = fileContents.split("\n");
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(`Running day 6 part two with ${lines.length} lines and expected ${expected}`);

  // TODO: Implement part two logic

  logger.info({ value: "", expected: expected }, "Day 6 part two");
  return NaN;
}