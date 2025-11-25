// code.ts

import { AxiosHeaders, AxiosPromise } from "axios";
import { type UnwrapRef, reactive } from "vue";

import type { IAxiosErrorData, IAxiosResponseData } from "@/stores/defineBackendStore";
import { BaseObj } from "@/helpers/common";

export interface IResponseState {
  data: object | string;
  config: object;
  headers: AxiosHeaders;
  request: XMLHttpRequest;
  status: number;
  statusText: string;
}

export interface IBackendStore {
  exec(script: string): AxiosPromise<IAxiosResponseData>;
}

export class CodeHandler extends BaseObj {
  private _error: UnwrapRef<IAxiosErrorData>;
  private _backend: IBackendStore | undefined;

  constructor() {
    super();

    this._error = reactive<IAxiosErrorData>({
      lineNumber: -1,
      message: "",
    });
  }

  get backend(): IBackendStore | undefined {
    return this._backend;
  }

  set backend(value: IBackendStore) {
    this._backend = value;
  }

  get error(): UnwrapRef<IAxiosErrorData> {
    return this._error;
  }

  /**
   * Reset error state.
   */
  resetErrorState(): void {
    this._error.lineNumber = -1;
    this._error.message = "";
  }
}
