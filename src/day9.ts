import * as fs from 'fs';
import { logger } from './logger';

function slotsToString(slots: number[]): string {
  return slots
    .map(v => {
      return v === -1 ? '.' : `${v}`;
    })
    .join('');
}

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[0];
  lines = lines.slice(2);
  logger.info(
    `Running day 9 part one with ${lines.length} lines and expected ${expected}`,
  );

  const disk = lines[0];
  const slots: number[] = [];
  for (let i = 0; i < disk.length; i++) {
    const val = parseInt(disk[i]);
    if (i % 2 === 0) {
      // it's data
      const dataId = i / 2;
      for (let j = 0; j < val; j++) {
        slots.push(dataId);
      }
    } else {
      // it's space
      for (let j = 0; j < val; j++) {
        slots.push(-1);
      }
    }
  }
  logger.debug(
    {
      slots: slotsToString(slots),
    },
    'Slots pre-compaction',
  );

  let emptySlot = slots.findIndex(slot => slot === -1);
  for (let i = slots.length - 1; i >= 0; i--) {
    if (emptySlot >= i) {
      break;
    }

    const val = slots[i];
    if (val === -1) {
      // it's space, skip
      continue;
    }

    slots[emptySlot] = val;
    for (; emptySlot < slots.length; emptySlot++) {
      if (slots[emptySlot] === -1) {
        break;
      }
    }
    slots[i] = -1;
  }
  logger.debug(
    {
      slots: slotsToString(slots),
    },
    'Slots post-compaction',
  );

  let checksum = 0;
  for (let pos = 0; pos < slots.length; pos++) {
    const val = slots[pos];
    if (val === -1) {
      break;
    }

    checksum += pos * val;
  }

  logger.info({ checksum, expected: expected }, 'Day 9 part one');
  return checksum;
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 9 part two with ${lines.length} lines and expected ${expected}`,
  );

  // TODO: Implement part two logic

  logger.info({ value: '', expected: expected }, 'Day 9 part two');
  return NaN;
}
