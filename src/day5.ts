import * as fs from 'fs';
import { logger } from './logger';

type Rule = {
  before: number;
  after: number;
};

function isValidUpdate(pages: number[], rules: Map<number, Rule[]>): boolean {
  const seenSoFar = new Set<number>();
  for (const page of pages) {
    const pageRules = rules.get(page);
    if (!pageRules) {
      continue;
    }

    for (const rule of pageRules) {
      for (const seen of seenSoFar) {
        if (rule.before === page && rule.after === seen) {
          return false;
        }
      }
      seenSoFar.add(page);
    }
  }

  return true;
}

export function partOne(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[0];
  lines = lines.slice(2);
  logger.info(
    `Running day 5 part one with ${lines.length} lines and expected ${expected}`,
  );

  const splitIdx = lines.findIndex(line => {
    if (!line) {
      return true;
    }
  });

  const rules = new Map<number, Rule[]>();
  lines.slice(0, splitIdx).forEach(line => {
    const [beforeTxt, afterTxt] = line.split('|');
    const before = parseInt(beforeTxt);
    const after = parseInt(afterTxt);

    if (!rules.has(before)) {
      rules.set(before, []);
    }
    rules.get(before)?.push({ before: before, after: after });

    if (!rules.has(after)) {
      rules.set(after, []);
    }
    rules.get(after)?.push({ before: before, after: after });
  });

  const updates = lines.slice(splitIdx + 1).map(line => {
    return line.split(',').map(page => parseInt(page));
  });

  const medians: number[] = [0];
  for (const update of updates) {
    if (isValidUpdate(update, rules)) {
      medians.push(update[Math.floor(update.length / 2)]);
      logger.debug(
        { update: update, median: update[Math.floor(update.length / 2)] },
        'Valid update',
      );
    }
  }

  const answer = medians.reduce((acc, val) => acc + val, 0);

  logger.info({ value: answer, expected: expected }, 'Day 5 part one');
  return answer;
}

function tryFixing(
  update: number[],
  rules: Map<number, Rule[]>,
): [number[], boolean] {
  // the number seen to it's position
  const seenSoFar = new Map<number, number>();
  for (let i = 0; i < update.length; i++) {
    const page = update[i];
    const pageRules = rules.get(page);
    if (!pageRules) {
      continue;
    }

    for (const rule of pageRules) {
      for (const [seen, idx] of seenSoFar.entries()) {
        if (rule.before === page && rule.after === seen) {
          // swap the two
          const temp = update[i];
          update[i] = update[idx];
          update[idx] = temp;
          return [update, true];
        }
      }
      seenSoFar.set(page, i);
    }
  }
  return [update, false];
}

export function partTwo(filePath: string): number {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  let lines = fileContents.split('\n');
  const expected = lines[1];
  lines = lines.slice(2);
  logger.info(
    `Running day 5 part two with ${lines.length} lines and expected ${expected}`,
  );

  const splitIdx = lines.findIndex(line => {
    if (!line) {
      return true;
    }
  });

  const rules = new Map<number, Rule[]>();
  lines.slice(0, splitIdx).forEach(line => {
    const [beforeTxt, afterTxt] = line.split('|');
    const before = parseInt(beforeTxt);
    const after = parseInt(afterTxt);

    if (!rules.has(before)) {
      rules.set(before, []);
    }
    rules.get(before)?.push({ before: before, after: after });

    if (!rules.has(after)) {
      rules.set(after, []);
    }
    rules.get(after)?.push({ before: before, after: after });
  });

  const updates = lines.slice(splitIdx + 1).map(line => {
    return line.split(',').map(page => parseInt(page));
  });

  const medians: number[] = [];
  for (let update of updates) {
    let valid = isValidUpdate(update, rules);
    while (!valid) {
      // Could do a topological sort: https://www.geeksforgeeks.org/topological-sorting/
      // But we'll just try fixing it instead
      let adjusted = false;
      [update, adjusted] = tryFixing(update, rules);
      if (!adjusted) {
        logger.debug({ update: update }, 'Fixed update');
        medians.push(update[Math.floor(update.length / 2)]);
        valid = true;
      }
    }
  }

  const answer = medians.reduce((acc, val) => acc + val, 0);

  logger.info({ value: answer, expected: expected }, 'Day 5 part two');
  return answer;
}
