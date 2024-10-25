// connection.ts

import {
  BaseConnection,
  IConnectionProps,
} from "@/helpers/connection/connection";

import { NorseConnections } from "./connections";

export interface INorseConnectionProps extends IConnectionProps {
  bias?: boolean;
}

export class NorseConnection extends BaseConnection {
  private _bias: boolean;

  constructor(
    connections: NorseConnections,
    connectionProps: INorseConnectionProps
  ) {
    super(connections, connectionProps);

    this._bias = connectionProps.bias || false;
  }

  get bias(): boolean {
    return this._bias;
  }

  set bias(value: boolean) {
    this._bias = value;
    this.changes();
  }
}
