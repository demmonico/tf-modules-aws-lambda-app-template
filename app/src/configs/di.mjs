import winston from 'winston';

import { get as getConfig } from './config.mjs';
import locator from './service-locator.mjs';

// utils
locator.register('logger', (_, requestInfo) => winston.createLogger({
  level: process.env.LOG_LEVEL || getConfig('logger.defaults.level', 'info'),
  transports: [
    new winston.transports.Console({}),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format((data) => {
      const {
        level, message, timestamp, event, ctx, caller, ...rest
      } = data;
      const callerInfo = caller !== undefined ? `${caller}: ` : '';
      const msg = `[${level.toUpperCase()}] ${callerInfo}${message}`;
      return {
        level, message: msg, ...rest, event, ctx, timestamp,
      };
    })(),
    winston.format.json({ deterministic: false }),
    winston.format.errors({ stack: true }),
  ),
  defaultMeta: Object.assign(
    requestInfo,
    getConfig('logger.defaults.labels', {}),
  ),
  exitOnError: false,
}));

// TODO ADD your dependencies here

export default locator;
