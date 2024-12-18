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

type Slot = {
  kind: 'space' | 'data';
  size: number;
  dataId: number;
};

function slotsToString2(slots: Slot[]): string {
  return slots
    .map(slot => {
      return slot.kind === 'space'
        ? '.'.repeat(slot.size)
        : `${slot.dataId}`.repeat(slot.size);
    })
    .join('');
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 9 part two with ${lines.length} lines and expected ${expected}`,
  );

  const disk = lines[0];
  let slots: Slot[] = [];
  let idx = 0;
  for (let i = 0; i < disk.length; i++) {
    const val = parseInt(disk[i]);
    if (i % 2 === 0) {
      // it's data
      const dataId = i / 2;
      slots.push({ kind: 'data', size: val, dataId: dataId });
    } else {
      // it's space
      slots.push({ kind: 'space', size: val, dataId: -1 });
    }
    idx += val;
  }
  logger.debug(
    {
      slots: slotsToString2(slots),
    },
    'Slots pre-compaction',
  );

  let dataSlot = slots.findLastIndex(slot => slot.kind === 'data');
  while (dataSlot > 0) {
    let data = slots[dataSlot];

    // find the next space with enough room for this data
    let spaceSlot = slots.findIndex(slot => slot.kind === 'space');
    let space = slots[spaceSlot];
    for (; spaceSlot < slots.length; spaceSlot++) {
      if (slots[spaceSlot].kind !== 'space') {
        continue;
      }

      space = slots[spaceSlot];
      if (data.size <= space.size) {
        break;
      }
    }

    if (spaceSlot === slots.length) {
      // no space for this data, move along to the next data slot
      for (dataSlot--; dataSlot > 0; dataSlot--) {
        if (slots[dataSlot].kind === 'data') {
          break;
        }
      }
      // assume we found the next data and restart our loop
      continue;
    }

    // We didn't find a good space or data slot, move along
    if (spaceSlot > dataSlot) {
      for (dataSlot--; dataSlot > 0; dataSlot--) {
        if (slots[dataSlot].kind === 'data') {
          break;
        }
      }
      continue;
    }

    // if we're here, we have a space for the data
    // move the data to the space
    logger.debug({ data, dataSlot, space, spaceSlot }, 'Moving data to space');
    slots[dataSlot] = { kind: 'space', size: data.size, dataId: -1 };
    slots[spaceSlot] = { kind: 'data', size: data.size, dataId: data.dataId };
    const remainingSpace = space.size - data.size;
    if (remainingSpace > 0) {
      slots = slots
        .slice(0, spaceSlot + 1)
        .concat([{ kind: 'space', size: remainingSpace, dataId: -1 }])
        .concat(slots.slice(spaceSlot + 1));
    }

    // if we're here, we've moved the data to the space
    // move to the next data slot
    for (; dataSlot > 0; dataSlot--) {
      if (slots[dataSlot].kind === 'data') {
        break;
      }
    }
    logger.debug({ slots: slotsToString2(slots), dataSlot }, 'Slots post-move');
  }
  logger.debug(
    {
      slots: slotsToString2(slots),
    },
    'Slots post-compaction',
  );

  let checksum = 0;
  let pos = 0;
  for (let slot of slots) {
    if (slot.kind === 'space') {
      pos += slot.size;
      continue;
    }

    for (let i = 0; i < slot.size; i++) {
      checksum += pos * slot.dataId;
      pos++;
    }
  }

  logger.info({ value: checksum, expected: expected }, 'Day 9 part two');
  return checksum;
}
