import { expect, test, describe } from 'vitest';
import fs from 'fs';

fs.readdirSync('./inputs').forEach(file => {
  const day = file.match(/day(\d+)/)?.[1];
  const name = file.match(/day\d+\.(\w+)\.txt/)?.[1];
  const contents = fs
    .readFileSync('./inputs/' + file)
    .toString()
    .split('\n');
  const partOneExpected = contents[0];
  const partTwoExpected = contents[1];

  if (!name || (partOneExpected === '???' && partTwoExpected === '???')) {
    return;
  }

  describe(`data_driven ${day}.${name}`, () => {
    if (partOneExpected != '???') {
      test(`part one`, async () => {
        const module = await import(`../src/day${day}.ts`);
        expect(module.partOne('./inputs/' + file)).toBe(
          Number(partOneExpected),
        );
      });
    }

    if (partTwoExpected != '???') {
      test(`part two`, async () => {
        const module = await import(`../src/day${day}.ts`);
        expect(module.partTwo('./inputs/' + file)).toBe(
          Number(partTwoExpected),
        );
      });
    }
  });
});
