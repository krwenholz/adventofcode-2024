import * as fs from 'fs';
import { logger } from './logger';
import { directionFromSymbol } from './util/cardinal_directions';
import { getPosition } from './util/util';
import { debug } from 'console';

function findBotPosition(grid: string[][]): [number, number] {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === '@') {
        return [row, col];
      }
    }
  }
  return [0, 0];
}

function sumGpsScores(grid: string[][]): number {
  let sum = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 'O') {
        sum += 100 * row + col;
      }
    }
  }
  return sum;
}

function traceGrid(grid: string[][]): void {
  if (process.env.LOG_LEVEL !== 'trace') {
    return;
  }
  console.log('Grid:');
  console.log(grid.map(row => row.join('')).join('\n'));
}

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[0];
  lines = lines.slice(2);
  logger.info(
    `Running day 15 part one with ${lines.length} lines and expected ${expected}`,
  );

  const blankLineIdx = lines.indexOf('');
  const grid: string[][] = lines
    .slice(0, blankLineIdx)
    .map(line => line.split(''));
  const moves = lines
    .slice(blankLineIdx + 1)
    .flatMap(line => line.split(''))
    .map(move => directionFromSymbol(move));

  let botPosition = findBotPosition(grid);

  for (const move of moves) {
    traceGrid(grid);
    logger.debug({ botPosition, move }, 'Moving bot');
    const [nextRow, nextCol] = [
      botPosition[0] + move[0],
      botPosition[1] + move[1],
    ];
    const nextPosition = getPosition(nextRow, nextCol, grid);
    if (nextPosition === '#') {
      // It's a wall!
      continue;
    }
    if (nextPosition === '.') {
      // It's just an open space!
      grid[botPosition[0]][botPosition[1]] = '.';
      grid[nextRow][nextCol] = '@';
      botPosition = [nextRow, nextCol];
      continue;
    }

    if (nextPosition === 'O') {
      // It's a box, try to move it over, or get stuck against a wall
      let movingPositions = [botPosition, [nextRow, nextCol]];
      while (movingPositions.length > 0) {
        const [lastRow, lastCol] = movingPositions[movingPositions.length - 1];
        const [nextNextRow, nextNextCol] = [
          lastRow + move[0],
          lastCol + move[1],
        ];
        const nextNextPosition = getPosition(nextNextRow, nextNextCol, grid);
        switch (nextNextPosition) {
          case '#':
            // A wall! Can't move.
            movingPositions = [];
            break;
          case '.':
            // An open space! Move the box(es).
            while (movingPositions.length > 0) {
              const [movingRow, movingCol] = movingPositions.pop()!;
              const movingPosition = getPosition(movingRow, movingCol, grid);
              grid[movingRow + move[0]][movingCol + move[1]] = movingPosition;
              grid[movingRow][movingCol] = '.';
            }
            botPosition = [nextRow, nextCol];
            break;
          case 'O':
            // Another box! Keep moving.
            movingPositions.push([nextNextRow, nextNextCol]);
        }
      }
    }
  }

  const gpsSum = sumGpsScores(grid);
  traceGrid(grid);

  logger.info({ gpsSum, expected: expected }, 'Day 15 part one');
  return gpsSum;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 15 part two with ${lines.length} lines and expected ${expected}`,
  );

  // TODO: Implement part two logic

  logger.info({ value: '', expected: expected }, 'Day 15 part two');
  return NaN;
}
