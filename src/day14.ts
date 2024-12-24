import * as fs from 'fs';
import { logger } from './logger';
import { Coordinate } from './util/util';

// Velocities make sense on the row and column grid: e.g. 0,0 is the top left corner,
// positive x is right, and positive y is down.
// positions wrap on the grid
// first (non-answer) input line is the grid size in rows and columns
// run for 100 seconds
// final answer is to take count of bots in each quadrant and multiply the counts

const SIMULATION_SECONDS = parseInt(process.env.SIMULATION_SECONDS || '100');

class Bot {
  pos: Coordinate;
  vRow: number;
  vCol: number;
  constructor(def: string) {
    // example: p=0,4 v=3,-3
    const [pos, vel] = def.split(' ');
    const [col, row] = pos.slice(2).split(',').map(Number);
    this.pos = new Coordinate(row, col);
    const [vCol, vRow] = vel.slice(2).split(',').map(Number);
    this.vRow = vRow;
    this.vCol = vCol;
  }
  public wrap(gridRows: number, gridCols: number) {
    if (this.pos.row < 0) {
      this.pos.row += gridRows;
    } else if (this.pos.row >= gridRows) {
      this.pos.row -= gridRows;
    }
    if (this.pos.col < 0) {
      this.pos.col += gridCols;
    } else if (this.pos.col >= gridCols) {
      this.pos.col -= gridCols;
    }
  }
}

let MEMO_HITS = 0;

function simulate(bot: Bot, gridRows: number, gridCols: number) {
  // coords seen mapped to when we saw it, to detect cycles
  const memo = new Map<string, number>();
  for (let i = 0; i < SIMULATION_SECONDS; i++) {
    const posKey = bot.pos.toString();
    if (memo.has(posKey)) {
      // we've seen this before, so we can calculate the cycle length
      const cycleLength = i - memo.get(posKey)!;
      const remaining = SIMULATION_SECONDS - i;
      const remainingCycles = Math.floor(remaining / cycleLength);
      i += remainingCycles * cycleLength;
      MEMO_HITS++;
    }
    memo.set(posKey, i);
    bot.pos.row += bot.vRow;
    bot.pos.col += bot.vCol;
    bot.wrap(gridRows, gridCols);
  }
}

function debugGrid(
  bots: Bot[],
  gridRows: number,
  gridCols: number,
  time: number,
) {
  if (process.env.LOG_LEVEL !== 'debug') {
    return;
  }

  console.log(`Grid at ${time}:`);
  const grid: string[][] = [];
  for (let i = 0; i < gridRows; i++) {
    grid.push('.'.repeat(gridCols).split(''));
  }
  bots.forEach(bot => {
    if (grid[bot.pos.row][bot.pos.col] === '1') {
      grid[bot.pos.row][bot.pos.col] = '2';
    } else {
      grid[bot.pos.row][bot.pos.col] = '1';
    }
  });
  grid.forEach(row => {
    console.log(row.join(''));
  });
}

function printGrid(
  bots: Bot[],
  gridRows: number,
  gridCols: number,
  time: number,
) {
  const out = [`Grid at ${time}:`];
  const grid: string[][] = [];
  for (let i = 0; i < gridRows; i++) {
    grid.push('.'.repeat(gridCols).split(''));
  }
  for (const bot of bots) {
    grid[bot.pos.row][bot.pos.col] = '*';
  }
  grid.forEach(row => {
    out.push(row.join(''));
  });

  fs.appendFileSync('/tmp/day14.txt', out.join('\n') + '\n');
}

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[0];
  lines = lines.slice(2);
  logger.info(
    `Running day 14 part one with ${lines.length} lines and expected ${expected}`,
  );

  const [gridCols, gridRows] = lines[0].split(' ').map(Number);
  const bots: Bot[] = lines.slice(1).map(line => {
    return new Bot(line);
  });
  bots.map(bot => simulate(bot, gridRows, gridCols));

  debugGrid(bots, gridRows, gridCols, SIMULATION_SECONDS);

  let upperLeft = 0;
  let upperRight = 0;
  let lowerLeft = 0;
  let lowerRight = 0;
  const midRow = Math.floor(gridRows / 2);
  const midCol = Math.floor(gridCols / 2);
  bots.forEach(bot => {
    if (bot.pos.row < midRow) {
      if (bot.pos.col < midCol) {
        upperLeft++;
      } else if (bot.pos.col > midCol) {
        upperRight++;
      }
    } else if (bot.pos.row > midRow) {
      if (bot.pos.col < midCol) {
        lowerLeft++;
      } else if (bot.pos.col > midCol) {
        lowerRight++;
      }
    }
  });

  logger.debug({ upperLeft, upperRight, lowerLeft, lowerRight }, 'Counts');
  const safetyScore = upperLeft * upperRight * lowerLeft * lowerRight;
  logger.info({ MEMO_HITS });
  logger.info({ safetyScore, expected: expected }, 'Day 14 part one');
  return safetyScore;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 14 part two with ${lines.length} lines and expected ${expected}`,
  );

  const [gridCols, gridRows] = lines[0].split(' ').map(Number);
  const bots: Bot[] = lines.slice(1).map(line => {
    return new Bot(line);
  });
  for (let i = 0; i < SIMULATION_SECONDS; i++) {
    const occupiedSpaces = new Set<string>();
    bots.forEach(bot => {
      bot.pos.row += bot.vRow;
      bot.pos.col += bot.vCol;
      bot.wrap(gridRows, gridCols);
      occupiedSpaces.add(bot.pos.toString());
    });
    if (occupiedSpaces.size !== bots.length) {
      // not all bots are in unique positions, so this ain't a tree
      continue;
    }
    printGrid(bots, gridRows, gridCols, i + 1);
  }

  logger.info({ value: '', expected: expected }, 'Day 14 part two');
  return NaN;
}
