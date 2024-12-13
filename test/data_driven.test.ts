import { expect, test, describe } from "vitest";
import fs from "fs";

"use strict";
fs.readdirSync("./inputs").forEach((file) => {
    const day = file.match(/day(\d+)/)?.[1];
    const name = file.match(/day\d+\.(\w+)\.txt/)?.[1];
    describe(`data driven day ${day}:${name}`, () => {
        if (!name) {
            test(`skipping ${file}`, () => { });
            return;
        }
        const contents = fs.readFileSync("./inputs/" + file).toString().split("\n");
        const partOneExpected = contents[0];
        const partTwoExpected = contents[1];

        if (partOneExpected != "???") {
            test(`part one`, async () => {
                const module = await import(`../src/day${day}.ts`);
                expect(module.partOne("./inputs/" + file)).toBe(Number(partOneExpected));
            });
        }

        if (partTwoExpected != "???") {
            test(`part two`, async () => {
                const module = await import(`../src/day${day}.ts`);
                expect(module.partTwo("./inputs/" + file)).toBe(Number(partTwoExpected));
            });
        }
    });
});