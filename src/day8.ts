import * as fs from 'fs';
import { logger } from './logger';

type Station = {
  frequency: string;
  row: number;
  col: number;
};

const validFrequencies = new RegExp('^[A-Za-z0-9]$');

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[0];
  lines = lines.slice(2);
  logger.info(
    `Running day 8 part one with ${lines.length} lines and expected ${expected}`,
  );

  const rows = lines.length;
  const cols = lines[0].length;

  const stations = new Map<string, Station[]>();
  const antinodes = new Set<string>();

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const frequency = lines[row][col];
      if (!validFrequencies.test(frequency)) {
        continue;
      }

      const curStation = { frequency, row, col };
      if (!stations.has(curStation.frequency)) {
        stations.set(curStation.frequency, []);
      }

      for (let earlierStation of stations.get(curStation.frequency)!) {
        // We know the earlier station has lower row and col values, so we can subtract the dx from the
        // earlier station and add to this station
        const rowDx = curStation.row - earlierStation.row;
        const colDx = curStation.col - earlierStation.col;
        const leftRow = earlierStation.row - rowDx;
        const leftCol = earlierStation.col - colDx;
        if (leftRow >= 0 && leftRow < rows && leftCol >= 0 && leftCol < cols) {
          antinodes.add(`${leftRow},${leftCol}`);
        }

        const rightRow = curStation.row + rowDx;
        const rightCol = curStation.col + colDx;
        if (
          rightRow >= 0 &&
          rightRow < rows &&
          rightCol >= 0 &&
          rightCol < cols
        ) {
          antinodes.add(`${rightRow},${rightCol}`);
        }
      }

      stations.get(curStation.frequency)?.push(curStation);
    }
  }

  logger.info(
    { locations: antinodes.size, expected: expected },
    'Day 8 part one',
  );
  return antinodes.size;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 8 part two with ${lines.length} lines and expected ${expected}`,
  );

  // TODO: Implement part two logic

  logger.info({ value: '', expected: expected }, 'Day 8 part two');
  return NaN;
}
