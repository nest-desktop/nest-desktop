// connection.ts

import {
  BaseConnection,
  IConnectionProps,
} from "@/helpers/connection/connection";

import { NorseConnections } from "./connections";

export interface INorseConnectionProps extends IConnectionProps {}

export class NorseConnection extends BaseConnection {
  constructor(
    connections: NorseConnections,
    connectionProps: INorseConnectionProps
  ) {
    super(connections, connectionProps);
  }
}
