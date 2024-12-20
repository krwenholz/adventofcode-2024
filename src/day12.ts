import * as fs from 'fs';
import { logger } from './logger';
import {
  CardinalDirections,
  isOrthogonalDirection,
  orthogonalDirections,
  rotateDirectionNinetyClockwise,
  rotateDirectionNinetyCounterclockwise,
} from './util/cardinal_directions';
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

function perimeterKey(row: number, col: number, direction: number[]): string {
  return `${row},${col}->${direction.join(',')}`;
}

function findPricePartTwo(
  startRow: number,
  startCol: number,
  grid: string[],
  visited: Set<string>,
): [number, number] {
  let toVisit = [{ row: startRow, col: startCol }];
  const knownPerimeters = new Set<string>();

  let area = 0;
  let perimeter = 0;

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

    for (const direction of CardinalDirections) {
      const neighborRow = row + direction[0];
      const neighborCol = col + direction[1];
      const neighborSymbol = getPosition(neighborRow, neighborCol, grid);
      if (neighborSymbol === undefined || neighborSymbol !== symbol) {
        // Found a perimeter! Add it, regardless of if we count it.
        knownPerimeters.add(perimeterKey(row, col, direction));
        // In order to count the perimeter, we need to know it hasn't been reported by a neighbor
        if (
          orthogonalDirections(direction).every(orthogonalDir => {
            return !knownPerimeters.has(
              perimeterKey(
                row + orthogonalDir[0],
                col + orthogonalDir[1],
                direction,
              ),
            );
          })
        ) {
          logger.debug(
            {
              symbol,
              row,
              col,
              direction,
              knownPerimeters: Array.from(knownPerimeters),
            },
            'counting perimeter',
          );
          perimeter++;
        }
        continue;
      }

      toVisit.push({
        row: neighborRow,
        col: neighborCol,
      });
    }
  }

  return [area, perimeter];
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
