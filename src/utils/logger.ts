// logger.ts
// https://tslog.js.org/#/

// Log levels:
// 0 - silly
// 1 - trace
// 2 - debug [default in dev mode]
// 3 - info [default in prod mode]
// 4 - warn
// 5 - error
// 6 - fatal

import { ILogObj, Logger } from "tslog";

// @ts-expect-error The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022',
// 'esnext', 'system', 'node16', 'node18', or 'nodenext'.
const PROD = import.meta.env.PROD;

const logger: Logger<ILogObj> = new Logger({
  minLevel: PROD ? 3 : 2,
});

export { logger };
