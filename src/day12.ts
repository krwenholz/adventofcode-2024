import * as fs from 'fs';
import { logger } from './logger';
import { CardinalDirections } from './util/cardinal_directions';
import { getPosition } from './util/util';

function findPrice(
  row: number,
  col: number,
  grid: string[],
  visited: Set<string>,
): [number, number] {
  const key = `${row},${col}`;
  if (visited.has(key)) {
    return [0, 0];
  }

  visited.add(key);

  const symbol = grid[row][col];
  let area = 0;
  let perimeter = 0;
  for (const direction of CardinalDirections) {
    const neighborRow = row + direction[0];
    const neighborCol = col + direction[1];
    const neighborSymbol = getPosition(neighborRow, neighborCol, grid);
    if (neighborSymbol === undefined || neighborSymbol !== symbol) {
      perimeter++;
      continue;
    }

    const [nArea, nPerimeter] = findPrice(
      neighborRow,
      neighborCol,
      grid,
      visited,
    );
    area += nArea;
    perimeter += nPerimeter;
  }

  return [area + 1, perimeter];
}

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let grid = fileContents.split('\n');
  const expected = grid[0];
  grid = grid.slice(2);
  logger.info(
    `Running day 12 part one with ${grid.length} lines and expected ${expected}`,
  );

  const visited = new Set<string>();
  let totalPrice = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const key = `${row},${col}`;
      if (visited.has(key)) {
        continue;
      }

      const [area, perimeter] = findPrice(row, col, grid, visited);
      totalPrice += area * perimeter;
    }
  }

  logger.info({ totalPrice, expected: expected }, 'Day 12 part one');
  return totalPrice;
}

function cornerCount(
  row: number,
  col: number,
  symbol: string,
  grid: string[],
): number {
  let cornerCount = 0;
  // Exterior corners
  // north and east
  if (
    getPosition(row - 1, col, grid) !== symbol &&
    getPosition(row, col + 1, grid) !== symbol
  ) {
    cornerCount++;
  }
  // east and south
  if (
    getPosition(row, col + 1, grid) !== symbol &&
    getPosition(row + 1, col, grid) !== symbol
  ) {
    cornerCount++;
  }
  // south and west
  if (
    getPosition(row + 1, col, grid) !== symbol &&
    getPosition(row, col - 1, grid) !== symbol
  ) {
    cornerCount++;
  }
  // west and north
  if (
    getPosition(row, col - 1, grid) !== symbol &&
    getPosition(row - 1, col, grid) !== symbol
  ) {
    cornerCount++;
  }
  // TODO: Interior corners
  // northeast opening
  if (
    getPosition(row - 1, col, grid) === symbol &&
    getPosition(row, col + 1, grid) === symbol &&
    getPosition(row - 1, col + 1, grid) !== symbol
  ) {
    cornerCount++;
  }
  // southeast opening
  if (
    getPosition(row + 1, col, grid) === symbol &&
    getPosition(row, col + 1, grid) === symbol &&
    getPosition(row + 1, col + 1, grid) !== symbol
  ) {
    cornerCount++;
  }
  // southwest opening
  if (
    getPosition(row + 1, col, grid) === symbol &&
    getPosition(row, col - 1, grid) === symbol &&
    getPosition(row + 1, col - 1, grid) !== symbol
  ) {
    cornerCount++;
  }
  // northwest opening
  if (
    getPosition(row - 1, col, grid) === symbol &&
    getPosition(row, col - 1, grid) === symbol &&
    getPosition(row - 1, col - 1, grid) !== symbol
  ) {
    cornerCount++;
  }
  return cornerCount;
}

function findPricePartTwo(
  startRow: number,
  startCol: number,
  grid: string[],
  visited: Set<string>,
): [number, number] {
  let toVisit = [{ row: startRow, col: startCol }];

  let area = 0;
  let corners = 0;

  while (toVisit.length > 0) {
    const [{ row, col }] = toVisit.slice(0, 1);
    toVisit = toVisit.slice(1);
    const symbol = grid[row][col];

    const key = `${row},${col}`;
    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    area++;
    corners += cornerCount(row, col, symbol, grid);

    for (const direction of CardinalDirections) {
      const neighborRow = row + direction[0];
      const neighborCol = col + direction[1];
      const neighborSymbol = getPosition(neighborRow, neighborCol, grid);
      if (neighborSymbol === undefined || neighborSymbol !== symbol) {
        continue;
      }

      toVisit.push({
        row: neighborRow,
        col: neighborCol,
      });
    }
  }

  return [area, corners];
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let grid = fileContents.split('\n');
  const expected = grid[1];
  grid = grid.slice(2);
  logger.info(
    `Running day 12 part two with ${grid.length} lines and expected ${expected}`,
  );

  const visited = new Set<string>();
  let totalPrice = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const key = `${row},${col}`;
      if (visited.has(key)) {
        continue;
      }

      const [area, perimeter] = findPricePartTwo(row, col, grid, visited);
      totalPrice += area * perimeter;
    }
  }

  logger.info({ totalPrice, expected: expected }, 'Day 12 part two');
  return totalPrice;
}
