import * as fs from 'fs';
import { logger } from './logger';
import { getPosition, getPositionSplit } from './util';

const Directions = [
  [-1, 0], // up, starting position
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
];

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContents.split('\n');
  const expected = lines[0];
  const grid = lines.slice(2);

  let row = 0;
  let col = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === '^') {
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
    if (isBlock(symbol)) {
      dir = Directions[(Directions.indexOf(dir) + 1) % 4];
    } else {
      row = nextRow;
      col = nextCol;
    }

    if (symbol === '.') {
      positions.add(`${row},${col}`);
    }
  }

  let total = 0;
  positions.forEach(() => {
    total++;
  });

  logger.info({ value: total, expected: expected }, 'Day 6 part one');
  return total;
}

function findStart(grid: string[][]): [number, number] {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === '^') {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

function findBlocks(grid: string[][]): [Set<number>, Set<number>] {
  const rowBlocks = new Set<number>();
  const colBlocks = new Set<number>();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (isBlock(grid[i][j])) {
        rowBlocks.add(i);
        colBlocks.add(j);
      }
    }
  }
  return [rowBlocks, colBlocks];
}

/**
 * @param row
 * @param col
 * @param grid
 * @returns a map of positions and whether the path is cyclic
 */
function tracePath(
  row: number,
  col: number,
  dir: number[],
  grid: string[][],
  positions: Map<string, Set<string>>,
): [Map<string, Set<string>>, boolean] {
  let symbol = getPositionSplit(row, col, grid);
  while (symbol) {
    const nextRow = row + dir[0];
    const nextCol = col + dir[1];
    symbol = getPositionSplit(nextRow, nextCol, grid);
    if (isBlock(symbol)) {
      dir = Directions[(Directions.indexOf(dir) + 1) % 4];
    } else {
      row = nextRow;
      col = nextCol;
    }

    if (symbol === '.') {
      const dirs = positions.get(`${row},${col}`) || new Set<string>();

      if (dirs.has(`${dir}`)) {
        logger.debug(
          {
            dirs: dirs.values().reduce((acc, v) => {
              return acc + ',' + v;
            }, ''),
            dir,
            row,
            col,
          },
          'Cyclic path detected',
        );
        return [positions, true];
      }

      dirs.add(`${dir}`);
      positions.set(`${row},${col}`, dirs);
    }
  }

  return [positions, false];
}

function placeBlock(row: number, col: number, grid: string[][]): string[][] {
  const newGrid = grid.map(line => line.slice());
  if (!getPositionSplit(row, col, newGrid)) {
    return newGrid;
  }
  newGrid[row][col] = 'O';
  return newGrid;
}

function isBlock(s: string): boolean {
  return ['#', 'O'].includes(s);
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContents.split('\n');
  const expected = lines[1];
  const grid = lines.slice(2).map(line => line.split(''));

  const [startRow, startCol] = findStart(grid);
  const [rowBlocks, colBlocks] = findBlocks(grid);
  /**
   * To create cycles, we want to run the path into a block.
   * This means terminating a path early.
   * At every position, we can check if a right turn would run into a block.
   * If so, this is a new path to try.
   * The block is placed directly in front of the current path.
   * Attempt to place the block and check if the new grid creates a cyclic path.
   * What is a cyclic path? A path which crosses itself in the _same_ direction.
   */
  let dir = Directions[0];
  const positions = new Map<string, Set<string>>([
    [`${startRow},${startCol}`, new Set<string>(`${dir}`)],
  ]);
  let symbol = getPositionSplit(startRow, startCol, grid);
  let row = startRow;
  let col = startCol;
  let cycleCreatingBlockCount = 0;
  while (symbol) {
    let nextRow = row + dir[0];
    let nextCol = col + dir[1];
    symbol = getPositionSplit(nextRow, nextCol, grid);

    nextRow = row + dir[0];
    nextCol = col + dir[1];
    if (
      (rowBlocks.has(nextRow) || colBlocks.has(nextCol)) &&
      !positions.has(`${nextRow},${nextCol}`) &&
      getPositionSplit(nextRow, nextCol, grid) === '.'
    ) {
      const newGrid = placeBlock(nextRow, nextCol, grid);
      logger.debug({ row, col, dir }, 'Placing a block to cut off the path');
      const [, isCyclic] = tracePath(
        row,
        col,
        dir,
        newGrid,
        new Map<string, Set<string>>(positions),
      );
      if (isCyclic) {
        logger.debug(
          { nextRow, nextCol, dir },
          'Cyclic path detected with new block',
        );
        console.log(newGrid.map(line => line.join('')).join('\n'));
        logger.debug(
          {
            poss: positions.entries().reduce((acc, [k, v]) => {
              return `${k}:${[...v.values()].join(',')}, ${acc}`;
            }, ''),
          },
          'positions',
        );
        cycleCreatingBlockCount++;
        //TODO: remove
        return cycleCreatingBlockCount;
      }
    }

    if (isBlock(symbol)) {
      dir = Directions[(Directions.indexOf(dir) + 1) % 4];
      continue;
    } else {
      row = nextRow;
      col = nextCol;
    }

    if (symbol === '.') {
      const dirs = positions.get(`${row},${col}`) || new Set<string>();
      dirs.add(`${dir}`);
      positions.set(`${row},${col}`, dirs);
      if (row === 3 && col === 4) {
        logger.debug(
          {
            poss: positions.entries().reduce((acc, [k, v]) => {
              return `${k}:${[...v.values()].join(',')}, ${acc}`;
            }, ''),
          },
          'positions',
        );
      }
    }
  }

  logger.info(
    { cycleCreatingBlockCount, expected: expected },
    'Day 6 part two',
  );
  return cycleCreatingBlockCount;
}
