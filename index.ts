import { logger } from './src/logger';
import { program } from 'commander';
import { newDay } from './src/newDay';

logger.info("Running Kyle's super cool Advent of Code 2024");

program
  .command('run')
  .option('-d, --day <DAY>', 'Day number to run')
  .option('-p, --part <PART>', "Part number to run: 'one' or 'two'")
  .option(
    '-i, --input <INPUT>',
    'Puzzle input file specifier: e.g. sample or blank',
    '',
  )
  .action(options => {
    logger.info('Running day %s', options.day);
    let partFunc: (filePath: string) => number;
    if (options.part === 'one') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      partFunc = require(`./src/day${options.day}`).partOne;
    } else if (options.part === 'two') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      partFunc = require(`./src/day${options.day}`).partTwo;
    } else {
      logger.error(`Invalid part number: ${options.part}`);
      return;
    }

    partFunc(
      `./inputs/day${options.day}${
        options.input ? '.' + options.input : ''
      }.txt`,
    );
  });

program
  .command('new')
  .option('-d, --day <DAY>', 'Day number to create')
  .action(options => {
    newDay(options.day);
  });

program.parse();
