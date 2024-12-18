// connections.ts

import { BaseConnections } from "@/helpers/connection/connections";

import { NorseNetwork } from "../network/network";
import { INorseConnectionProps, NorseConnection } from "./connection";

export class NorseConnections extends BaseConnections {
  constructor(network: NorseNetwork, connectionsProps: INorseConnectionProps[] = []) {
    super(network, connectionsProps);
  }

  override get Connection() {
    return NorseConnection;
  }

  override get all(): NorseConnection[] {
    return this.connections as NorseConnection[];
  }
}
