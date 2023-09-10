// norseConnection.ts

import { BaseConnection, ConnectionProps } from "@/helpers/connection/baseConnection";

import { NorseConnections } from "./norseConnections";

export interface NorseConnectionProps extends ConnectionProps {}

export class NorseConnection extends BaseConnection {
  constructor(connections: NorseConnections, connection: NorseConnectionProps) {
    super(connections, connection, "NorseConnection");
  }
}
