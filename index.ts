import { logger } from "./src/logger";
import { program } from "commander";
import { newDay } from "./src/newDay";

logger.info("Running Kyle's super cool Advent of Code 2024");

program
  .command("run")
  .option("-d, --day <DAY>", "Day number to run")
  .option("-p, --part <PART>", "Part number to run: 'one' or 'two'")
  .option("-i, --input <INPUT>", "Puzzle input file")
  .action((options) => {
    logger.info("Running day %s", options.day);
    let partFunc: Function;
    if (options.part === "one") {
      partFunc = require(`./src/day${options.day}`).partOne;
    } else if (options.part === "two") {
      partFunc = require(`./src/day${options.day}`).partTwo;
    } else {
      logger.error(`Invalid part number: ${options.part}`);
      return;
    }

    partFunc(options.input);
  });
program
  .command("new")
  .option("-d, --day <DAY>", "Day number to create")
  .action((options) => {
    newDay(options.day);
  });

program.parse();
