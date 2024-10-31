// base.ts
// https://tslog.js.org/#/

// Log levels:
// 0 - silly
// 1 - trace
// 2 - debug
// 3 - info [should be by default]
// 4 - warn
// 5 - error
// 6 - fatal

import { sha1 } from "object-hash";
import { ILogObj, ISettingsParam, Logger } from "tslog";
import { v4 as uuidv4 } from "uuid";

import { truncate } from "@/utils/truncate";

import { Config } from "./config";

export class BaseObj {
  private _config?: Config;
  private _hash: string = "";
  private _logger: Logger<ILogObj>;
  private _uuid: string;

  constructor(props?: {
    config?: { name?: string; simulator?: string };
    logger?: { settings?: ISettingsParam<ILogObj> };
  }) {
    this._uuid = uuidv4();
    this._logger = new Logger({
      name: `[${truncate(this._uuid)}] ${this.constructor.name}`,
      minLevel: 3,
      ...props?.logger?.settings,
    });

    if (props?.config) {
      this._config = new Config({
        name: this.constructor.name,
        ...props?.config,
      });
    }
  }

  get config(): Config | undefined {
    return this._config;
  }

  get hash(): string {
    return this._hash;
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get uuid(): string {
    return this._uuid;
  }

  /**
   * Update hash.
   */
  _updateHash(object: Object): void {
    this._logger.trace("update hash");

    this._hash = truncate(sha1(object));
    this.updateLoggerName("#" + this.hash);
  }

  /**
   * Update logger name suffix.
   * @param text string.
   */
  updateLoggerName(text: string): void {
    this._logger.settings.name = `[${truncate(this._uuid)}] ${
      this.constructor.name
    } ${text}`;
  }
}
