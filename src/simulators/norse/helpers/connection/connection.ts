// connection.ts

import { BaseConnection, ConnectionProps } from "@/helpers/connection/connection";

import { NorseConnections } from "./connections";

export interface NorseConnectionProps extends ConnectionProps {}

export class NorseConnection extends BaseConnection {
  constructor(connections: NorseConnections, connection: NorseConnectionProps) {
    super(connections, connection);
  }
}
