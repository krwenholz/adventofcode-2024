import * as fs from 'fs';
import { logger } from './logger';
import { CardinalDirections } from './util/cardinal_directions';

class GridPosition {
  symbol: number = 0;
  row: number = 0;
  col: number = 0;
  terminations?: Set<string>;

  constructor(symbol: number, row: number, col: number) {
    this.symbol = symbol;
    this.row = row;
    this.col = col;
  }

  toString = (): string => {
    return `${this.symbol} @ ${this.row},${this.col} - ${this.terminations?.size}`;
  };
}

function getPosition(
  row: number,
  col: number,
  grid: GridPosition[][],
): GridPosition | undefined {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
    return undefined;
  }
  return grid[row][col];
}

function getTerminations(
  row: number,
  col: number,
  grid: GridPosition[][],
): Set<string> {
  if (grid[row][col].terminations) {
    return grid[row][col].terminations;
  }

  if (grid[row][col].symbol === 9) {
    grid[row][col].terminations = new Set<string>([`${row},${col}`]);
    return grid[row][col].terminations;
  }

  const terminations = new Set<string>();
  for (const dir of CardinalDirections) {
    const curRow = row + dir[0];
    const curCol = col + dir[1];
    const pos = getPosition(curRow, curCol, grid);
    if (!pos) {
      continue;
    }

    if (pos.symbol === grid[row][col].symbol + 1) {
      for (const termination of getTerminations(curRow, curCol, grid)) {
        terminations.add(termination);
      }
    }
  }

  grid[row][col].terminations = terminations;
  return terminations;
}

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[0];
  lines = lines.slice(2);
  logger.info(
    `Running day 10 part one with ${lines.length} lines and expected ${expected}`,
  );

  const starts: number[][] = [];
  const grid: GridPosition[][] = lines.map((line, row) => {
    return line.split('').map((symbol, col) => {
      if (symbol === '0') {
        starts.push([row, col]);
      }

      return new GridPosition(parseInt(symbol), row, col);
    });
  });

  let scoreSum = 0;
  for (const [row, col] of starts) {
    const pos = grid[row][col];
    scoreSum += getTerminations(row, col, grid).size;
    logger.debug({ pos: pos.toString() }, 'Path score');
  }

  logger.info({ scoreSum, expected: expected }, 'Day 10 part one');
  return scoreSum;
}

function getPaths(
  row: number,
  col: number,
  grid: GridPosition[][],
): Set<string> {
  if (grid[row][col].terminations) {
    return grid[row][col].terminations;
  }

  if (grid[row][col].symbol === 9) {
    grid[row][col].terminations = new Set<string>([`${row},${col}`]);
    return grid[row][col].terminations;
  }

  const terminations = new Set<string>();
  for (const dir of CardinalDirections) {
    const nextRow = row + dir[0];
    const nextCol = col + dir[1];
    const pos = getPosition(nextRow, nextCol, grid);
    if (!pos) {
      continue;
    }

    if (pos.symbol === grid[row][col].symbol + 1) {
      for (const termination of getPaths(nextRow, nextCol, grid)) {
        terminations.add(`${row},${col}` + termination);
      }
    }
  }

  grid[row][col].terminations = terminations;
  return terminations;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 10 part two with ${lines.length} lines and expected ${expected}`,
  );

  const starts: number[][] = [];
  const grid: GridPosition[][] = lines.map((line, row) => {
    return line.split('').map((symbol, col) => {
      if (symbol === '0') {
        starts.push([row, col]);
      }

      return new GridPosition(parseInt(symbol), row, col);
    });
  });

  let ratingSum = 0;
  for (const [row, col] of starts) {
    const pos = grid[row][col];
    ratingSum += getPaths(row, col, grid).size;
    logger.debug({ pos: pos.toString() }, 'Path score');
  }

  logger.info({ ratingSum, expected: expected }, 'Day 10 part two');
  return ratingSum;
}
