// logger.ts
// https://tslog.js.org/#/

// Log levels:
// 0 - silly
// 1 - trace
// 2 - debug
// 3 - info [should be by default]
// 4 - warn
// 5 - error
// 6 - fatal

import { ILogObj, Logger } from "tslog";

const logger: Logger<ILogObj> = new Logger({
  minLevel: 3,
});

export { logger };
