// baseObject.ts
// https://tslog.js.org/#/

// import { sha1 } from "object-hash";
import { type ILogObj, type ISettingsParam, Logger } from "tslog";
import { type Ref, ref } from "vue";
import { v4 as uuidv4 } from "uuid";

import { logger as mainLogger, truncate } from "@/utils";

import { Config } from "./config";

export interface IBaseState {
  [k: string]: unknown;
}

export interface IBaseObjProps {
  config?: { name?: string; simulator?: string };
  logger?: { settings?: ISettingsParam<ILogObj> };
}

export abstract class BaseObj<T = unknown | null> {
  private _config?: Config;
  // private _hash: string = "";
  private _logger: Logger<ILogObj>;
  private _props: Ref<T | undefined> = ref();
  private _uuid: string;

  constructor(props?: IBaseObjProps) {
    this._uuid = uuidv4();
    this._logger = mainLogger.getSubLogger({
      name: `[${this.shortUuid}] ${this.constructor.name}`,
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

  // get hash(): string {
  //   return this._hash;
  // }

  // get hashObject(): IBaseState | IBaseState[] {
  //   return this.save();
  // }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get props(): Ref<T | undefined> {
    return this._props;
  }

  get shortUuid(): string {
    return truncate(this.uuid);
  }

  get uuid(): string {
    return this._uuid;
  }

  /**
   * Save to state.
   * @returns state
   */
  save(): IBaseState | IBaseState[] {
    return { uuid: this.uuid };
  }

  // /**
  //  * Update hash.
  //  */
  // updateHash(): void {
  //   this._logger.trace("update hash");

  //   // this._hash = truncate(sha1(this.hashObject));
  //   this.updateLoggerName("#" + this.hash);
  // }

  // /**
  //  * Update logger name suffix.
  //  * @param text string
  //  */
  // updateLoggerName(text: string): void {
  //   this.logger.settings.name = `[${truncate(this.uuid)}] ${this.constructor.name} ${text}`;
  // }
}
