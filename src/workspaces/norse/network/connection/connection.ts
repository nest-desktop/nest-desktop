// connection.ts

import { BaseConnection, type IConnectionState } from "@/network";

import { NorseConnections } from "./connections";

export interface INorseConnectionState extends IConnectionState {
  bias?: boolean;
}

export class NorseConnection extends BaseConnection {
  private _bias: boolean;

  constructor(connections: NorseConnections, connectionState: INorseConnectionState) {
    super(connections, connectionState);

    this._bias = connectionState.bias || false;
  }

  get bias(): boolean {
    return this._bias;
  }

  set bias(value: boolean) {
    this._bias = value;
    // this.changes();
  }
}
