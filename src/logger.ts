import process from "process";
import pino from "pino";

const logLevel: string = process.env.LOG_LEVEL || "info";

const logger = pino({
  name: "adventofcode-2024",
  level: logLevel,
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
});

export { logger };
