// base.ts
// https://tslog.js.org/#/

import { type ILogObj, type ISettingsParam, Logger } from "tslog";
import { sha1 } from "object-hash";
import { v4 as uuidv4 } from "uuid";

import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

import { Config } from "./config";

export interface IBaseObjProps {
  config?: { name?: string; simulator?: string };
  logger?: { settings?: ISettingsParam<ILogObj> };
}

export abstract class BaseObj {
  private _config?: Config;
  private _hash: string = "";
  private _logger: Logger<ILogObj>;
  private _uuid: string;

  constructor(props?: IBaseObjProps) {
    this._uuid = uuidv4();
    this._logger = mainLogger.getSubLogger({
      name: `[${truncate(this._uuid)}] ${this.constructor.name}`,
      ...props?.logger?.settings,
    });

    if (props?.config)
      this._config = new Config({
        name: this.constructor.name,
        ...props?.config,
      });
  }

  get config(): Config | undefined {
    return this._config;
  }

  get hash(): string {
    return this._hash;
  }

  get hashObject(): Record<string, unknown> {
    return this.toJSON();
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get uuid(): string {
    return this._uuid;
  }

  get shortUuid(): string {
    return truncate(this._uuid);
  }

  toJSON(): Record<string, unknown> | unknown {
    return {};
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._logger.trace("update hash");

    this._hash = truncate(sha1(this.hashObject));
    this.updateLoggerName("#" + this.hash);
  }

  /**
   * Update logger name suffix.
   * @param text string
   */
  updateLoggerName(text: string): void {
    this._logger.settings.name = `[${truncate(this._uuid)}] ${this.constructor.name} ${text}`;
  }
}
